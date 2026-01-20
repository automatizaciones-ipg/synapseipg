import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // 1. Extracción segura de parámetros de la URL
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // 'next' es crítico: define a dónde va el usuario post-login.
  // En tu caso, vendrá como '/update-password' desde el link del correo.
  const next = requestUrl.searchParams.get('next') ?? '/'

  // Capturamos el origen de la petición actual
  const origin = requestUrl.origin

  if (code) {
    // 2. Intercambio de Código por Sesión (PKCE Flow)
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 3. LÓGICA DE REDIRECCIÓN INTELIGENTE (Tu lógica es perfecta aquí)

      // Detectamos si estamos detrás de un proxy (Vercel usa x-forwarded-host)
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      // Construimos la URL final asegurando consistencia
      let finalRedirectUrl: string;

      if (isLocalEnv) {
        // Desarrollo: Usamos el origen directo del navegador
        finalRedirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        // Producción: Forzamos HTTPS y usamos el dominio real de Vercel
        finalRedirectUrl = `https://${forwardedHost}${next}`
      } else {
        // Fallback: Usamos el origen detectado por defecto
        finalRedirectUrl = `${origin}${next}`
      }

      // 4. ÉXITO: Redirección final a la página de cambio de clave (/update-password)
      // Al hacer esto, la cookie de sesión ya viaja con el usuario.
      return NextResponse.redirect(finalRedirectUrl)
    }

    // 🛑 Manejo de error específico del intercambio
    console.error("❌ Auth Callback Error:", error.message)
    return NextResponse.redirect(`${origin}/login?error=auth_exchange_error`)
  }

  // 5. Si no hay código, devolvemos al login
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`)
}