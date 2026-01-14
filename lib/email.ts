// ARCHIVO: src/lib/email.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';

// 1. Verificación de Seguridad
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ AVISO CRÍTICO: RESEND_API_KEY no encontrada en variables de entorno.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Usa 'onboarding@resend.dev' para pruebas si no hay variable configurada
export const DEFAULT_SENDER = process.env.EMAIL_FROM || 'Synapse IPG <onboarding@resend.dev>';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  try {
    // PASO CRÍTICO: Renderizamos el React a HTML String explícitamente.
    // Esto evita que Resend falle internamente al intentar renderizar componentes complejos en Server Actions.
    const emailHtml = await render(react);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to,
      subject,
      html: emailHtml, // <-- Enviamos HTML ya procesado, no el componente React
    });

    if (error) {
      console.error("❌ Error de Resend API:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    // Aquí capturamos errores de renderizado de React o de red
    console.error("❌ Error crítico enviando correo:", err);
    return { success: false, error: "Error al procesar o enviar el correo" };
  }
}