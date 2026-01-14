'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
// Importamos los tipos centralizados que acabamos de crear
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

export async function updateProfileSettings(data: UpdateProfileSchema): Promise<ActionResponse> {
  const supabase = await createClient()

  // 1. Verificar Autenticación
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, message: "No autorizado" }
  }

  try {
    // 2. Preparar objeto de actualización (Payload Dinámico)
    // Inicializamos solo con la fecha de actualización
    const updates: ProfileUpdatePayload = {
      updated_at: new Date().toISOString(),
    }

    // 3. Lógica de Mapeo Condicional
    // Solo agregamos al payload los campos que vienen definidos.
    // Esto evita sobrescribir datos existentes con 'undefined' o vacíos si no se enviaron.

    // --- Datos de Perfil ---
    if (data.fullName !== undefined) updates.full_name = data.fullName
    if (data.bio !== undefined) updates.bio = data.bio
    if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl

    // --- Preferencias (Nuevas) ---
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
    // Revalidamos settings para ver cambios inmediatos
    revalidatePath('/dashboard/settings') 
    // Revalidamos el layout raíz por si cambió el Tema (afecta a toda la app)
    revalidatePath('/', 'layout') 
    
    return { success: true, message: "Configuración guardada correctamente" }

  } catch (error) {
    console.error("Internal Server Error:", error)
    return { success: false, message: "Error interno del servidor" }
  }
}