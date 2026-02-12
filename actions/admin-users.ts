'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// 1. DEFINICIÓN DE TIPOS (Exportados para que tu Front los pueda leer)
export type UserRole = 'global_admin' | 'admin' | 'auditor';

export type UserStat = {
  id: string
  email: string
  full_name: string
  role: UserRole // Usamos el tipo estricto aquí
  avatar_url: string | null
  created_at: string
  storage_used: number
  files_count: number
}

// 2. OBTENER LISTA DE USUARIOS
export async function getAdminUsersList() {
  const supabase = await createClient()
  
  // Verificación de Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autenticado" }

  // Verificación de Rol (Solo Global Admin)
  const { data: currentUser } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUser?.role !== 'global_admin') {
    return { success: false, message: "⛔ Acceso Denegado." }
  }

  // Llamada a la DB (RPC)
  const { data, error } = await supabase.rpc('get_users_with_stats')

  if (error) {
    console.error("Error fetching users:", error)
    return { success: false, message: "Error al cargar usuarios" }
  }

  // Casteo seguro porque la DB ya está limpia
  return { success: true, data: data as UserStat[] }
}

// 3. ACTUALIZAR ROL (Con verificación de escritura real)
export async function updateUserRole(
  targetUserId: string, 
  newRole: UserRole // Tipo estricto
) {
  const supabase = await createClient()

  // A. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: "No autenticado" }

  // B. Permission Check (Quien ejecuta)
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (me?.role !== 'global_admin') {
    return { success: false, message: "⛔ No tienes permiso." }
  }

  // C. Lógica de Negocio (No auto-degradarse)
  if (targetUserId === user.id && newRole !== 'global_admin') {
      return { success: false, message: "⚠️ No puedes degradarte a ti mismo." }
  }

  // D. ACTUALIZACIÓN + VERIFICACIÓN
  // Usamos .select() para confirmar que la fila realmente cambió (bypass de fallos silenciosos de RLS)
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)
    .select()

  if (error) {
    console.error("Error updating role:", error)
    return { success: false, message: `Error DB: ${error.message}` }
  }

  // Si data está vacío, es porque RLS bloqueó la escritura silenciosamente
  if (!data || data.length === 0) {
    return { success: false, message: "⛔ Error: No se pudo actualizar. Verifica permisos RLS." }
  }

  revalidatePath('/admin/users')
  return { success: true, message: "✅ Rol actualizado correctamente." }
}