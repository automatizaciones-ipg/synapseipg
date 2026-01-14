// actions/settings.ts
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// 1. Definición estricta de los datos de entrada
interface UpdateProfileSchema {
  fullName: string
  bio: string
  avatarUrl?: string
  themePreference?: 'light' | 'dark' | 'system'
}

// 2. Definición estricta de la respuesta
interface ActionResponse {
  success: boolean
  message: string
}

// 3. Definición del objeto que Supabase espera (Partial Update)
// Nota: 'bio' y 'updated_at' deben existir en tu tabla profiles (vía SQL)
interface ProfileUpdatePayload {
  full_name: string
  bio: string
  updated_at: string
  avatar_url?: string
}

export async function updateProfileSettings(data: UpdateProfileSchema): Promise<ActionResponse> {
  const supabase = await createClient()

  // Verificar Autenticación
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, message: "No autorizado" }
  }

  // Preparar objeto de actualización tipado
  const updates: ProfileUpdatePayload = {
    full_name: data.fullName,
    bio: data.bio,
    updated_at: new Date().toISOString(),
  }

  // Solo agregamos avatar_url si viene definido (para no sobrescribir con null accidentalmente)
  if (data.avatarUrl) {
    updates.avatar_url = data.avatarUrl
  }

  // Actualizar en Base de Datos
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, message: "Error al guardar los datos" }
  }

  revalidatePath('/dashboard/settings') 
  
  return { success: true, message: "Perfil actualizado correctamente" }
}