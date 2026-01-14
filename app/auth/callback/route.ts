import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // 1. Extracción segura de parámetros
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // 'next' es crítico: define a dónde va el usuario post-login.
  // Si no viene, default a '/' (Dashboard)
  const next = requestUrl.searchParams.get('next') ?? '/'
  
  // Capturamos el origen de la petición actual
  const origin = requestUrl.origin

  if (code) {
    // 2. Intercambio de Código por Sesión (PKCE Flow)
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 3. LÓGICA DE REDIRECCIÓN INTELIGENTE
      
      // Detectamos si estamos detrás de un proxy (Vercel, AWS, etc)
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Construimos la URL final asegurando consistencia
      let finalRedirectUrl: string;

      if (isLocalEnv) {
        // Desarrollo: Usamos el origen directo del navegador (HTTPS si así corre el server)
        finalRedirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        // Producción: Forzamos HTTPS y usamos el dominio real
        finalRedirectUrl = `https://${forwardedHost}${next}`
      } else {
        // Fallback: Usamos el origen detectado
        finalRedirectUrl = `${origin}${next}`
      }

      // 4. ÉXITO: Redirección final al formulario de cambio de clave
      return NextResponse.redirect(finalRedirectUrl)
    } else {
        // 🛑 DIAGNÓSTICO: Si falla el intercambio, lo vemos en consola server-side
        console.error("❌ Auth Callback Error:", error.message)
        
        // Redirigimos con el error explícito para que sepas qué pasó
        return NextResponse.redirect(`${origin}/login?error=auth_exchange_error&details=${encodeURIComponent(error.message)}`)
    }
  }

  // 5. Manejo de Errores (Sin código)
  return NextResponse.redirect(`${origin}/login?error=no_code_provided`)
}