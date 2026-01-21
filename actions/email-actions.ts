'use server'

import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/welcome-template';
// 👇 CAMBIO 1: Ruta corregida y apuntando a components (Recomendado mover la carpeta ahí)
import { ResetPasswordEmail } from '@/app/emails/reset-password-template';

// Interfaces de retorno estricto
interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

// Helper privado para validar configuración (MEJORADO CON LOGS)
function validateConfig(): boolean {
  // Diagnóstico de entorno
  const hasKey = !!process.env.RESEND_API_KEY;
  const hasEmail = !!fromEmail;

  if (!hasKey || !hasEmail) {
    console.error(`🔴 [CRITICAL CONFIG] Faltan variables. KEY: ${hasKey}, EMAIL: ${hasEmail}`);
    return false;
  }
  return true;
}

/**
 * Helper para extraer mensajes de error de tipo unknown de forma segura
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return JSON.stringify(error);
}

/**
 * ACCIÓN 1: Enviar Bienvenida (INTACTA, solo logs mínimos)
 */
export async function sendWelcomeEmailAction(email: string, fullName: string): Promise<EmailResult> {
  if (!validateConfig()) return { success: false, error: "Server config error" };

  try {
    const firstName = fullName.split(' ')[0];

    const response = await resend.emails.send({
      from: fromEmail!,
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
 * 👇 MODIFICADA CON DIAGNÓSTICO FORENSE 👇
 */
export async function sendPasswordResetEmailAction(email: string, resetLink: string): Promise<EmailResult> {
  // 1. LOG INICIAL
  console.log(`[🚀 DEBUG START] Iniciando reset password para: ${email}`);

  if (!validateConfig()) return { success: false, error: "Server config error" };

  try {
    // 2. PRUEBA DE RENDERIZADO (Detecta si el componente React falla antes de enviar)
    console.log("[⚙️ RENDER] Intentando generar HTML del correo...");
    let reactComponent;
    try {
      reactComponent = ResetPasswordEmail({ userEmail: email, resetLink });
      console.log("[✅ RENDER] Componente generado correctamente.");
    } catch (renderError) {
      console.error("[❌ RENDER FAIL] Error al crear el componente React:", renderError);
      throw new Error(`Fallo en template: ${getErrorMessage(renderError)}`);
    }

    // 3. ENVÍO A RESEND
    console.log("[📤 SENDING] Conectando con Resend...");

    const response = await resend.emails.send({
      from: fromEmail!,
      to: [email],
      subject: 'Restablecer tu contraseña - Synapse IPG',
      react: reactComponent as React.ReactElement,
      // ⚠️ RESPALDO: Texto plano por si el HTML es bloqueado o falla
      text: `Recupera tu contraseña aquí: ${resetLink}`,
    });

    // 4. VERIFICACIÓN DE RESPUESTA API
    if (response.error) {
      console.error("⚠️ [API ERROR] Resend rechazó el correo:", JSON.stringify(response.error, null, 2));
      return { success: false, error: `Resend: ${response.error.message}` };
    }

    console.log(`[✅ SUCCESS] Correo enviado. ID: ${response.data?.id}`);
    return { success: true, id: response.data?.id };

  } catch (error: unknown) {
    // 5. CAPTURA DE ERROR FATAL
    const message = getErrorMessage(error);
    console.error("------------------------------------------------");
    console.error("❌ [CRITICAL EXCEPTION] en sendPasswordResetEmailAction:");
    console.error("Msg:", message);
    if (error instanceof Error && error.stack) console.error("Stack:", error.stack);
    console.error("------------------------------------------------");

    return { success: false, error: message };
  }
}