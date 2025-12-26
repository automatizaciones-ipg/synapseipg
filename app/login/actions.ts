'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

interface AuthResponse {
  error?: string
  success?: string
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Ingresa tu contraseña"),
})

const signupSchema = z.object({
  email: z.string().email().refine((val) => val.endsWith('@ipg.cl'), {
    message: "Acceso restringido a correos @ipg.cl",
  }),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6),
  full_name: z.string().min(2, "Nombre requerido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export async function login(formData: FormData): Promise<AuthResponse | void> {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)

  const validated = loginSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.issues[0].message }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) return { error: 'Credenciales inválidas.' }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData): Promise<AuthResponse | void> {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)

  const validated = signupSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.issues[0].message }

  // 1. Registramos al usuario
  const { error, data: authData } = await supabase.auth.signUp({
    email: data.email as string,
    password: data.password as string,
    options: {
      data: { full_name: data.full_name }
    }
  })

  if (error) return { error: error.message }

  // 2. AUTO-LOGIN: Si Supabase nos devuelve una sesión (porque confirmación está off)
  // Redirigimos inmediatamente igual que en el login.
  if (authData.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  // Solo si la confirmación de email estuviera activada, retornamos esto:
  return { success: "Cuenta creada. Revisa tu correo." }
}

export async function resetPassword(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  
  // URL absoluta para que funcione en Vercel y Localhost
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/profile`, 
  })

  if (error) return { error: error.message }

  return { success: "Enlace de recuperación enviado a tu correo." }
}