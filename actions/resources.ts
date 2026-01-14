'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { ResourceData, LibraryResource } from "@/components/resources/new-resource-types"

// DEFINICIÓN DE RESPUESTA ESTÁNDAR
export type ActionResponse = {
  success: boolean
  message: string
}

// DEFINICIÓN PARA EDICIÓN LIMPIA Y TIPADA
export interface EditResourcePayload {
  title: string
  description?: string
  category?: string
  tags?: string[] 
  link?: string   
}

// -----------------------------------------------------------------------------
// 1. GUARDAR RECURSO (INTACTO)
// -----------------------------------------------------------------------------
export async function saveResource(data: ResourceData) {
  const supabase = await createClient()

  // 1. Validar Usuario (Creador)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  // 2. Determinar Folder ID
  let targetFolderId = data.folder_id || data.folderId;
  if (targetFolderId === 'null' || targetFolderId === '') targetFolderId = null;

  // 3. Lógica de Visibilidad
  const hasShares = (data.shared_with && data.shared_with.length > 0) || 
                    (data.shared_groups && data.shared_groups.length > 0);
  
  const isPublic = data.is_public !== undefined ? data.is_public : !hasShares;

  console.log(`💾 Guardando Recurso. Creador: ${user.id} | Visibilidad: ${isPublic ? 'PÚBLICA' : 'PRIVADA'}`);

  // 4. Insertar Recurso Maestro en DB
  const { data: newResource, error } = await supabase
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

  if (error) {
    console.error("❌ Error DB:", error.message)
    return { success: false, message: error.message }
  }

  // 5. GESTIÓN DE COMPARTIDOS
  if (!isPublic) {
      const resourceId = newResource.id;
      const promises = [];

      // A. Usuarios Individuales
      if (data.shared_with && data.shared_with.length > 0) {
          const userShares = data.shared_with.map((uid: string) => ({
              resource_id: resourceId,
              user_id: uid
          }));
          promises.push(supabase.from('resource_shares').insert(userShares));
      }

      // B. Grupos
      if (data.shared_groups && data.shared_groups.length > 0) {
          const groupShares = data.shared_groups.map((gid: string) => ({
              resource_id: resourceId,
              group_id: gid
          }));
          promises.push(supabase.from('resource_group_shares').insert(groupShares));
      }

      if (promises.length > 0) {
          await Promise.all(promises);
          console.log(`✅ Permisos guardados.`);
      }
  }

  revalidatePath('/', 'layout')
  return { success: true, id: newResource.id, message: "Recurso creado correctamente." }
}

// -----------------------------------------------------------------------------
// 2. LECTURA DE RECURSOS (MODIFICADO: Filtro deleted_at)
// -----------------------------------------------------------------------------
export async function getFilesForView(
    viewType: 'HOME' | 'SHARED', 
    folderId: string | null = null
): Promise<LibraryResource[]> {
    
  const supabase = await createClient();

  let query = supabase
    .from('v_library_access')
    .select('*')
    // --- NUEVO: FILTRO DE SEGURIDAD PARA INICIO ---
    // Aseguramos que NO traiga los que tienen fecha de borrado
    .is('deleted_at', null) 
    // -----------------------------------------------
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

// -----------------------------------------------------------------------------
// 3. EDITAR RECURSO (INTACTO)
// -----------------------------------------------------------------------------
export async function updateResource(resourceId: string, payload: EditResourcePayload): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  if (!payload.title || payload.title.trim() === "") {
    return { success: false, message: "El título es obligatorio" }
  }

  const { data: currentResource, error: fetchError } = await supabase
    .from('resources')
    .select('file_type')
    .eq('id', resourceId)
    .single()

  if (fetchError || !currentResource) {
    return { success: false, message: "No se encontró el recurso original." }
  }

  type ResourceUpdateDB = {
    title: string
    description?: string
    category?: string
    tags?: string[]
    updated_at: string
    file_url?: string 
  }

  const updates: ResourceUpdateDB = { 
    title: payload.title, 
    description: payload.description,
    category: payload.category,
    tags: payload.tags, 
    updated_at: new Date().toISOString() 
  }

  if (payload.link !== undefined) {
    if (currentResource.file_type === 'link') {
       updates.file_url = payload.link
    } else {
       console.log("🔒 Edición de URL omitida: El recurso es un archivo.")
    }
  }

  const { error, data } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', resourceId)
    .select()

  if (error) {
      console.error("❌ Error Update:", error.message)
      return { success: false, message: error.message }
  }

  if (!data || data.length === 0) {
      return { success: false, message: "No se encontró el recurso o no tienes permiso." }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: "Recurso actualizado correctamente." }
}

