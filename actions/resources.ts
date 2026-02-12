'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { ResourceData, LibraryResource } from "@/components/resources/new-resource-types"
import { sendResourceSharedEmailAction } from "@/actions/email-actions"

// --- TIPOS Y DEFINICIONES ESTRICTAS ---

export type ActionResponse = {
  success: boolean
  message: string
  id?: string
}

export interface UpdateResourcePayload {
  title: string
  description?: string
  category?: string
  tags?: string[]
  link?: string
  is_public: boolean
  shared_with: string[]
  shared_groups: string[]
  last_version: number
}

// Tipo interno estricto para la DB
type ResourceUpdateDB = {
  title: string
  description?: string
  category?: string
  tags?: string[]
  is_public: boolean
  updated_at: string
  file_url?: string
}

// Interfaces para la Notificación (Eliminan el uso de any en los Joins)
interface ProfileSelect {
  email: string | null
  full_name: string | null
  id: string
}

interface GroupMemberJoin {
  user_id: string
  profiles: ProfileSelect | null
}

// -----------------------------------------------------------------------------
// 1. GUARDAR RECURSO (CREATE) - BLINDADO CON INTEGRIDAD TRANSACCIONAL
// -----------------------------------------------------------------------------
export async function saveResource(data: ResourceData): Promise<ActionResponse> {
  const supabase = await createClient()

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  // 2. RBAC: Rol de Usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = profile?.role || 'auditor'
  const isSuperUser = ['admin', 'global_admin'].includes(userRole)

  // 3. Regla de Negocio: Bloqueo de subida física para no-admins
  if ((data.file_path || (data.file_type && data.file_type !== 'link')) && !isSuperUser) {
    // Si intentó subir algo y no tiene permiso, intentamos borrar el archivo huérfano del storage por seguridad
    if (data.file_path) await supabase.storage.from('resources').remove([data.file_path])
    
    return { 
      success: false, 
      message: "⛔ Permiso denegado: Tu rol solo permite compartir enlaces, no subir archivos." 
    }
  }

  let targetFolderId = data.folder_id || data.folderId;
  if (targetFolderId === 'null' || targetFolderId === '') targetFolderId = null;

  const hasShares = (data.shared_with && data.shared_with.length > 0) ||
    (data.shared_groups && data.shared_groups.length > 0);

  const isPublic = data.is_public !== undefined ? data.is_public : !hasShares;
  let createdResourceId: string | null = null;

  try {
    // A. Insertar Metadatos
    const { data: newResource, error: insertError } = await supabase
      .from('resources')
      .insert({
        title: data.title,
        description: data.description,
        category: data.category || 'Otros',
        tags: data.tags,
        file_url: data.link || data.file_url || null,
        file_path: data.file_path || null,
        file_type: data.file_type || 'link',
        file_size: data.file_size || 0,
        dominant_color: data.color,
        created_by: user.id,
        version: 1, 
        is_public: isPublic,
        folder_id: targetFolderId
      })
      .select('id')
      .single()

    if (insertError) {
        // ROLLBACK STORAGE: Si falla la BD, borramos el archivo físico subido
        if (data.file_path) {
            console.warn(`🔄 Rollback Storage: Eliminando ${data.file_path}`);
            await supabase.storage.from('resources').remove([data.file_path]);
        }
        throw new Error(insertError.message);
    }

    createdResourceId = newResource.id;

    // B. Gestión de Permisos (Si no es público)
    if (!isPublic) {
      const shareOperations: PromiseLike<unknown>[] = [];

      // 1. Usuarios
      if (data.shared_with && data.shared_with.length > 0) {
        const userShares = data.shared_with.map((uid: string) => ({
          resource_id: createdResourceId,
          user_id: uid,
          resource_created_by: user.id
        }));
        shareOperations.push(supabase.from('resource_shares').insert(userShares));
      }

      // 2. Grupos
      if (data.shared_groups && data.shared_groups.length > 0) {
        const groupShares = data.shared_groups.map((gid: string) => ({
          resource_id: createdResourceId,
          group_id: gid,
          resource_created_by: user.id
        }));
        shareOperations.push(supabase.from('resource_group_shares').insert(groupShares));
      }

      // Ejecutar inserciones
      if (shareOperations.length > 0) {
        const results = await Promise.allSettled(shareOperations);
        
        // ROLLBACK DB: Si fallan los permisos, borramos el recurso para no dejarlo "invisible" e inaccesible
        const failed = results.some(r => r.status === 'rejected');
        if (failed) {
             throw new Error("Error al asignar permisos. Operación revertida.");
        }

        // C. NOTIFICACIÓN (Solo si todo es éxito)
        await notifyNewShares(
          createdResourceId!,
          data.title,
          user.id,
          data.shared_with || [],
          data.shared_groups || []
        );
      }
    }

    revalidatePath('/', 'layout')
    return { success: true, id: newResource.id, message: "Recurso publicado correctamente." }

  } catch (error: unknown) {
    let errorMessage = "Error desconocido al guardar";

    if (error instanceof Error) {
        errorMessage = error.message;
        // Limpieza de mensajes técnicos de Postgres
        if (errorMessage.includes("⛔")) {
            const parts = errorMessage.split("⛔");
            if (parts.length > 1) errorMessage = "⛔ " + parts[1].trim();
        }
    }

    console.error("❌ Error Save Resource:", errorMessage);

    // ROLLBACK FINAL DE EMERGENCIA: Si se creó el ID pero falló algo crítico después
    if (createdResourceId) {
        await supabase.from('resources').delete().eq('id', createdResourceId);
    }
    // ROLLBACK FINAL STORAGE: Asegurar limpieza si existe path y falló la transacción
    if (data.file_path && !createdResourceId) {
         await supabase.storage.from('resources').remove([data.file_path]);
    }

    return { success: false, message: errorMessage }
  }
}

