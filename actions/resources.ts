'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ResourceData {
  title: string
  description: string
  category: string
  tags: string[]
  file_url?: string | null
  file_path?: string | null
  file_type?: string | null
  file_size?: number
  link?: string | null 
  color: string 
  shared_with?: string[]   // IDs de usuarios individuales
  shared_groups?: string[] // IDs de grupos
  folder_id?: string | null 
  folderId?: string | null 
  is_public?: boolean 
}

// -----------------------------------------------------------------------------
// 1. GUARDAR RECURSO (Con Lógica de Expansión: Grupos -> Usuarios Individuales)
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
  
  const isPublic = !hasShares;

  console.log(`💾 Guardando Recurso. Creador: ${user.id} | Visibilidad: ${isPublic ? 'PÚBLICA' : 'PRIVADA'}`);

  // 4. Insertar Recurso en DB
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

  // 5. GESTIÓN DE COMPARTIDOS (AJUSTE QUIRÚRGICO)
  if (!isPublic) {
      const resourceId = newResource.id;

      // A. Creamos un SET ÚNICO para acumular todos los IDs de usuario que deben tener acceso.
      // Inicializamos con los usuarios manuales y AGREGAMOS AL CREADOR (Obligatorio).
      const uniqueUsers = new Set(data.shared_with || []);
      uniqueUsers.add(user.id); 

      // B. Si hay GRUPOS seleccionados, procesamos:
      if (data.shared_groups && data.shared_groups.length > 0) {
          
          // 1. Registrar la relación Grupo-Recurso (Para auditoría y mostrar "Compartido con Grupo X")
          const groupShares = data.shared_groups.map(gid => ({
              resource_id: resourceId,
              group_id: gid
          }));
          
          // Insertamos en 'resource_group_shares' (Sin await bloqueante estricto si no queremos detener flujo)
          const { error: groupError } = await supabase.from('resource_group_shares').insert(groupShares);
          if (groupError) console.error("Error guardando referencia de grupo:", groupError);

          // 2. 🔥 OBTENER MIEMBROS DE ESOS GRUPOS 🔥
          // Consultamos la tabla 'group_members' para ver quiénes están en esos grupos.
          const { data: groupMembers } = await supabase
              .from('group_members') 
              .select('user_id')
              .in('group_id', data.shared_groups);

          // 3. AGREGAR MIEMBROS AL SET ÚNICO
          // Aquí fusionamos los usuarios del grupo con los manuales y el creador.
          if (groupMembers) {
              groupMembers.forEach(member => {
                  if (member.user_id) uniqueUsers.add(member.user_id);
              });
          }
      }

      // C. INSERTAR TODOS LOS PERMISOS EN 'resource_shares'
      // Ahora uniqueUsers contiene: [Creador, Usuarios Manuales, Miembros de Grupos]
      if (uniqueUsers.size > 0) {
          const finalUserShares = Array.from(uniqueUsers).map(uid => ({
              resource_id: resourceId,
              user_id: uid
          }));
          
          const { error: shareError } = await supabase.from('resource_shares').insert(finalUserShares);
          
          if (shareError) {
             console.error("Error final compartiendo usuarios:", shareError);
          } else {
             console.log(`✅ Permisos otorgados a ${uniqueUsers.size} usuarios (incluyendo miembros de grupos).`);
          }
      }
  }

  // 6. Revalidación
  revalidatePath('/', 'layout')
  
  return { success: true, id: newResource.id }
}

// -----------------------------------------------------------------------------
// FUNCIONES AUXILIARES (Sin cambios, incluidas para completar el archivo)
// -----------------------------------------------------------------------------

export async function toggleFavorite(resourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, resource_id: resourceId })
  }
  revalidatePath('/', 'layout')
}

export async function incrementView(resourceId: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_downloads', { resource_id: resourceId }) 
}

export async function deleteResource(resourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado." }

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId)

  if (error) return { success: false, message: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateResource(resourceId: string, formData: FormData) {
  const supabase = await createClient()
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  
  if (!title) return { success: false, message: "El título es obligatorio" }

  const { error } = await supabase
    .from('resources')
    .update({ 
      title, 
      description, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', resourceId)

  if (error) return { success: false, message: error.message }

  revalidatePath('/')
  return { success: true, message: "Recurso actualizado" }
}