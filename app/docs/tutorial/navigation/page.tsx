'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Search, Command, Layout, Menu, X, FileText, User, Settings, CreditCard } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function LessonThreePage() {

    // --- ESTADOS PARA INTERACTIVIDAD ---
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    // Datos simulados para el buscador
    const allItems = [
        { icon: FileText, label: "Reporte Mensual", type: "Archivo" },
        { icon: User, label: "Perfil de Usuario", type: "Ajustes" },
        { icon: Settings, label: "Configuración", type: "Sistema" },
        { icon: CreditCard, label: "Finanzas", type: "Módulo" },
    ]

    const filteredItems = searchTerm === ""
        ? allItems
        : allItems.filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/profile" className="hover:text-blue-600 transition-colors">
                        3. Tu Espacio Personal
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">4. Navegación Maestra</span>
                </div>

                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                        Navegación Maestra
                    </h1>
                    <Badge variant="secondary" className="hidden sm:flex h-7 items-center gap-1 bg-slate-100 text-slate-600 border-slate-200">
                        <Command className="h-3 w-3" /> + K
                    </Badge>
                </div>

                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Synapse es vasto, pero moverse en él es instantáneo. Domina el menú lateral adaptable y nuestro potente buscador global.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: SIDEBAR INTERACTIVO */}
                <TutorialCard
                    step="01"
                    title="Sidebar Adaptativo"
                    description="Maximiza tu espacio de trabajo. Puedes colapsar el menú lateral para enfocarte en tus documentos o expandirlo para ver detalles completos."
                >
                    {/* MOCKUP: COLLAPSIBLE SIDEBAR */}
                    <div className="p-6 bg-slate-100 h-full min-h-[260px] flex items-center justify-center overflow-hidden">
                        <div className="w-full max-w-[320px] h-[200px] bg-white rounded-xl shadow-lg border border-slate-200 flex overflow-hidden relative">

                            {/* Sidebar Simulado */}
                            <div className={cn(
                                "bg-[#0B1120] text-slate-400 flex flex-col transition-all duration-500 ease-in-out relative z-10",
                                isSidebarCollapsed ? "w-[60px]" : "w-[140px]"
                            )}>
                                {/* Botón Toggle (El usuario interactúa aquí) */}
                                <button
                                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    className="absolute -right-3 top-4 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-20 border-2 border-white"
                                >
                                    <ArrowLeft className={cn("h-2 w-2 transition-transform duration-500", isSidebarCollapsed && "rotate-180")} />
                                </button>

                                <div className="p-4 flex items-center gap-3 border-b border-white/10 h-14">
                                    <div className="h-6 w-6 rounded bg-blue-600 shrink-0"></div>
                                    <div className={cn("h-2 w-16 bg-slate-700 rounded transition-opacity duration-300", isSidebarCollapsed && "opacity-0")}></div>
                                </div>

                                <div className="p-3 space-y-3 mt-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-1 rounded hover:bg-white/10 cursor-pointer transition-colors">
                                            <div className="h-4 w-4 rounded-sm bg-slate-700 shrink-0"></div>
                                            <div className={cn("h-1.5 bg-slate-700 rounded transition-all duration-500", isSidebarCollapsed ? "w-0 opacity-0" : "w-16 opacity-100")}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contenido Principal */}
                            <div className="flex-1 bg-slate-50 p-4 relative">
                                <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                                    <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                                    <div className="h-2 w-4/6 bg-slate-200 rounded"></div>
                                </div>
                                <p className="absolute bottom-2 right-2 text-[9px] text-slate-400 font-medium">
                                    {isSidebarCollapsed ? "Modo Enfoque Activado" : "Modo Navegación"}
                                </p>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: SEARCH (COMMAND K) SIMULATOR */}
                <TutorialCard
                    step="02"
                    title="Buscador Global (Command + K)"
                    description="No pierdas tiempo navegando entre carpetas. Presiona Ctrl+K (o Cmd+K) y escribe lo que buscas. Archivos, usuarios o configuraciones aparecen al instante."
                >
                    {/* MOCKUP: SEARCH MODAL */}
                    <div className="p-6 bg-slate-200 h-full min-h-[300px] flex items-center justify-center relative">
                        {/* Fondo borroso simulado */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-300">
                            {/* Search Header */}
                            <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Escribe 'finanzas' o 'perfil'..."
                                    className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results Area */}
                            <div className="p-2 max-h-[160px] overflow-y-auto">
                                <div className="text-[10px] font-medium text-slate-400 px-2 py-1 mb-1">Sugerencias</div>

                                {filteredItems.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-blue-50 cursor-pointer group transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-600" />
                                                    <span className="text-sm text-slate-700 group-hover:text-blue-700">{item.label}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded bg-white">
                                                    {item.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-slate-400 text-xs">
                                        No se encontraron resultados para {searchTerm}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 p-2 border-t border-slate-100 flex justify-between items-center px-4">
                                <span className="text-[10px] text-slate-400">Usa las flechas para navegar</span>
                                <div className="flex gap-1">
                                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                    <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: NAVEGACIÓN MÓVIL */}
                <TutorialCard
                    step="03"
                    title="Synapse en tu Bolsillo"
                    description="La experiencia móvil no es una versión reducida. Accede al menú completo tocando el icono de hamburguesa en la esquina superior izquierda."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[260px] flex items-center justify-center">
                        {/* Mobile Phone Mockup */}
                        <div className="w-[180px] h-[240px] bg-white rounded-2xl border-[6px] border-slate-800 shadow-xl overflow-hidden relative">
                            {/* Mobile Header */}
                            <div className="h-10 bg-slate-900 flex items-center px-3 justify-between relative z-20">
                                <Menu className="h-4 w-4 text-white cursor-pointer hover:opacity-80" />
                                <div className="h-3 w-3 rounded bg-blue-600"></div>
                                <div className="h-4 w-4 rounded-full bg-slate-700"></div>
                            </div>

                            {/* Mobile Body */}
                            <div className="p-3 bg-slate-50 h-full">
                                <div className="h-2 w-16 bg-slate-200 rounded mb-2"></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-16 bg-white rounded border border-slate-200 shadow-sm"></div>
                                    <div className="h-16 bg-white rounded border border-slate-200 shadow-sm"></div>
                                </div>
                            </div>

                            {/* Mobile Menu Overlay (Animated) */}
                            <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] pointer-events-none"></div>
                            <div className="absolute top-0 left-0 bottom-0 w-3/4 bg-slate-900 z-30 shadow-2xl p-4 flex flex-col gap-4 animate-in slide-in-from-left duration-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-5 w-5 bg-blue-600 rounded"></div>
                                    <div className="h-2 w-16 bg-slate-600 rounded"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-6 w-full bg-white/10 rounded flex items-center px-2">
                                        <div className="h-1.5 w-12 bg-white/40 rounded"></div>
                                    </div>
                                    <div className="h-6 w-full hover:bg-white/5 rounded flex items-center px-2">
                                        <div className="h-1.5 w-16 bg-slate-600 rounded"></div>
                                    </div>
                                    <div className="h-6 w-full hover:bg-white/5 rounded flex items-center px-2">
                                        <div className="h-1.5 w-10 bg-slate-600 rounded"></div>
                                    </div>
                                </div>
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
                        <Link href="/docs/tutorial/profile">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            3. Tu Espacio Personal
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Módulo</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        {/* Asumimos que la siguiente lección será sobre Recursos */}
                        <Link href="/docs/tutorial/resources">
                            5. Gestión de Recursos
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}