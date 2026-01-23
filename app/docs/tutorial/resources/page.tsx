'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, UploadCloud, FileText, Check, LayoutGrid, List, Folder, Star, MoreVertical, Loader2, Image as ImageIcon } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function LessonFourPage() {

    // --- ESTADOS PARA INTERACTIVIDAD ---

    // 1. Upload Simulator
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle')
    const [progress, setProgress] = useState(0)

    // 2. View Toggle Simulator
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // 3. Favorite Simulator
    const [isFavorite, setIsFavorite] = useState(false)

    // Lógica del simulador de subida
    const handleSimulateUpload = () => {
        if (uploadStatus === 'uploading') return
        setUploadStatus('uploading')
        setProgress(0)

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setUploadStatus('success')
                    return 100
                }
                return prev + 10
            })
        }, 150)
    }

    // Reset del upload después de unos segundos de éxito
    useEffect(() => {
        if (uploadStatus === 'success') {
            const timer = setTimeout(() => {
                setUploadStatus('idle')
                setProgress(0)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [uploadStatus])

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/navigation" className="hover:text-blue-600 transition-colors">
                        4. Navegación Maestra
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">5. Gestión de Recursos</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                        Gestión de Recursos
                    </h1>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:flex">
                        Core Feature
                    </Badge>
                </div>

                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    El corazón de Synapse. Aprende a centralizar documentos, organizar tu biblioteca digital y visualizar la información como prefieras.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: SUBIDA DE ARCHIVOS (INTERACTIVO) */}
                <TutorialCard
                    step="01"
                    title="Carga Inteligente"
                    description="Sube archivos arrastrándolos o usando el botón principal. El sistema detecta automáticamente el tipo de archivo y genera vistas previas."
                >
                    {/* MOCKUP: UPLOAD ZONE */}
                    <div className="p-6 bg-slate-100 h-full min-h-[280px] flex items-center justify-center">
                        <div className="w-full max-w-xs bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden">

                            {/* Zona de Arrastre Simulada */}
                            <div
                                className={cn(
                                    "w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors duration-300",
                                    uploadStatus === 'idle' ? "border-slate-200 bg-slate-50" : "border-blue-300 bg-blue-50"
                                )}
                            >
                                {uploadStatus === 'idle' ? (
                                    <>
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <UploadCloud className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-medium text-slate-700">Arrastra archivos aquí</p>
                                            <p className="text-[10px] text-slate-400">PDF, Excel, JPG hasta 50MB</p>
                                        </div>
                                    </>
                                ) : uploadStatus === 'uploading' ? (
                                    <>
                                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                        <p className="text-xs font-medium text-blue-600">Subiendo...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-in zoom-in duration-300">
                                            <Check className="h-6 w-6" />
                                        </div>
                                        <p className="text-xs font-medium text-emerald-700">¡Completado!</p>
                                    </>
                                )}
                            </div>

                            {/* Botón Trigger */}
                            <button
                                onClick={handleSimulateUpload}
                                disabled={uploadStatus !== 'idle'}
                                className={cn(
                                    "mt-4 w-full py-2 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2",
                                    uploadStatus === 'idle'
                                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {uploadStatus === 'idle' ? "Simular Subida" : "Procesando..."}
                            </button>

                            {/* Progress Bar (Solo visible subiendo) */}
                            {(uploadStatus === 'uploading' || uploadStatus === 'success') && (
                                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-150 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: VISTAS GRID / LIST (INTERACTIVO) */}
                <TutorialCard
                    step="02"
                    title="Visualización Adaptable"
                    description="¿Prefieres ver detalles o miniaturas? Alterna entre vista de Lista y Cuadrícula con un solo clic. Tu preferencia se guarda automáticamente."
                >
                    {/* MOCKUP: RESOURCE BROWSER */}
                    <div className="p-6 bg-slate-50 h-full min-h-[300px] flex flex-col">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                            <div className="text-xs font-bold text-slate-700 pl-2">Mis Recursos</div>
                            <div className="flex bg-slate-100 p-1 rounded-md">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn("p-1.5 rounded transition-all", viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn("p-1.5 rounded transition-all", viewMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area - Cambia según viewMode */}
                        <div className={cn(
                            "flex-1 transition-all duration-300 gap-3",
                            viewMode === 'grid' ? "grid grid-cols-2 content-start" : "flex flex-col"
                        )}>
                            {/* Item 1 */}
                            <div className={cn(
                                "bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group flex",
                                viewMode === 'grid' ? "flex-col items-center text-center gap-2 aspect-square justify-center" : "flex-row items-center justify-between h-14"
                            )}>
                                <div className={cn("bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center", viewMode === 'grid' ? "h-10 w-10" : "h-8 w-8")}>
                                    <Folder className={cn("fill-blue-100", viewMode === 'grid' ? "h-6 w-6" : "h-4 w-4")} />
                                </div>
                                <div className={cn(viewMode === 'grid' ? "" : "flex-1 ml-3 text-left")}>
                                    <div className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Contabilidad</div>
                                    <div className="text-[10px] text-slate-400">4 archivos</div>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className={cn(
                                "bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group flex",
                                viewMode === 'grid' ? "flex-col items-center text-center gap-2 aspect-square justify-center" : "flex-row items-center justify-between h-14"
                            )}>
                                <div className={cn("bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center", viewMode === 'grid' ? "h-10 w-10" : "h-8 w-8")}>
                                    <ImageIcon className={cn(viewMode === 'grid' ? "h-6 w-6" : "h-4 w-4")} />
                                </div>
                                <div className={cn(viewMode === 'grid' ? "" : "flex-1 ml-3 text-left")}>
                                    <div className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Banner.jpg</div>
                                    <div className="text-[10px] text-slate-400">2.4 MB</div>
                                </div>
                            </div>

                            {/* Item 3 (Solo para rellenar visualmente) */}
                            <div className={cn(
                                "bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group flex",
                                viewMode === 'grid' ? "flex-col items-center text-center gap-2 aspect-square justify-center" : "flex-row items-center justify-between h-14"
                            )}>
                                <div className={cn("bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center", viewMode === 'grid' ? "h-10 w-10" : "h-8 w-8")}>
                                    <FileText className={cn(viewMode === 'grid' ? "h-6 w-6" : "h-4 w-4")} />
                                </div>
                                <div className={cn(viewMode === 'grid' ? "" : "flex-1 ml-3 text-left")}>
                                    <div className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Reporte.pdf</div>
                                    <div className="text-[10px] text-slate-400">Hace 2h</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: FAVORITOS Y ACCIONES (INTERACTIVO) */}
                <TutorialCard
                    step="03"
                    title="Gestión Rápida"
                    description="Usa el menú contextual para editar, mover o eliminar. Marca tus archivos más importantes con la estrella para acceder a ellos rápidamente."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[250px] flex items-center justify-center">
                        <div className="w-full max-w-[260px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 relative group">

                            {/* Tarjeta de Recurso Detallada */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-red-50 p-2 rounded-lg">
                                    <FileText className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex gap-1">
                                    {/* FAVORITE BUTTON INTERACTIVO */}
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="p-1.5 hover:bg-slate-50 rounded-full transition-colors"
                                    >
                                        <Star
                                            className={cn(
                                                "h-4 w-4 transition-all duration-300",
                                                isFavorite ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-400 hover:text-amber-400"
                                            )}
                                        />
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800 text-sm">Presupuesto 2026.pdf</h4>
                                <p className="text-xs text-slate-500">Actualizado por Luis Rivera</p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mt-4">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">Finanzas</span>
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full">Oficial</span>
                            </div>

                            {/* Feedback Visual */}
                            <div className={cn(
                                "absolute inset-x-0 -bottom-8 mx-auto w-max px-3 py-1 bg-slate-900 text-white text-[10px] rounded-full transition-all duration-300 opacity-0 translate-y-2",
                                isFavorite && "opacity-100 translate-y-[-40px]"
                            )}>
                                Añadido a Favoritos
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
                        <Link href="/docs/tutorial/navigation">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            4. Navegación Maestra
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Módulo</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        {/* Asumimos que la siguiente lección es Colaboración */}
                        <Link href="/docs/tutorial/groups">
                            6. Colaboración & Grupos
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}