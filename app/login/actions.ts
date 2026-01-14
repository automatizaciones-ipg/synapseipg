// ARCHIVO: app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { z } from 'zod'
import { sendWelcomeEmailAction, sendPasswordResetEmailAction } from '@/actions/email-actions'

interface AuthResponse {
  error?: string
  success?: string
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Ingresa tu contraseña"),
})

const signupSchema = z.object({
  email: z.string().email().refine((val) => val.endsWith('@ipg.cl') || val.endsWith('@resend.dev'), {
    message: "Acceso restringido a correos @ipg.cl",
  }),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6),
  full_name: z.string().min(2, "Nombre requerido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

// --- LOGIN ---
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

// --- SIGNUP ---
export async function signup(formData: FormData): Promise<AuthResponse | void> {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)
  const validated = signupSchema.safeParse(data)

  if (!validated.success) return { error: validated.error.issues[0].message }

  const email = data.email as string
  const fullName = data.full_name as string

  const { error, data: authData } = await supabase.auth.signUp({
    email: email,
    password: data.password as string,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) return { error: error.message }

  if (authData.user) {
      await sendWelcomeEmailAction(email, fullName)
  }

  if (authData.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  return { success: "Cuenta creada. Revisa tu correo." }
}

// --- RESET PASSWORD (CORE) ---
export async function resetPassword(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  if (!email || !email.includes('@')) return { error: "Email inválido" }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
  
  // ⚠️ CAMBIO IMPORTANTE: Redirigir a una página para poner la NUEVA clave
  const redirectTo = `${origin}/auth/callback?next=/update-password`

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: { redirectTo }
  })

  if (error) {
    console.error("Error generating recovery link:", error)
    return { error: "No se pudo procesar la solicitud." }
  }

  if (data && data.properties?.action_link) {
      const resetLink = data.properties.action_link
      const emailResult = await sendPasswordResetEmailAction(email, resetLink)
      
      if (!emailResult.success) {
          return { error: "Error al enviar el correo. Intenta nuevamente." }
      }
  }

  return { success: "Enlace de recuperación enviado a tu correo." }
}