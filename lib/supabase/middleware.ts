import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Crear respuesta base
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Configurar cliente Supabase para gestión de Cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Obtener usuario (esto refresca el token si es necesario)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // --- 🟢 ZONA QUIRÚRGICA: EXCEPCIONES CRÍTICAS ---
  // Si el usuario va al Callback de Auth o a Cambiar Password, DEJAR PASAR.
  // Esto evita que la lógica de abajo secuestre la redirección.
  if (path.startsWith('/auth') || path.startsWith('/update-password')) {
    return supabaseResponse
  }
  // ------------------------------------------------

  // 4. LÓGICA DE PROTECCIÓN (Bloqueo)
  // Si NO hay usuario y NO está en login, mandar a login
  if (!user && !path.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 5. LÓGICA DE REDIRECCIÓN (Usuario Logueado)
  // Si HAY usuario y está intentando entrar al login, mandar al dashboard
  if (user && path.startsWith('/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}