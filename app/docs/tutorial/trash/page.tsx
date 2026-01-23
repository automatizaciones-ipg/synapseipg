'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Trash2, RefreshCw, Search, AlertTriangle, Clock, FileText, Image as ImageIcon, AlertCircle, ShieldCheck, X } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Datos simulados para la papelera
const INITIAL_TRASH_ITEMS = [
    { id: 1, name: "Contrato_Borrador.pdf", type: "pdf", daysLeft: 29, size: "1.2 MB", deletedBy: "Tú" },
    { id: 2, name: "Foto_Evento_2023.jpg", type: "img", daysLeft: 5, size: "4.5 MB", deletedBy: "Admin" },
    { id: 3, name: "Presupuesto_Error.xlsx", type: "xls", daysLeft: 1, size: "0.8 MB", deletedBy: "Tú" },
]

export default function LessonTrashPage() {

    // --- ESTADOS INTERACTIVOS ---

    // 1. Search & Restore Simulator
    const [trashItems, setTrashItems] = useState(INITIAL_TRASH_ITEMS)
    const [searchTerm, setSearchTerm] = useState("")
    const [restoredId, setRestoredId] = useState<number | null>(null)

    // 2. Hard Delete Simulator
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isTrashEmpty, setIsTrashEmpty] = useState(false)

    // Filtrado en tiempo real
    const filteredItems = trashItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handlers
    const handleRestore = (id: number) => {
        setRestoredId(id)
        // Simular animación de salida y eliminación de la lista
        setTimeout(() => {
            setTrashItems(prev => prev.filter(item => item.id !== id))
            setRestoredId(null)
        }, 600)
    }

    const handleEmptyTrash = () => {
        setIsDeleteModalOpen(false)
        setIsTrashEmpty(true)
        // Reset para demo después de unos segundos
        setTimeout(() => {
            setIsTrashEmpty(false)
            setTrashItems(INITIAL_TRASH_ITEMS)
        }, 4000)
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/tools" className="hover:text-blue-600 transition-colors">
                        7. Mis Herramientas
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">8. Papelera & Seguridad</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                        Papelera y Seguridad
                    </h1>
                    <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                        Zona de Riesgo
                    </Badge>
                </div>

                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Synapse te protege de errores accidentales, pero mantiene tu espacio limpio. Domina el ciclo de vida de eliminación de 30 días y la restauración segura.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: VISUALIZACIÓN 30 DÍAS */}
                <TutorialCard
                    step="01"
                    title="El Ciclo de los 30 Días"
                    description="Nada se borra instantáneamente. Los archivos entran en un 'limbo' de seguridad durante 30 días antes de su eliminación permanente automática."
                >
                    <div className="p-6 bg-slate-50 h-full min-h-[260px] flex items-center justify-center">
                        <div className="w-full max-w-md space-y-4">
                            {/* Visualización de Timeline */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700 text-sm">Archivo Eliminado Hoy</span>
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Seguro</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="h-4 w-4" />
                                    <span>Se eliminará automáticamente en <b className="text-slate-900">30 días</b></span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm relative overflow-hidden opacity-90">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="absolute -right-4 -top-4 bg-red-100 h-16 w-16 rounded-full blur-xl opacity-50"></div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700 text-sm">Archivo Antiguo</span>
                                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 animate-pulse">Crítico</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Se eliminará definitivamente en <b className="underline">24 horas</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: BUSCADOR Y RESTAURACIÓN (INTERACTIVO) */}
                <TutorialCard
                    step="02"
                    title="Búsqueda y Rescate"
                    description="¿Borraste algo por error? Usa el buscador integrado en la papelera para localizarlo y restáuralo a su carpeta original con un clic."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[300px] flex items-center justify-center">
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[280px]">

                            {/* Trash Header & Search */}
                            <div className="p-3 border-b border-slate-100 bg-slate-50 space-y-2">
                                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                                    <Trash2 className="h-3 w-3" /> Papelera ({trashItems.length})
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar archivo eliminado..."
                                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Trash List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between group hover:border-blue-300 hover:shadow-sm transition-all duration-300",
                                                restoredId === item.id && "translate-x-full opacity-0"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={cn("h-8 w-8 rounded flex items-center justify-center text-xs font-bold",
                                                    item.type === 'pdf' ? "bg-red-50 text-red-600" :
                                                        item.type === 'img' ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"
                                                )}>
                                                    {item.type.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400">Expira en {item.daysLeft} días</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRestore(item.id)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Restaurar"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                                        <Search className="h-6 w-6 opacity-20" />
                                        <p>No se encontraron archivos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: BORRADO DEFINITIVO (SIMULADOR DE RIESGO) */}
                <TutorialCard
                    step="03"
                    title="Eliminación Definitiva"
                    description="Para liberar espacio o por seguridad, puedes forzar el vaciado. Advertencia: Esta acción es irreversible y requiere confirmación."
                >
                    <div className="p-6 bg-red-50/30 h-full min-h-[300px] flex items-center justify-center">

                        {/* Estado Vacío / Éxito */}
                        {isTrashEmpty ? (
                            <div className="text-center animate-in zoom-in duration-500">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                    <ShieldCheck className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="text-slate-900 font-bold text-sm">Papelera Vacía</h3>
                                <p className="text-slate-500 text-xs mt-1">Tu espacio está limpio y seguro.</p>
                                <button onClick={() => setIsTrashEmpty(false)} className="mt-4 text-[10px] text-blue-600 hover:underline">Reiniciar Demo</button>
                            </div>
                        ) : (
                            /* Botón Trigger */
                            <div className="text-center">
                                <div className="mb-6 relative mx-auto w-24 h-24 flex items-center justify-center">
                                    <Trash2 className="h-12 w-12 text-red-200 absolute animate-pulse" />
                                    <Trash2 className="h-12 w-12 text-red-500 relative z-10" />
                                </div>
                                <p className="text-xs text-slate-500 mb-4 max-w-[200px] mx-auto">Hay 3 archivos ocupando espacio. ¿Deseas eliminarlos ahora?</p>
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                                >
                                    Vaciar Papelera
                                </Button>
                            </div>
                        )}

                        {/* MODAL SIMULADO (Overlay) */}
                        {isDeleteModalOpen && (
                            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 rounded-xl animate-in fade-in duration-200">
                                <div className="bg-white rounded-lg shadow-2xl p-5 w-full max-w-[260px] animate-in zoom-in-95 duration-200 border border-red-100">
                                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h4 className="text-center font-bold text-slate-900 text-sm mb-1">¿Estás seguro?</h4>
                                    <p className="text-center text-[10px] text-slate-500 mb-4 leading-relaxed">
                                        Esta acción eliminará <b>3 ítems</b> permanentemente. No podrás deshacer este cambio.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsDeleteModalOpen(false)}
                                            className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleEmptyTrash}
                                            className="flex-1 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                                        >
                                            Sí, eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TutorialCard>

            </div>

            {/* FOOTER NAVEGACIÓN */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-slate-500 mb-1">Anterior</p>
                    <Button variant="outline" asChild className="group">
                        <Link href="/docs/tutorial/tools">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            6. Mis Herramientas
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Certificación Final</p>
                    <Button asChild size="lg" className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-8 border-0 shadow-xl">
                        <Link href="/docs/tutorial/certification">
                            Obtener Certificado
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}