// -----------------------------------------------------------------------------
// 2. LECTURA DE RECURSOS (READ)
// -----------------------------------------------------------------------------
export async function getFilesForView(
  viewType: 'HOME' | 'SHARED',
  folderId: string | null = null
): Promise<LibraryResource[]> {

  const supabase = await createClient();

  let query = supabase
    .from('v_library_access')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (viewType === 'SHARED') {
    query = query.in('access_reason', ['SHARED_USER', 'SHARED_GROUP']);
  }

  if (folderId) {
    query = query.eq('folder_id', folderId);
  } else {
    query = query.is('folder_id', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching view:", error);
    return [];
  }

  return data as LibraryResource[];
}

export async function updateResource(resourceId: string, payload: UpdateResourcePayload): Promise<ActionResponse> {
  const supabase = await createClient()

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  if (!payload.title || payload.title.trim() === "") {
    return { success: false, message: "El título es obligatorio" }
  }

  try {
    // 2. DIAGNÓSTICO PREVIO (Lectura Crítica)
    const { data: currentResource, error: fetchError } = await supabase
      .from('resources')
      .select('created_by, version')
      .eq('id', resourceId)
      .single()

    if (fetchError || !currentResource) {
      return { success: false, message: "El recurso no existe o no tienes acceso." }
    }

    // 3. SEGURIDAD RBAC (Dueño o Admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = profile?.role || 'auditor'
    const isSuperUser = ['admin', 'global_admin'].includes(userRole)
    const isOwner = currentResource.created_by === user.id

    if (!isOwner && !isSuperUser) {
      return { success: false, message: "⛔ Solo el propietario o un administrador pueden editar este recurso." }
    }

    // 4. CONTROL DE CONCURRENCIA INTELIGENTE (Solución al Falso Positivo)
    // Tratamos null como 0 para recursos antiguos
    const currentDbVersion = currentResource.version ?? 0;
    
    // Si el payload trae versión, validamos estrictamente. 
    // Si NO trae (undefined), asumimos que es la actual para DESBLOQUEARTE ahora mismo.
    const clientVersion = payload.last_version !== undefined ? payload.last_version : currentDbVersion;

    if (currentDbVersion !== clientVersion) {
      return { 
        success: false, 
        message: "⚠️ CONFLICTO REAL: Alguien más guardó cambios en este recurso hace un instante. Recarga para no perder datos." 
      }
    }

    // 5. PREPARACIÓN DE PERMISOS (Anti-Huérfanos)
    const sharesToInsertUsers = (payload.shared_with || []).map(uid => ({
      resource_id: resourceId,
      user_id: uid,
      resource_created_by: currentResource.created_by
    }));

    const sharesToInsertGroups = (payload.shared_groups || []).map(gid => ({
      resource_id: resourceId,
      group_id: gid,
      resource_created_by: currentResource.created_by
    }));

    // 6. UPDATE ATÓMICO (Atomicidad de Versión)
    const nextVersion = currentDbVersion + 1;

    // Intersección de tipos para evitar 'any' y mantener tipado estricto
    const dbUpdates: ResourceUpdateDB & { version: number } = {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      tags: payload.tags || [],
      is_public: payload.is_public,
      updated_at: new Date().toISOString(),
      version: nextVersion,
      // file_url es opcional en ResourceUpdateDB
    }

    if (payload.link !== undefined) {
      dbUpdates.file_url = payload.link;
    }

    // Ejecutamos Update
    // NOTA: Si el cliente no mandó versión, usamos la currentDbVersion para asegurar el "paso de testigo"
    const { error: mainError, count } = await supabase
      .from('resources')
      .update(dbUpdates)
      .eq('id', resourceId)
      .eq('version', currentDbVersion) // Compare-and-Swap estricto en BD

    if (mainError) throw new Error(mainError.message)

    // Si count es 0, hubo una "Colisión de Carrera" (Race Condition) en el último milisegundo
    if (count === 0) {
      return { success: false, message: "Integridad de datos: El recurso fue modificado por otro proceso justo ahora." }
    }

    // 7. SINCRONIZACIÓN DE PERMISOS
    await supabase.from('resource_shares').delete().eq('resource_id', resourceId)
    await supabase.from('resource_group_shares').delete().eq('resource_id', resourceId)

    if (!payload.is_public) {
      const permissionOps: PromiseLike<unknown>[] = [];

      if (sharesToInsertUsers.length > 0) {
        permissionOps.push(supabase.from('resource_shares').insert(sharesToInsertUsers))
      }

      if (sharesToInsertGroups.length > 0) {
        permissionOps.push(supabase.from('resource_group_shares').insert(sharesToInsertGroups))
      }

      if (permissionOps.length > 0) {
        await Promise.all(permissionOps);
        
        // Notificación (Tu lógica original)
        await notifyNewShares(
          resourceId,
          payload.title,
          user.id,
          payload.shared_with || [],
          payload.shared_groups || []
        );
      }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: "Recurso actualizado correctamente." }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar";
    console.error("❌ Error Update Resource:", errorMessage)
    return { success: false, message: errorMessage }
  }
}

// -----------------------------------------------------------------------------
// 4. ELIMINAR RECURSO
// -----------------------------------------------------------------------------
export async function deleteResource(resourceId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  const { error } = await supabase
    .from('resources')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id
    })
    .eq('id', resourceId)

  if (error) return { success: false, message: `Error BD: ${error.message}` }

  revalidatePath('/', 'layout')
  return { success: true, message: "Recurso movido a la papelera." }
}

