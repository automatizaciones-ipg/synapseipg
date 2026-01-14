'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ---------------------------------------------------------
// TIPOS
// ---------------------------------------------------------
export interface FolderRow {
  id: string
  name: string
  parent_id: string | null
  user_id: string
  is_global: boolean
  category: string | null
  created_at: string
}

export type ActionResponse<T = null> = {
  success: boolean
  message?: string
  data?: T
}

// ---------------------------------------------------------
// 1. CREAR CARPETA (Ahora crea todo como global por defecto)
// ---------------------------------------------------------
export async function createFolder(
  name: string, 
  parentId: string | null, 
  isGlobal: boolean, 
  categoryInput: string | null
): Promise<ActionResponse<FolderRow>> {
  const supabase = await createClient() 
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, message: "Debes iniciar sesión." }

  // Normalizamos la categoría
  let finalCategory = categoryInput;
  if (categoryInput === "Globales" || categoryInput === "Todos" || categoryInput?.trim() === "") {
    finalCategory = null;
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      parent_id: parentId,
      user_id: user.id,
      is_global: true, // Guardamos siempre como true para mantener orden, pero ya no afectará la lectura
      category: finalCategory 
    })
    .select('*')
    .single()

  if (error) {
    console.error("❌ Error creando carpeta:", error.message)
    return { success: false, message: error.message }
  }
  
  revalidatePath('/', 'layout')
  return { success: true, data: data as FolderRow, message: "Carpeta creada correctamente." }
}

// ---------------------------------------------------------
// 2. OBTENER CARPETAS (MODO: TODO PÚBLICO)


export async function getFolders(
  parentId: string | null, 
  isGlobalTab: boolean, // Mantenemos el argumento para no romper llamadas, pero no lo usaremos para restringir
  categoryInput: string | null = null 
): Promise<ActionResponse<FolderRow[]>> {
  const supabase = await createClient()
  
  // Solo verificamos que esté logueado, no quién es.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: [] }

  // 1. Consulta limpia: Trae todo
  let query = supabase
    .from('folders')
    .select('*')
    .order('name')

  // 2. Filtro de Carpeta Padre (Navegación)
  // Fundamental para entrar y salir de carpetas
  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  // 3. Filtro de Pestañas (Visualización)
  // Esto solo organiza visualmente, no oculta por seguridad
  if (categoryInput && categoryInput !== "Todos" && categoryInput !== "Globales") {
      // Si el usuario clicó "RRHH", mostramos carpetas de RRHH
      query = query.eq('category', categoryInput)
  } else {
      // Si está en Inicio/Globales/Todos, mostramos:
      // a) Las que dicen 'General' (que seteamos en el SQL)
      // b) O las que sean NULL (por si acaso)
      // c) O las que sean Globales
      // Para simplificar al máximo y ver TODO en el inicio:
      
      // Opción A: Si quieres ver ABSOLUTAMENTE TODO en el inicio mezclado:
      // (No agregues ningún filtro .eq más aquí)
      
      // Opción B (Recomendada): Mostrar solo las de nivel raíz que no son de una categoría específica
      // Como en el SQL pusimos 'General' a las vacías, filtramos por eso o NULL.
      query = query.or('category.is.null,category.eq.General,category.eq.""')
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Error DB:", error.message)
    return { success: false, data: [] }
  }

  return { success: true, data: (data as FolderRow[]) || [] }
}

// ---------------------------------------------------------
// 3. EDITAR CARPETA
// ---------------------------------------------------------
export async function updateFolder(folderId: string, newName: string): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado" }
  if (!newName || newName.trim() === "") return { success: false, message: "Nombre inválido" }

  const { data, error } = await supabase
    .from('folders')
    .update({ name: newName })
    .eq('id', folderId)
    .select() 

  if (error) {
    console.error("❌ Error update:", error.message)
    return { success: false, message: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, message: "No se encontró la carpeta o no hubo cambios." }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: "Carpeta renombrada correctamente." }
}

// ---------------------------------------------------------
// 4. ELIMINAR CARPETA
// ---------------------------------------------------------
export async function deleteFolder(folderId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado" }

  const { data, error } = await supabase
    .from('folders')
    .delete() 
    .eq('id', folderId)
    .select()

  if (error) {
    console.error("❌ Error delete:", error.message)
    return { success: false, message: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, message: "No se encontró la carpeta." }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: "Carpeta eliminada correctamente." }
}