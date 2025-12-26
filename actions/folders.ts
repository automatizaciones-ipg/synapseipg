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

  // --- LÓGICA DE VISIBILIDAD CORREGIDA ---
  
  let finalCategory = categoryInput;
  let finalIsGlobal = false;

  // CASO 1: Pestaña "Globales" (Raíz del sistema)
  if (categoryInput === "Globales" || categoryInput === "Todos" || categoryInput?.trim() === "") {
    finalCategory = null;
    finalIsGlobal = true; // Solo aquí activamos el flag global real
  } 
  // CASO 2: Pestaña Específica (Ej: "Comunicaciones", "Admisión")
  else {
    // Mantenemos la categoría tal cual llega (para que aparezca en su pestaña)
    // Pero forzamos is_global a FALSE.
    // Esto evita que se marque como "carpeta del sistema" y permite que la lógica
    // de permisos funcione por categoría.
    finalIsGlobal = false; 
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      parent_id: parentId,
      user_id: user.id,
      is_global: finalIsGlobal, // Usamos el valor calculado
      category: finalCategory 
    })
    .select('*')
    .single()

  if (error) {
    console.error("Error creating folder:", error.message)
    return { success: false, message: error.message }
  }
  
  revalidatePath('/', 'layout')
  return { success: true, data: data as FolderRow }
}

// ---------------------------------------------------------
// 2. OBTENER CARPETAS (CON FILTRO DE USUARIO EN FAVORITOS)
// ---------------------------------------------------------
export async function getFolders(
  parentId: string | null, 
  isGlobalTab: boolean, 
  categoryInput: string | null = null 
): Promise<ActionResponse<FolderRow[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('folders')
    .select('*')
    .order('name')

  // A. FILTRO PADRE
  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }

  // B. FILTRO DE CONTEXTO

  // CAMINO 1: Categoría específica (Aquí entra "Favoritos", "Compartidos", "Comunicaciones")
  if (categoryInput && categoryInput !== "Globales" && categoryInput !== "Todos") {
      query = query.eq('category', categoryInput)
      
      // Si estamos en "Mis Archivos" (no global tab) viendo una categoría, filtramos por usuario
      if (!isGlobalTab) {
          if (!user) return { success: false, data: [] }
          query = query.eq('user_id', user.id)
      }
  } 
  
  // CAMINO 2: Raíz Global ("Globales")
  else if (isGlobalTab || categoryInput === "Globales") {
      query = query.eq('is_global', true)
      
      if (!parentId) {
          query = query.is('category', null)
      }
  } 
  
  // CAMINO 3: Personal ("Mis Recursos" / Raíz)
  else {
      if (!user) return { success: false, data: [] }
      // Corrección adicional: Aseguramos que solo traiga carpetas SIN categoría
      // para que las de "Comunicaciones" no aparezcan mezcladas aquí.
      query = query
        .eq('user_id', user.id)
        .eq('is_global', false)
        .is('category', null) 
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching folders:", error.message)
    return { success: false, data: [] }
  }

  return { success: true, data: (data as FolderRow[]) || [] }
}

// ---------------------------------------------------------
// 3. EDITAR Y BORRAR
// ---------------------------------------------------------
export async function updateFolder(folderId: string, newName: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const { error } = await supabase.from('folders').update({ name: newName }).eq('id', folderId)
  if (error) return { success: false, message: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteFolder(folderId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const { error } = await supabase.from('folders').delete().eq('id', folderId)
  if (error) return { success: false, message: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}