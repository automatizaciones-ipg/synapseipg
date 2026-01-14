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
// 1. CREAR CARPETA
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
      // CORRECCIÓN: Usamos el valor del argumento para respetar tu decisión de UI
      // Si marcas el checkbox es Global, si no, es "Normal" (pero igual será editable por todos gracias a RLS)
      is_global: isGlobal, 
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
// 2. OBTENER CARPETAS (MODO: TODO PÚBLICO / WIKI)
// ---------------------------------------------------------
export async function getFolders(
  parentId: string | null, 
  isGlobalTab: boolean, 
  categoryInput: string | null = null 
): Promise<ActionResponse<FolderRow[]>> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: [] }

  // 1. Consulta limpia
  let query = supabase
    .from('folders')
    .select('*')
    .order('name')

  // 2. Filtro de Carpeta Padre (Navegación)
  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  // 3. Filtro de Categoría
  if (categoryInput && categoryInput !== "Todos" && categoryInput !== "Globales") {
      // Si estamos en una categoría específica (ej: RRHH), filtramos por ella
      query = query.eq('category', categoryInput)
  } else {
      // Si estamos en Inicio/Todos:
      // Mostramos las que NO tienen categoría o son "General".
      // NO filtramos por usuario. Queremos ver las carpetas de TODOS.
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