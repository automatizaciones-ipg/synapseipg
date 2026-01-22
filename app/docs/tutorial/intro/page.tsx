'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight, Lock, Play, CheckCircle2, RefreshCw, Mail, LayoutDashboard, Search } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"

export default function LessonOnePage() {
    // --- ESTADOS PARA INTERACTIVIDAD ---

    // 1. Login Simulator
    const [loginState, setLoginState] = useState<'idle' | 'typing' | 'loading' | 'success'>('idle')

    // 2. Recovery Simulator
    const [recoveryStep, setRecoveryStep] = useState<'form' | 'sent'>('form')

    // 3. Dashboard Simulator
    const [dashboardActive, setDashboardActive] = useState(false)

    // Efecto para el simulador de Login
    const handleSimulateLogin = () => {
        setLoginState('typing')
        setTimeout(() => setLoginState('loading'), 800)
        setTimeout(() => setLoginState('success'), 2000)
    }

    // Efecto para el Dashboard (Live Data)
    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardActive(prev => !prev)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER DE LA LECCIÓN */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="font-medium text-blue-600">Academia Synapse</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>Módulo 1</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                    Primeros Pasos en el Ecosistema
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Bienvenido a la nueva era operativa de IPG. Experimenta en tiempo real cómo ingresar, recuperar tu cuenta y leer tu tablero principal.
                </p>

                {/* Video Placeholder */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-transform group-hover:scale-110">
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                    <p className="absolute bottom-6 left-6 text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur text-sm">
                        Video Introductorio (1:20)
                    </p>
                </div>
            </div>

            <div className="space-y-8">

                {/* PASO 1: EL LOGIN INTERACTIVO */}
                <TutorialCard
                    step="01"
                    title="Tu Credencial Digital"
                    description="El acceso a Synapse es seguro y rápido. Prueba el simulador para ver el proceso de autenticación."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[240px] flex flex-col items-center justify-center gap-4 relative">
                        {loginState !== 'success' ? (
                            <div className="w-full max-w-[240px] bg-white rounded-lg shadow-lg p-4 space-y-3 border border-slate-200 transition-all">
                                <div className="h-6 w-6 bg-blue-600 rounded mb-2 animate-pulse"></div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Usuario</label>
                                    <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded flex items-center px-2 text-xs text-slate-700">
                                        {loginState === 'idle' ? '' : 'usuario@ipg.cl'}
                                        {loginState === 'typing' && <span className="animate-pulse">|</span>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Contraseña</label>
                                    <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded flex items-center justify-between px-2">
                                        <div className="flex gap-1">
                                            {(loginState === 'loading' || loginState === 'typing') && (
                                                <>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800"></div>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800"></div>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-800"></div>
                                                </>
                                            )}
                                        </div>
                                        <Lock className="h-3 w-3 text-slate-300" />
                                    </div>
                                </div>
                                <button
                                    disabled={loginState !== 'idle'}
                                    onClick={handleSimulateLogin}
                                    className="h-8 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded shadow-md mt-2 flex items-center justify-center transition-colors disabled:opacity-80"
                                >
                                    {loginState === 'loading' ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Ingresar'}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-[240px] bg-emerald-50 rounded-lg shadow-lg border border-emerald-100 p-6 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <p className="text-emerald-800 font-bold text-sm">¡Acceso Correcto!</p>
                                <button onClick={() => setLoginState('idle')} className="mt-4 text-[10px] text-slate-400 underline hover:text-slate-600">
                                    Reiniciar Demo
                                </button>
                            </div>
                        )}

                        {loginState === 'idle' && (
                            <p className="text-[10px] text-slate-400 absolute bottom-2">Haz clic en Ingresar para probar</p>
                        )}
                    </div>
                </TutorialCard>

                {/* PASO 2: RECUPERACIÓN INTERACTIVA */}
                <TutorialCard
                    step="02"
                    title="Autogestión de Seguridad"
                    description="¿Olvidaste tu contraseña? Simula el flujo de recuperación sin salir de esta pantalla."
                >
                    <div className="p-6 bg-blue-50/50 h-full min-h-[240px] flex items-center justify-center">
                        <div className="w-full max-w-[260px] bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden relative">
                            {/* Barra de título estilo navegador */}
                            <div className="bg-slate-50 p-2 border-b border-slate-100 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                            </div>

                            <div className="p-6">
                                {recoveryStep === 'form' ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="text-center space-y-1">
                                            <h4 className="font-bold text-slate-900 text-sm">Recuperar Cuenta</h4>
                                            <p className="text-[10px] text-slate-500">Ingresa tu correo institucional</p>
                                        </div>
                                        <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded flex items-center px-2 text-xs text-slate-600">
                                            usuario@ipg.cl
                                        </div>
                                        <button
                                            onClick={() => setRecoveryStep('sent')}
                                            className="w-full h-8 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors"
                                        >
                                            Enviar Enlace <ArrowRight className="h-3 w-3" />
                                        </button>
                                        <div className="text-center">
                                            <span className="text-[10px] text-blue-600 cursor-pointer hover:underline">¿Volver al inicio?</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">¡Correo Enviado!</h4>
                                            <p className="text-[10px] text-slate-500 mt-1">Revisa tu bandeja de entrada en los próximos 5 minutos.</p>
                                        </div>
                                        <button
                                            onClick={() => setRecoveryStep('form')}
                                            className="text-[10px] text-slate-400 underline hover:text-slate-600 mt-2"
                                        >
                                            Intentar de nuevo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: DASHBOARD VIVO */}
                <TutorialCard
                    step="03"
                    title="Tu Centro de Mando"
                    description="Un Dashboard que respira. Las métricas se actualizan en tiempo real y tienes acceso directo a tus módulos."
                >
                    <div className="p-4 bg-slate-100 h-full min-h-[240px] flex items-center justify-center">
                        <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 flex overflow-hidden">
                            {/* Sidebar Mock */}
                            <div className="w-12 bg-slate-50 border-r border-slate-200 flex flex-col items-center py-3 gap-3">
                                <div className="h-5 w-5 bg-blue-600 rounded shadow-sm"></div>
                                <div className="flex flex-col gap-2 mt-2 w-full px-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={cn(
                                            "h-1 rounded transition-all duration-500",
                                            i === 1 ? "bg-blue-400 w-3/4" : "bg-slate-200 w-full"
                                        )}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Area Mock */}
                            <div className="flex-1 p-3 space-y-3 bg-slate-50/30">
                                <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100 shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-slate-100"></div>
                                        <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                    </div>
                                    <div className="h-4 w-4 rounded-full bg-slate-200"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-20 bg-white rounded border border-blue-100 p-2 flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition-colors">
                                        <div className="h-2 w-12 bg-blue-100 rounded"></div>
                                        <div className="flex items-end justify-between">
                                            <span className="text-xl font-bold text-slate-700">
                                                {dashboardActive ? '24' : '18'}
                                            </span>
                                            {/* Mini Bar Chart Animation */}
                                            <div className="flex gap-0.5 items-end h-8">
                                                <div className={cn("w-1 bg-blue-400 rounded-t transition-all duration-1000", dashboardActive ? "h-6" : "h-3")}></div>
                                                <div className={cn("w-1 bg-blue-300 rounded-t transition-all duration-1000 delay-75", dashboardActive ? "h-8" : "h-4")}></div>
                                                <div className={cn("w-1 bg-blue-500 rounded-t transition-all duration-1000 delay-100", dashboardActive ? "h-5" : "h-2")}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-20 bg-white rounded border border-emerald-100 p-2 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                                        <div className="h-2 w-16 bg-emerald-100 rounded"></div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full bg-emerald-500 transition-opacity duration-500", dashboardActive ? "opacity-100" : "opacity-30")}></div>
                                            <span className="text-xs text-emerald-600 font-medium">Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

            </div>

            {/* FOOTER NAVEGACIÓN */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="text-center sm:text-left opacity-50 cursor-not-allowed">
                    <p className="text-sm text-slate-500 mb-1">Anterior</p>
                    <Button variant="ghost" disabled className="text-slate-400">
                        Inicio del Curso
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Lección</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/profile">
                            2. Tu Espacio Personal
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}