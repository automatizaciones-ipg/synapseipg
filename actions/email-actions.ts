// ARCHIVO: actions/email-actions.ts
'use server'

import { Resend } from 'resend';
// 👇 TUS IMPORTS ORIGINALES (Respetados)
import { WelcomeEmail } from '@/components/welcome-template';
import { ResetPasswordEmail } from '@/app//emails/reset-password-template';

// Interfaces de retorno estricto
interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

// Helper privado para validar configuración
function validateConfig(): boolean {
  if (!process.env.RESEND_API_KEY) {
    console.error("🔴 CRITICAL: RESEND_API_KEY falta en .env.local");
    return false;
  }
  if (!fromEmail) {
    console.error("🔴 CRITICAL: RESEND_FROM_EMAIL falta en .env.local");
    return false;
  }
  return true;
}

/**
 * Helper para extraer mensajes de error de tipo unknown de forma segura
 * Esto elimina la necesidad de usar 'any' en los catch.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido al enviar correo';
}

/**
 * ACCIÓN 1: Enviar Bienvenida
 */
export async function sendWelcomeEmailAction(email: string, fullName: string): Promise<EmailResult> {
  if (!validateConfig()) return { success: false, error: "Server config error" };

  try {
    const firstName = fullName.split(' ')[0];

    // Resend devuelve data O error, pero TS necesita ayuda para desestructurar con seguridad
    const response = await resend.emails.send({
      from: fromEmail!, // el ! afirma que ya validamos que existe en validateConfig
      to: [email],
      subject: 'Bienvenido a Synapse IPG - Tu cuenta está lista 🚀',
      react: WelcomeEmail({ userFirstname: firstName }) as React.ReactElement,
    });

    if (response.error) {
      console.error("⚠️ Resend Error (Welcome):", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true, id: response.data?.id };

  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("❌ Error crítico en sendWelcomeEmailAction:", message);
    return { success: false, error: message };
  }
}

/**
 * ACCIÓN 2: Enviar Recuperación de Contraseña
 */
export async function sendPasswordResetEmailAction(email: string, resetLink: string): Promise<EmailResult> {
  if (!validateConfig()) return { success: false, error: "Server config error" };

  try {
    const response = await resend.emails.send({
      from: fromEmail!,
      to: [email],
      subject: 'Restablecer tu contraseña - Synapse IPG',
      react: ResetPasswordEmail({ userEmail: email, resetLink }) as React.ReactElement,
    });

    if (response.error) {
      console.error("⚠️ Resend Error (Reset):", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true, id: response.data?.id };

  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("❌ Error crítico en sendPasswordResetEmailAction:", message);
    return { success: false, error: message };
  }
}