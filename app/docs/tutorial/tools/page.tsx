'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Wrench, Zap, Calendar, MessageSquare, Calculator, Pin, CheckCircle2, Plus, Loader2, LayoutTemplate } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch" // Asumiendo que tienes shadcn switch, si no, usa un input checkbox simple

export default function LessonSixPage() {

    // --- ESTADOS INTERACTIVOS ---

    // 1. App Store Simulator
    const [apps, setApps] = useState([
        { id: 1, name: "Calendario", icon: Calendar, active: true, color: "text-red-500 bg-red-50" },
        { id: 2, name: "Slack", icon: MessageSquare, active: false, color: "text-purple-500 bg-purple-50" },
        { id: 3, name: "Calculadora", icon: Calculator, active: false, color: "text-orange-500 bg-orange-50" },
    ])

    // 2. Ticket Simulator
    const [ticketStep, setTicketStep] = useState<'form' | 'sending' | 'success'>('form')

    // 3. Pinning Simulator
    const [pinnedTools, setPinnedTools] = useState<string[]>(["Inicio"])

    // Handlers
    const toggleApp = (id: number) => {
        setApps(apps.map(app => app.id === id ? { ...app, active: !app.active } : app))
    }

    const handleSendTicket = () => {
        setTicketStep('sending')
        setTimeout(() => {
            setTicketStep('success')
        }, 1500)
    }

    const togglePin = (tool: string) => {
        if (pinnedTools.includes(tool)) {
            setPinnedTools(pinnedTools.filter(t => t !== tool))
        } else {
            if (pinnedTools.length < 4) setPinnedTools([...pinnedTools, tool])
        }
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/groups" className="hover:text-blue-600 transition-colors">
                        6. Colaboración & Grupos
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">7. Mis Herramientas</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                        Mis Herramientas
                    </h1>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                        Productividad
                    </Badge>
                </div>

                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Synapse se adapta a tu flujo de trabajo. Activa integraciones, utiliza widgets rápidos y ancla tus utilidades favoritas para tenerlas siempre a mano.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: APP STORE (INTERACTIVO) */}
                <TutorialCard
                    step="01"
                    title="Centro de Integraciones"
                    description="No necesitas todo, todo el tiempo. Enciende solo las herramientas que usas. Prueba activar la integración con Slack o la Calculadora de Presupuesto."
                >
                    <div className="p-6 bg-slate-50 h-full min-h-[300px] flex items-center justify-center">
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
                                <span className="text-white font-bold text-sm flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-400" /> Synapse Apps
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">v2.4</span>
                            </div>

                            <div className="p-2">
                                {apps.map((app) => (
                                    <div key={app.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-all", app.active ? app.color : "bg-slate-100 text-slate-400")}>
                                                <app.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className={cn("font-bold text-sm", app.active ? "text-slate-900" : "text-slate-500")}>{app.name}</h4>
                                                <p className="text-[10px] text-slate-400">{app.active ? "Instalado" : "Disponible"}</p>
                                            </div>
                                        </div>

                                        {/* Toggle Switch Simulado */}
                                        <button
                                            onClick={() => toggleApp(app.id)}
                                            className={cn(
                                                "w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative",
                                                app.active ? "bg-green-500" : "bg-slate-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300",
                                                app.active ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                                <p className="text-[10px] text-slate-500">Las apps activas aparecerán en tu menú principal.</p>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: PINNING / SIDEBAR (INTERACTIVO) */}
                <TutorialCard
                    step="02"
                    title="Acceso Rápido (Anclar)"
                    description="Personaliza tu barra lateral. Haz clic en el icono de 'Pin' para fijar herramientas importantes en tu menú de navegación."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[300px] flex items-center justify-center">
                        <div className="flex w-full max-w-md gap-4 h-[220px]">

                            {/* SIDEBAR MOCKUP */}
                            <div className="w-20 bg-[#0F172A] rounded-l-xl rounded-r-sm shadow-xl flex flex-col items-center py-4 gap-4 transition-all duration-500">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg mb-2 shadow-lg shadow-blue-900/50 flex items-center justify-center text-white font-bold">S</div>

                                {/* Lista de Pinned */}
                                <div className="flex flex-col gap-3 w-full items-center">
                                    {pinnedTools.map((tool, idx) => (
                                        <div key={tool} className="group relative animate-in zoom-in slide-in-from-left-2 duration-300">
                                            <div className="h-8 w-8 bg-white/10 rounded-md hover:bg-white/20 cursor-pointer flex items-center justify-center text-slate-300">
                                                {tool === "Inicio" && <LayoutTemplate className="h-4 w-4" />}
                                                {tool === "Nómina" && <Calculator className="h-4 w-4" />}
                                                {tool === "Soporte" && <Wrench className="h-4 w-4" />}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute left-10 top-1 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {tool}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* TOOLS LIST */}
                            <div className="flex-1 bg-white rounded-r-xl rounded-l-sm shadow-lg border border-slate-200 p-4 overflow-y-auto">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Herramientas Disponibles</h4>
                                <div className="space-y-2">
                                    {["Nómina", "Soporte", "Reservas"].map((item) => {
                                        const isPinned = pinnedTools.includes(item)
                                        return (
                                            <div key={item} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                                <span className="text-sm font-medium text-slate-700">{item}</span>
                                                <button
                                                    onClick={() => togglePin(item)}
                                                    className={cn(
                                                        "p-1.5 rounded-full transition-all hover:bg-slate-200",
                                                        isPinned ? "text-blue-600 bg-blue-50 hover:bg-blue-100 rotate-45" : "text-slate-400 rotate-0"
                                                    )}
                                                    title={isPinned ? "Desanclar" : "Anclar al menú"}
                                                >
                                                    <Pin className={cn("h-4 w-4 transition-transform", isPinned && "fill-current")} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-4 text-center">
                                    {pinnedTools.length >= 4 ? "Máximo de anclajes alcanzado" : "Ancla tus favoritos"}
                                </p>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: QUICK ACTIONS WIDGET (INTERACTIVO) */}
                <TutorialCard
                    step="03"
                    title="Widgets de Acción"
                    description="Realiza tareas comunes sin navegar a otra página. Prueba nuestro widget de 'Soporte Rápido' para enviar un ticket ahora mismo."
                >
                    <div className="p-6 bg-slate-50 h-full min-h-[300px] flex items-center justify-center">

                        {/* MINI APP CONTAINER */}
                        <div className="w-full max-w-[280px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden relative">
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                            <div className="p-5">
                                {ticketStep === 'form' ? (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wrench className="h-4 w-4 text-indigo-600" />
                                            <h4 className="font-bold text-slate-800 text-sm">Soporte TI</h4>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-slate-500">Asunto</label>
                                                <select className="w-full text-xs border border-slate-200 rounded p-1.5 bg-slate-50 outline-none focus:border-indigo-500">
                                                    <option>Error de Acceso</option>
                                                    <option>Solicitud de Software</option>
                                                    <option>Problema de Hardware</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-slate-500">Descripción</label>
                                                <textarea
                                                    className="w-full text-xs border border-slate-200 rounded p-2 bg-slate-50 h-16 resize-none outline-none focus:border-indigo-500"
                                                    placeholder="Describe brevemente..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSendTicket}
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            Enviar Ticket <ArrowRight className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : ticketStep === 'sending' ? (
                                    <div className="h-[200px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
                                        <p className="text-xs text-slate-500 font-medium">Procesando solicitud...</p>
                                    </div>
                                ) : (
                                    <div className="h-[200px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 bg-emerald-50/50">
                                        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <h4 className="font-bold text-emerald-800 text-sm">¡Ticket #4092 Creado!</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 px-4">Un técnico te contactará en aprox. 15 minutos.</p>
                                        <button
                                            onClick={() => setTicketStep('form')}
                                            className="mt-4 text-[10px] text-slate-400 underline hover:text-slate-600"
                                        >
                                            Nueva Solicitud
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </TutorialCard>

            </div>

            {/* FOOTER NAVEGACIÓN */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-slate-500 mb-1">Anterior</p>
                    <Button variant="outline" asChild className="group">
                        <Link href="/docs/tutorial/groups">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            5. Colaboración & Grupos
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Módulo</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/trash">
                            8. Papelera & Seguridad
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}