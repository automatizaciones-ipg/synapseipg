'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Camera, Moon, Sun, User, ShieldCheck, Mail, Save } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card" // Asegúrate de tener este componente de la lección anterior
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch" // Asegúrate de tener shadcn Switch o usa un input checkbox simple

export default function LessonTwoPage() {
    // Estado local SOLO para la demostración visual del mockup
    const [isDarkMockup, setIsDarkMockup] = useState(false)

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- HEADER --- */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/intro" className="hover:text-blue-600 transition-colors">
                        Módulo 1
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">Módulo 2</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                    Tu Identidad Digital
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Synapse no es solo una herramienta, es tu entorno de trabajo. Aprende a personalizar tu perfil, gestionar tu seguridad y adaptar la interfaz a tu gusto visual.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: PERFIL Y AVATAR */}
                <TutorialCard
                    step="01"
                    title="Imagen Profesional"
                    description="Tu avatar es visible para todos en los Grupos y Recursos compartidos. Mantén tu información actualizada para que tu equipo pueda identificarte fácilmente."
                >
                    {/* MOCKUP: EDIT PROFILE */}
                    <div className="p-6 bg-slate-50 h-full min-h-[250px] flex items-center justify-center">
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                            <div className="relative flex flex-col items-center -mt-10 mb-4">
                                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-slate-200 shadow-md flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-105 transition-transform">
                                    <User className="h-10 w-10 text-slate-400" />
                                    {/* Overlay al hacer hover simulado */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h4 className="mt-2 font-bold text-slate-900">Dr. Juan Pérez</h4>
                                <span className="text-xs text-slate-500">Cardiología Intervencionista</span>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Correo Institucional</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200 text-sm text-slate-600">
                                        <Mail className="h-3.5 w-3.5" />
                                        jperez@ipg.cl
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <div className="px-4 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full shadow-lg shadow-slate-900/20 flex items-center gap-1 cursor-not-allowed opacity-80">
                                        <Save className="h-3 w-3" /> Guardar
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: INTERACTIVIDAD REAL (Dark Mode Simulator) */}
                <TutorialCard
                    step="02"
                    title="Confort Visual (Temas)"
                    description="¿Trabajas de noche o prefieres menos brillo? Puedes alternar entre el modo Claro y Oscuro. Prueba el interruptor en este simulador interactivo:"
                >
                    {/* MOCKUP INTERACTIVO */}
                    <div className={cn(
                        "relative p-6 h-full min-h-[250px] flex items-center justify-center transition-colors duration-500",
                        isDarkMockup ? "bg-slate-950" : "bg-slate-100"
                    )}>
                        <div className={cn(
                            "w-full max-w-[280px] rounded-2xl shadow-2xl p-5 border transition-all duration-500",
                            isDarkMockup ? "bg-[#0B1120] border-slate-800" : "bg-white border-white"
                        )}>
                            <div className="flex items-center justify-between mb-6">
                                <span className={cn("text-sm font-bold", isDarkMockup ? "text-white" : "text-slate-900")}>
                                    Preferencias
                                </span>
                                {/* Botón funcional dentro del mockup */}
                                <button
                                    onClick={() => setIsDarkMockup(!isDarkMockup)}
                                    className={cn(
                                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                                        isDarkMockup ? "bg-blue-600" : "bg-slate-200"
                                    )}
                                >
                                    <span className={cn(
                                        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out flex items-center justify-center",
                                        isDarkMockup ? "translate-x-5" : "translate-x-0"
                                    )}>
                                        {isDarkMockup ? <Moon className="h-3 w-3 text-blue-600" /> : <Sun className="h-3 w-3 text-amber-500" />}
                                    </span>
                                </button>
                            </div>

                            {/* Contenido Simulado que reacciona al tema */}
                            <div className="space-y-3">
                                <div className={cn("h-2 w-1/3 rounded", isDarkMockup ? "bg-slate-700" : "bg-slate-200")}></div>
                                <div className={cn("h-20 w-full rounded-lg border border-dashed flex items-center justify-center", isDarkMockup ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50")}>
                                    <div className={cn("text-xs", isDarkMockup ? "text-slate-500" : "text-slate-400")}>Vista Previa de Contenido</div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className={cn("h-8 rounded", isDarkMockup ? "bg-slate-800" : "bg-slate-100")}></div>
                                    <div className={cn("h-8 rounded", isDarkMockup ? "bg-slate-800" : "bg-slate-100")}></div>
                                    <div className={cn("h-8 rounded", isDarkMockup ? "bg-slate-800" : "bg-slate-100")}></div>
                                </div>
                            </div>
                        </div>

                        <p className={cn(
                            "absolute bottom-3 text-[10px] font-medium transition-colors",
                            isDarkMockup ? "text-slate-500" : "text-slate-400"
                        )}>
                            Haz clic en el switch para probar
                        </p>
                    </div>
                </TutorialCard>

                {/* PASO 3: SEGURIDAD */}
                <TutorialCard
                    step="03"
                    title="Zona de Seguridad"
                    description="Cambia tu contraseña regularmente. Nuestro sistema evalúa la robustez de tu clave en tiempo real para garantizar la protección de los datos institucionales."
                >
                    <div className="p-6 bg-slate-50 h-full min-h-[250px] flex items-center justify-center">
                        <div className="w-full max-w-xs bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                <span className="font-bold text-slate-800 text-sm">Actualizar Clave</span>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="h-8 w-full bg-slate-50 border border-slate-200 rounded flex items-center px-2 text-sm text-slate-400">
                                        ••••••••••••
                                    </div>
                                    {/* Password Strength Meter Mockup */}
                                    <div className="flex gap-1 h-1 mt-1">
                                        <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                        <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                        <div className="flex-1 bg-emerald-500 rounded-full"></div>
                                        <div className="flex-1 bg-slate-200 rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-emerald-600 font-medium text-right">Contraseña Fuerte</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="w-full py-2 bg-emerald-50 border border-emerald-100 rounded text-center text-xs text-emerald-700 font-medium">
                                    Último cambio: hace 30 días
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

            </div>

            {/* --- FOOTER NAVEGACIÓN --- */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-slate-500 mb-1">Anterior</p>
                    <Button variant="outline" asChild className="group">
                        <Link href="/docs/tutorial/intro">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            1. Primeros Pasos
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Lección</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/navigation">
                            3. Navegación Maestra
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}