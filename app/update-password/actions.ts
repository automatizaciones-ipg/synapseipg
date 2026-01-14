'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return { error: 'Por favor completa todos los campos' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  // Éxito: Redirigir al dashboard con un parámetro para mostrar toast de éxito si quieres,
  // o simplemente redirigir.
  redirect('/')
}