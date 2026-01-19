'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) return { error: 'Completa todos los campos' }
  if (password !== confirmPassword) return { error: 'Las contraseñas no coinciden' }
  if (password.length < 6) return { error: 'La contraseña debe tener mínimo 6 caracteres' }

  const supabase = await createClient()

  // Supabase sabe qué usuario es porque el link del correo ya creó la sesión
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/') // Redirige al home ya logueado
}