// -----------------------------------------------------------------------------
// 5. GESTIÓN ESPECÍFICA DE PERMISOS
// -----------------------------------------------------------------------------
export async function updateResourcePermissions(
  resourceId: string,
  mode: 'global' | 'users' | 'groups',
  ids: string[]
): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado" }

  try {
    await supabase.from('resource_shares').delete().eq('resource_id', resourceId)
    await supabase.from('resource_group_shares').delete().eq('resource_id', resourceId)

    if (mode === 'global') {
      await supabase
        .from('resources')
        .update({ is_public: true, updated_at: new Date().toISOString() })
        .eq('id', resourceId)

    } else {
      await supabase
        .from('resources')
        .update({ is_public: false, updated_at: new Date().toISOString() })
        .eq('id', resourceId)

      if (ids.length > 0) {
        if (mode === 'users') {
          const inserts = ids.map(uid => ({ resource_id: resourceId, user_id: uid }))
          const { error } = await supabase.from('resource_shares').insert(inserts)
          if (error) throw error
        }
        else if (mode === 'groups') {
          const inserts = ids.map(gid => ({ resource_id: resourceId, group_id: gid }))
          const { error } = await supabase.from('resource_group_shares').insert(inserts)
          if (error) throw error
        }

        const { data: resData } = await supabase.from('resources').select('title').eq('id', resourceId).single();
        if (resData) {
          await notifyNewShares(
            resourceId,
            resData.title,
            user.id,
            mode === 'users' ? ids : [],
            mode === 'groups' ? ids : []
          );
        }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: "Permisos actualizados correctamente" }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error updateResourcePermissions:", errorMessage)
    return { success: false, message: errorMessage }
  }
}