// -----------------------------------------------------------------------------
// 4. ELIMINAR RECURSO (INTACTO - SOFT DELETE)
// -----------------------------------------------------------------------------
export async function deleteResource(resourceId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  console.log(`🗑️ Soft Delete recurso: ${resourceId} por usuario: ${user.id}`)

  const { error, data } = await supabase
    .from('resources')
    .update({ 
        deleted_at: new Date().toISOString(), 
        deleted_by: user.id                   
    })
    .eq('id', resourceId)
    .select()

  if (error) {
    console.error("❌ Error eliminando recurso:", error.message)
    return { success: false, message: `Error BD: ${error.message}` }
  }

  if (!data || data.length === 0) {
      return { success: false, message: "No se encontró el recurso." }
  }

  console.log("✅ Recurso enviado a papelera correctamente.")

  revalidatePath('/', 'layout')
  return { success: true, message: "Recurso eliminado correctamente." }
}


// -----------------------------------------------------------------------------
// 5. GESTIÓN DE PAPELERA (NUEVO - REQUERIMIENTO)
// -----------------------------------------------------------------------------

// A. OBTENER RECURSOS EN PAPELERA
export async function getTrashedResources() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, data: [] }

  // Consultamos la tabla resources directamente para obtener metadatos de borrado
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      profile:profiles!created_by(full_name, email), 
      deleter:profiles!deleted_by(full_name) 
    `) 
    // CONDICIÓN 1: Que ESTÉ eliminado (Soft Delete activo)
    .not('deleted_at', 'is', null)
    // CONDICIÓN 2: Seguridad (Solo mis recursos o recursos públicos/compartidos que borré)
    // Nota: Simplificamos a "creados por mí" o "públicos" para la vista general de papelera
    .or(`is_public.eq.true,created_by.eq.${user.id}`)
    .order('deleted_at', { ascending: false })

  if (error) {
    console.error("Error fetching trash:", error)
    return { success: false, data: [] }
  }

  return { success: true, data }
}

// B. RESTAURAR RECURSO
export async function restoreResource(resourceId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('resources')
    .update({ 
      deleted_at: null, 
      deleted_by: null 
    })
    .eq('id', resourceId)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/trash')
  return { success: true, message: "Recurso restaurado correctamente" }
}

// C. ELIMINAR DEFINITIVAMENTE (HARD DELETE + STORAGE)
export async function deletePermanently(resourceId: string) {
  const supabase = await createClient()

  // 1. Obtener info del archivo antes de borrar el registro
  const { data: resource } = await supabase
    .from('resources')
    .select('file_path, file_type')
    .eq('id', resourceId)
    .single()

  // 2. Si hay archivo físico en Storage, eliminarlo
  if (resource?.file_path && resource.file_type !== 'link') {
    const { error: storageError } = await supabase
      .storage
      .from('files') // Asegúrate que tu bucket se llama 'files'
      .remove([resource.file_path])
    
    if (storageError) console.error("⚠️ Error borrando archivo físico:", storageError)
  }

  // 3. Borrar registro de BD definitivamente
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId)

  if (error) return { success: false, message: error.message }

  revalidatePath('/dashboard/trash')
  return { success: true, message: "Eliminado permanentemente" }
}

// -----------------------------------------------------------------------------
// FUNCIONES AUXILIARES (INTACTAS)
// -----------------------------------------------------------------------------

export async function toggleFavorite(resourceId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuario no autenticado")

  const { error: deleteError, count } = await supabase
    .from('favorites')
    .delete({ count: 'exact' })
    .match({ user_id: user.id, resource_id: resourceId })

  if (deleteError) {
    console.error("Error eliminando favorito:", deleteError.message)
    throw new Error(deleteError.message)
  }

  if (count === 0) {
    const { error: insertError } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, resource_id: resourceId })
    
    if (insertError) {
        console.error("Error insertando favorito:", insertError.message)
        throw new Error(insertError.message)
    }
  }

  revalidatePath('/', 'layout') 
}

export async function incrementView(resourceId: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_downloads', { resource_id: resourceId }) 
}