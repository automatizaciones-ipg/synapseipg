'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPage() {
    const [status, setStatus] = useState('Validando sesión segura...')
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const verifyUser = async () => {
            console.log("🔒 Iniciando verificación de sesión...")

            // PASO 1: Verificación de Cookie (PRIORIDAD ALTA)
            // Si vienes de /auth/callback (como muestra tu log), la sesión YA existe en la cookie.
            // No necesitamos leer la URL, solo preguntar a Supabase quién es el usuario actual.
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (session) {
                console.log("✅ Usuario autenticado por Cookie. Redirigiendo...")
                setStatus('Identidad confirmada. Redirigiendo...')
                router.replace('/update-password')
                return
            }

            // PASO 2: Verificación de Código PKCE (Respaldo)
            // Si por alguna razón el callback falló pero traemos un código en la URL (?code=...)
            const code = searchParams.get('code')
            if (code) {
                setStatus('Canjeando código de autorización...')
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (!exchangeError) {
                    console.log("✅ Código canjeado exitosamente.")
                    router.replace('/update-password')
                    return
                }
            }

            // PASO 3: Verificación de Hash (Legacy/Respaldo final)
            // Solo si falló la cookie y no hay código, miramos el hash (#access_token=...)
            const hash = window.location.hash
            if (hash && hash.includes('access_token')) {
                setStatus('Procesando token de acceso...')
                const params = new URLSearchParams(hash.substring(1))
                const accessToken = params.get('access_token')
                const refreshToken = params.get('refresh_token')

                if (accessToken) {
                    const { error: hashError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || '',
                    })

                    if (!hashError) {
                        router.replace('/update-password')
                        return
                    }
                }
            }

            // Si llegamos aquí, realmente no hay nada
            console.error("❌ No se encontró sesión, código ni hash.")
            setStatus('No se pudo verificar la sesión. Por favor solicita un nuevo enlace.')
        }

        verifyUser()
    }, [router, searchParams, supabase])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Verificando Cuenta</h2>

                <div className="flex justify-center mb-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>

                <p className="text-gray-600 font-medium">{status}</p>

                {(status.includes('No se pudo') || status.includes('Error')) && (
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/login')}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                        >
                            Volver al inicio
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}