// -----------------------------------------------------------------------------
// 6. UTILS (Papelera, Favoritos, etc)
// -----------------------------------------------------------------------------

export async function getTrashedResources() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: [] }

  const { data, error } = await supabase
    .from('resources')
    .select('*, profile:profiles!created_by(full_name, email), deleter:profiles!deleted_by(full_name)')
    .not('deleted_at', 'is', null)
    .or(`is_public.eq.true,created_by.eq.${user.id}`)
    .order('deleted_at', { ascending: false })

  if (error) return { success: false, data: [] }
  return { success: true, data }
}

export async function restoreResource(resourceId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('resources').update({ deleted_at: null, deleted_by: null }).eq('id', resourceId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/', 'layout')
  return { success: true, message: "Recurso restaurado" }
}

// -----------------------------------------------------------------------------
// ELIMINAR PERMANENTEMENTE (HARD DELETE) - BLINDADO CON ROLES
// -----------------------------------------------------------------------------
export async function deletePermanently(resourceId: string) {
  const supabase = await createClient()
  
  // 1. Obtener Usuario (Necesario para verificar permisos)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  // --- 🛡️ INICIO BLINDAJE DE SEGURIDAD ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Solo global_admin y admin pueden destruir datos. Auditor (user) NO.
  if (!['global_admin', 'admin'].includes(profile?.role)) {
    return { 
      success: false, 
      message: "⛔ Permiso denegado: No tienes nivel suficiente para eliminar registros definitivamente." 
    }
  }

  const { data: resource } = await supabase.from('resources').select('file_path, file_type').eq('id', resourceId).single()

  if (resource?.file_path && resource.file_type !== 'link') {
    await supabase.storage.from('resources').remove([resource.file_path])
  }

  const { error } = await supabase.from('resources').delete().eq('id', resourceId)
  
  if (error) return { success: false, message: error.message }
  
  revalidatePath('/', 'layout')
  return { success: true, message: "Eliminado permanentemente" }
}

export async function toggleFavorite(resourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No auth")

  const { error, count } = await supabase.from('favorites').delete({ count: 'exact' }).match({ user_id: user.id, resource_id: resourceId })
  if (count === 0) {
    await supabase.from('favorites').insert({ user_id: user.id, resource_id: resourceId })
  }
  revalidatePath('/', 'layout')
}

export async function incrementView(resourceId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('increment_downloads', { resource_id: resourceId })
  if (error) console.error("Error incrementando contador:", error)
}


// -----------------------------------------------------------------------------
// 7. HELPER PRIVADO: LÓGICA DE NOTIFICACIÓN DE EMAIL (STRICT MODE)
// -----------------------------------------------------------------------------
async function notifyNewShares(
  resourceId: string,
  resourceTitle: string,
  senderId: string,
  userIds: string[],
  groupIds: string[]
) {
  if (userIds.length === 0 && groupIds.length === 0) return;

  // Instanciamos el cliente AQUÍ para evitar pasar tipos complejos por argumentos
  // y evitar el error "Unexpected any" del linter.
  const supabase = await createClient();

  try {
    console.log(`📧 Iniciando notificaciones para recurso: ${resourceTitle}`);

    // 1. Obtener nombre del remitente (Tipado explícito de la respuesta)
    const { data: senderData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', senderId)
      .single<{ full_name: string | null }>();

    const senderName = senderData?.full_name || 'Un colega';

    // 2. Recolectar emails objetivo
    const targetEmails = new Map<string, string>(); // Email -> Name

    // A. Emails de Usuarios Directos
    if (userIds.length > 0) {
      // Usamos el tipo ProfileSelect que definimos arriba
      const { data: users } = await supabase
        .from('profiles')
        .select('email, full_name, id')
        .in('id', userIds)
        .returns<ProfileSelect[]>();

      users?.forEach((u) => {
        if (u.id !== senderId && u.email) {
          targetEmails.set(u.email, u.full_name || 'Usuario');
        }
      });
    }

    // B. Emails de Grupos (Join explícito tipado)
    if (groupIds.length > 0) {
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('user_id, profiles!inner(email, full_name, id)')
        .in('group_id', groupIds)
        .returns<GroupMemberJoin[]>(); // <--- AQUÍ ESTÁ EL FIX DEL ANY

      // Ahora 'item' está tipado correctamente como GroupMemberJoin
      groupMembers?.forEach((item) => {
        const u = item.profiles;
        // Type Guard y validación de nulidad
        if (u && u.email && u.id !== senderId) {
          targetEmails.set(u.email, u.full_name || 'Usuario');
        }
      });
    }

    // 3. Enviar Correos en Paralelo
    if (targetEmails.size > 0) {
      const emailPromises = Array.from(targetEmails.entries()).map(([email, name]) => {
        return sendResourceSharedEmailAction(
          email,
          name,
          senderName,
          resourceTitle,
          resourceId
        );
      });

      const results = await Promise.all(emailPromises);
      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Notificaciones enviadas: ${successCount}/${targetEmails.size}`);
    }

  } catch (e) {
    console.error("❌ Error en notifyNewShares:", e instanceof Error ? e.message : e);
  }
}


// -----------------------------------------------------------------------------
// 8. DASHBOARD HERO: FEED PÚBLICO (OPTIMIZED & STRICT)
// -----------------------------------------------------------------------------

// Definición estricta de la estructura de la respuesta DB (Join profiles)
// Esto asegura que el frontend sepa exactamente si profiles es array, objeto o null.
export interface DashboardPublicResource {
  id: string
  title: string
  file_type: string // Coherente con tu saveResource
  created_at: string
  // Mapeo preciso de la relación: created_by -> profiles
  profiles: { 
    full_name: string | null 
  } | null 
}

/**
 * Obtiene los recursos públicos más recientes para el Hero del Dashboard.
 * Aplica filtros de seguridad (no eliminados) y optimización de selección.
 */
export async function getPublicFeedForDashboard(limit = 5): Promise<DashboardPublicResource[]> {
  const supabase = await createClient()

  try {
    // No necesitamos verificar auth estricta para leer datos públicos, 
    // pero mantenemos la consistencia del cliente.
    
    const { data, error } = await supabase
      .from('resources')
      .select('id, title, file_type, created_at, profiles:created_by(full_name)')
      .eq('is_public', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)
      // 🔥 CRÍTICO: Esto fuerza a TypeScript a tratar la respuesta como nuestra interfaz
      // y valida que la query construida coincida con la estructura esperada.
      .returns<DashboardPublicResource[]>() 

    if (error) {
      console.error("❌ Error fetching public feed:", error.message)
      // En arquitectura resiliente, fallar el feed no debe romper la app, devolvemos array vacío.
      return []
    }

    return data || []

  } catch (error) {
    console.error("❌ Excepción crítica en getPublicFeedForDashboard:", error)
    return []
  }
}