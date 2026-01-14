// ARCHIVO: src/actions/auth-actions.ts
'use server'

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export interface ActionState {
  error?: string;
  success?: string;
}

export async function resetPasswordAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  
  const email = formData.get("email") as string;
  
  // Validación estricta de entrada
  if (!email || typeof email !== 'string') {
    return { error: "Por favor, ingresa un correo electrónico válido." };
  }

  const supabase = await createClient();
  
  // ---------------------------------------------------------
  // 🛡️ LÓGICA DE RESOLUCIÓN DE URL (Arquitectura Robusta)
  // ---------------------------------------------------------
  // 1. Buscamos la variable de entorno oficial (Producción/Staging)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // 2. Buscamos el header dinámico (útil para Deploy Previews)
  const headersList = await headers();
  const originHeader = headersList.get("origin");

  // 3. Determinamos el origen final con jerarquía de seguridad
  const origin = siteUrl || originHeader || 'https://localhost:3000';

  // 4. Construcción sanitizada de la URL (evita errores de doble slash)
  // Removemos slash final si existe para consistencia
  const cleanOrigin = origin.replace(/\/$/, '');
  
  // URL de destino final: El usuario volverá aquí para poner su nueva clave
  const callbackUrl = `${cleanOrigin}/auth/callback?next=/update-password`;

  console.log("🔐 [Auth] Iniciando recuperación para:", email);
  console.log("🔗 [Auth] Callback configurado:", callbackUrl);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  });

  if (error) {
    console.error("❌ [Auth] Error Supabase:", error.message);
    return { error: "No se pudo enviar el correo. Por favor intenta nuevamente o contacta soporte." };
  }

  return { success: "¡Enlace enviado! Revisa tu bandeja de entrada." };
}