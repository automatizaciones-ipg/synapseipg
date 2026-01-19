// ARCHIVO: app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { z } from 'zod'
import { sendWelcomeEmailAction, sendPasswordResetEmailAction } from '@/actions/email-actions'

// Interface estricta para respuestas de Server Actions
interface AuthResponse {
  error?: string
  success?: string
}

// --- SCHEMAS DE VALIDACIÓN ---
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

// --- LÓGICA 1: LOGIN ---
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

// --- LÓGICA 2: SIGNUP (REGISTRO) ---
export async function signup(formData: FormData): Promise<AuthResponse | void> {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)
  const validated = signupSchema.safeParse(data)

  if (!validated.success) return { error: validated.error.issues[0].message }

  const email = data.email as string
  const fullName = data.full_name as string

  // 1. Crear usuario en Supabase
  const { error, data: authData } = await supabase.auth.signUp({
    email: email,
    password: data.password as string,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) return { error: error.message }

  // 2. Si se creó el usuario, enviar correo de Bienvenida
  if (authData.user) {
      // Llamada asíncrona segura. Capturamos el resultado pero no bloqueamos si falla el mail.
      const emailResult = await sendWelcomeEmailAction(email, fullName)
      
      if (!emailResult.success) {
          // Solo logueamos en servidor, no interrumpimos el flujo del usuario
          console.error(`⚠️ Usuario creado, pero fallo envío de mail: ${emailResult.error}`);
      }
  }

  if (authData.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  return { success: "Cuenta creada exitosamente. Revisa tu correo." }
}

// --- LÓGICA 3: RESET PASSWORD (RECUPERACIÓN) ---
export async function resetPassword(formData: FormData): Promise<AuthResponse> {
  const emailRaw = formData.get('email');
  
  // Type Guard simple: asegurar que email es string
  if (!emailRaw || typeof emailRaw !== 'string' || !emailRaw.includes('@')) {
      return { error: "Email inválido" }
  }

  const email = emailRaw; // Ahora TS sabe que es string seguro

  // Validar variables de entorno críticas para Admin Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
      console.error("🔴 Error Config: Faltan variables de Supabase Admin");
      return { error: "Error de configuración del servidor." };
  }

  // 1. Instanciar Supabase ADMIN
  const supabaseAdmin = createSupabaseAdmin(
    supabaseUrl,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectTo = `${origin}/auth/callback?next=/update-password`

  // 2. Generar el link
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: { redirectTo }
  })

  if (error) {
    console.error("Error generating recovery link:", error.message)
    return { error: "No se pudo procesar la solicitud. Verifica el correo." }
  }

  // 3. Enviar el link por Resend
  if (data?.properties?.action_link) {
      const resetLink = data.properties.action_link
      
      const emailResult = await sendPasswordResetEmailAction(email, resetLink)
      
      if (!emailResult.success) {
          return { error: "Error técnico enviando el correo. Intenta nuevamente." }
      }
  } else {
      return { error: "No se pudo generar el enlace de recuperación." }
  }

  return { success: "Enlace de recuperación enviado a tu correo." }
}