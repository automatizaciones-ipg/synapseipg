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

  let finalCategory = categoryInput;
  let finalIsGlobal = false;

  if (categoryInput === "Globales" || categoryInput === "Todos" || categoryInput?.trim() === "") {
    finalCategory = null;
    finalIsGlobal = true; 
  } else {
    finalIsGlobal = false; 
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      parent_id: parentId,
      user_id: user.id,
      is_global: finalIsGlobal,
      category: finalCategory 
    })
    .select('*')
    .single()

  if (error) {
    console.error("❌ Error creando carpeta:", error.message)
    return { success: false, message: error.message }
  }
  
  revalidatePath('/', 'layout')
  // MENSAJE AGREGADO AQUÍ
  return { success: true, data: data as FolderRow, message: "Carpeta creada correctamente." }
}

// ---------------------------------------------------------
// 2. OBTENER CARPETAS (INTACTO)
// ---------------------------------------------------------
export async function getFolders(
  parentId: string | null, 
  isGlobalTab: boolean, 
  categoryInput: string | null = null 
): Promise<ActionResponse<FolderRow[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, data: [] }

  let query = supabase
    .from('folders')
    .select('*')
    .order('name')

  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  if (categoryInput && categoryInput !== "Globales" && categoryInput !== "Todos") {
      query = query.eq('category', categoryInput)
      if (!isGlobalTab) query = query.eq('user_id', user.id) 
  } 
  else if (isGlobalTab || categoryInput === "Globales") {
      query = query.eq('is_global', true)
      if (!parentId) query = query.is('category', null)
  } 
  else {
      query = query
        .eq('user_id', user.id)
        .eq('is_global', false)
        .is('category', null) 
  }

  const { data, error } = await query

  if (error) {
    console.error("❌ Error fetching folders:", error.message)
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
  // MENSAJE AGREGADO AQUÍ
  return { success: true, message: "Carpeta renombrada correctamente." }
}

// ---------------------------------------------------------
// 4. ELIMINAR CARPETA
// ---------------------------------------------------------
export async function deleteFolder(folderId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autorizado" }

  console.log(`🗑️ Eliminando carpeta ${folderId}`)

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

  console.log("✅ Carpeta eliminada")
  revalidatePath('/', 'layout')
  // MENSAJE AGREGADO AQUÍ
  return { success: true, message: "Carpeta eliminada correctamente." }
}