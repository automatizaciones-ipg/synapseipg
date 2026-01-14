// ARCHIVO: actions/email-actions.ts
'use server'

import { sendEmail } from "@/lib/email" // Asegura que apunta a lib/email.ts
import { WelcomeEmail } from "@/app/emails/welcome" // Ruta absoluta segura
import { ResetPasswordEmail } from "@/app/emails/reset-password" // Ruta absoluta segura

/**
 * Envia el correo de bienvenida de forma asíncrona.
 * No bloqueamos el flujo principal si falla (fire and forget), pero logueamos el error.
 */
export async function sendWelcomeEmailAction(email: string, name: string) {
  try {
    const { success, error } = await sendEmail({
      to: email,
      subject: "Bienvenido a Synapse IPG - Tu cuenta está lista",
      react: WelcomeEmail({ userFirstname: name })
    })

    if (!success) {
      console.error("⚠️ Falló envío de Welcome Email:", error)
    }
  } catch (err) {
    console.error("❌ Error crítico en sendWelcomeEmailAction:", err)
  }
}

/**
 * Envia el correo de recuperación.
 * Este SÍ es crítico. Si falla, debemos avisar para que el usuario reintente.
 */
export async function sendPasswordResetEmailAction(email: string, resetLink: string) {
  const { success, error } = await sendEmail({
    to: email,
    subject: "Restablecer tu contraseña - Synapse IPG",
    react: ResetPasswordEmail({ userEmail: email, resetLink })
  })

  return { success, error }
}