'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- INTERFACES ---
interface ResourceData {
  title: string
  description: string
  category: string
  tags: string[]
  file_url: string
  file_path?: string 
  file_type: string
  file_size?: number
  color: string
}

// =================================================================
// 1. CREAR RECURSO (Tu código original intacto)
// =================================================================
export async function createResource(data: ResourceData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "No autorizado" }

  const { error } = await supabase.from('resources').insert({
    title: data.title,
    description: data.description,
    category: data.category,
    tags: data.tags,
    file_url: data.file_url,
    file_path: data.file_path || null,
    file_type: data.file_type,
    file_size: data.file_size || 0,
    dominant_color: data.color, 
    created_by: user.id,
    is_public: true
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: "Guardado correctamente" }
}

// =================================================================
// 2. TOGGLE FAVORITE (Nueva lógica Fase 6)
// =================================================================
export async function toggleFavorite(resourceId: string) {
  const supabase = await createClient()
  
  // 1. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Debes iniciar sesión")

  // 2. Verificar si ya existe en favoritos
  const { data: existing } = await supabase
    .from('favorites')
    .select()
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .single()

  if (existing) {
    // 3A. Si existe, lo borramos (Quitar de favoritos)
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
  } else {
    // 3B. Si no existe, lo creamos (Guardar en favoritos)
    await supabase
      .from('favorites')
      .insert({ user_id: user.id, resource_id: resourceId })
  }

  // 4. Revalidar rutas para actualizar UI
  revalidatePath('/dashboard')
  revalidatePath(`/resources/${resourceId}`)
}

// =================================================================
// 3. INCREMENTAR VISTAS/DESCARGAS (Checklist Fase 6)
// =================================================================
export async function incrementView(resourceId: string) {
  const supabase = await createClient()
  
  // Obtenemos el valor actual para sumarle 1
  // Nota: Idealmente esto se hace con una función RPC de base de datos 
  // para evitar condiciones de carrera, pero para este MVP esto funciona bien.
  const { data: resource } = await supabase
    .from('resources')
    .select('downloads_count')
    .eq('id', resourceId)
    .single()

  if (resource) {
    const newCount = (resource.downloads_count || 0) + 1
    
    await supabase
      .from('resources')
      .update({ downloads_count: newCount })
      .eq('id', resourceId)
  }
  
  // No hacemos revalidatePath aquí para no recargar toda la página 
  // solo por un contador de vistas, se actualizará en la próxima navegación.
}