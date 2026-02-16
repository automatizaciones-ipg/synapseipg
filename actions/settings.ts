'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
// Importamos los tipos centralizados
import { UpdateProfileSchema, ActionResponse } from "@/types/settings"

// Definimos la forma exacta que Supabase espera para el UPDATE
interface ProfileUpdatePayload {
  full_name?: string
  bio?: string
  avatar_url?: string
  updated_at: string
  theme?: string
  email_notifications?: boolean
  ai_autotag?: boolean
}

// -----------------------------------------------------------------------------
// 1. ACTUALIZAR PERFIL Y PREFERENCIAS
// -----------------------------------------------------------------------------
export async function updateProfileSettings(data: UpdateProfileSchema): Promise<ActionResponse> {
  const supabase = await createClient()

  // 1. Verificar Autenticación
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, message: "No autorizado" }
  }

  try {
    // 2. Preparar objeto de actualización (Payload Dinámico)
    const updates: ProfileUpdatePayload = {
      updated_at: new Date().toISOString(),
    }

    // 3. Lógica de Mapeo Condicional
    // --- Datos de Perfil ---
    if (data.fullName !== undefined) updates.full_name = data.fullName
    if (data.bio !== undefined) updates.bio = data.bio
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl

    // --- Preferencias ---
    if (data.theme !== undefined) updates.theme = data.theme
    if (data.emailNotifs !== undefined) updates.email_notifications = data.emailNotifs
    if (data.aiAutoTag !== undefined) updates.ai_autotag = data.aiAutoTag

    // 4. Actualizar en Base de Datos
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      console.error("Error updating profile settings:", error.message)
      return { success: false, message: "Error al guardar los datos" }
    }

    // 5. Revalidación
    revalidatePath('/dashboard/settings') 
    revalidatePath('/', 'layout') 
    
    return { success: true, message: "Configuración guardada correctamente" }

  } catch (error) {
    console.error("Internal Server Error:", error)
    return { success: false, message: "Error interno del servidor" }
  }
}

// -----------------------------------------------------------------------------
// 2. CAMBIAR CONTRASEÑA (NUEVO - BLINDADO)
// -----------------------------------------------------------------------------
export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<ActionResponse> {
  const supabase = await createClient()

  try {
    // A. Validar sesión
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return { success: false, message: "Sesión expirada o inválida." }
    }

    // B. VERIFICACIÓN DE SEGURIDAD (Confirmar contraseña actual)
    // Intentamos loguear con la clave vieja. Si falla, detenemos el proceso.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    })

    if (verifyError) {
      return { success: false, message: "La contraseña actual es incorrecta." }
    }

    // C. ACTUALIZACIÓN (Cambio de clave)
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      return { success: false, message: "Error al actualizar contraseña: " + updateError.message }
    }

    // D. RE-AUTENTICACIÓN SILENCIOSA (Vital para UX)
    // Al cambiar la password, Supabase invalida tokens antiguos. 
    // Iniciamos sesión inmediatamente con la nueva clave para renovar cookies y que el usuario no salga.
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: newPassword
    })

    if (reAuthError) {
      console.error("Warning: Re-auth failed after password change", reAuthError)
      // No retornamos error al usuario porque el cambio SÍ se hizo, solo la sesión podría caerse.
    }

    revalidatePath('/', 'layout')
    return { success: true, message: "Contraseña actualizada correctamente." }

  } catch (error) {
    console.error("Critical Error changeUserPassword:", error)
    return { success: false, message: "Error interno del servidor." }
  }
}