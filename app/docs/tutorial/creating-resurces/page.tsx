'use client'

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Plus,
    X,
    Link as LinkIcon,
    MapPin,
    Sparkles,
    Globe,
    Users,
    LayoutGrid,
    Mail,
    FileUp,
    CheckCircle2,
    Loader2,
    Home,
    FolderOpen,
    Settings,
    Cloud,
    LayoutDashboard,
    FolderClosed,
    Activity,
    ChevronRight,
    ChevronDown,
    Tag,
    AlignLeft,
    Image as ImageIcon
} from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"

// --- TYPES ---
type VisibilityType = 'global' | 'users' | 'groups'

interface ResourceFormState {
    url: string
    title: string
    description: string
    tags: string[]
}

export default function LessonResourcesPage() {
    // --- STATE MANAGEMENT ---
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [visibility, setVisibility] = useState<VisibilityType>('global')
    const [aiLoading, setAiLoading] = useState(false)
    const [folderOpen, setFolderOpen] = useState(false)

    const [formState, setFormState] = useState<ResourceFormState>({
        url: "",
        title: "",
        description: "",
        tags: []
    })

    const handleAiGenerate = () => {
        setAiLoading(true)
        setTimeout(() => {
            setFormState({
                url: "https://ejemplo-recurso.com/guia",
                title: "Documentación Técnica Q1",
                description: "Recopilación exhaustiva de los estándares.",
                tags: ["Docs", "Dev", "2024"]
            })
            setAiLoading(false)
        }, 1500)
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- HEADER --- */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/intro" className="hover:text-blue-600 transition-colors">
                        1. Primeros Pasos
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">2. Subiendo un Recurso</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                    Subiendo un Recurso
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Aprende el flujo completo para compartir conocimiento. Desde la creación del enlace hasta la distribución inteligente.
                </p>
            </div>

            <div className="space-y-10">

                {/* ================================================================================== */}
                {/* PASO 1: INICIANDO LA CREACIÓN (PERFECTO - NO TOCAR) */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="01"
                    title="Iniciando la Creación"
                    description="En tu panel principal, hemos simplificado el proceso. Haz clic en el botón '+' azul destacado en la barra lateral oscura para desplegar el menú de creación."
                >
                    {/* Contenedor Exterior */}
                    <div className="p-4 sm:p-6 bg-slate-200/50 h-full min-h-[450px] flex items-center justify-center relative select-none">

                        {/* MOCKUP PRINCIPAL */}
                        <div className="w-full max-w-[600px] bg-slate-50 rounded-xl shadow-2xl shadow-slate-400/20 border border-slate-200/60 overflow-hidden flex flex-row h-[400px] relative ring-1 ring-slate-900/5">

                            {/* --- SIDEBAR (SIEMPRE VISIBLE - FLEX) --- */}
                            <div className="flex w-16 bg-[#0F172A] flex-col items-center py-5 gap-4 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.3)] shrink-0">
                                {/* Logo App */}
                                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50 mb-2 shrink-0">
                                    <Cloud className="h-5 w-5 text-white" />
                                </div>

                                {/* BOTÓN NUEVO RECURSO (AZUL CORPORATIVO) */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all group relative shrink-0"
                                >
                                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                <div className="w-8 h-[1px] bg-slate-700/50 my-1 shrink-0" />

                                {/* Iconos de Navegación */}
                                <div className="flex flex-col gap-4 w-full items-center">
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 text-blue-400 shadow-sm cursor-default relative ring-1 ring-blue-500/30">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </div>
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-default">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-default">
                                        <FolderClosed className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Settings Bottom */}
                                <div className="mt-auto">
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white transition-colors">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* --- TOOLTIP "CLICK AQUÍ" (POSICIONADO EXACTAMENTE) --- */}
                            {!isModalOpen && (
                                <div className="absolute top-[84px] left-[74px] z-30 animate-pulse pointer-events-none flex items-center gap-2">
                                    <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                        <ArrowRight className="h-3 w-3 rotate-180" /> Click aquí
                                    </div>
                                </div>
                            )}

                            {/* --- MAIN CONTENT --- */}
                            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] relative">

                                {/* HEADER SUPERIOR */}
                                <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 sticky top-0 z-10">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-bold text-slate-800 tracking-tight truncate">Panel General</h2>
                                    </div>
                                    <div className="flex items-center shrink-0">
                                        <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm border border-white cursor-default">LA</div>
                                    </div>
                                </div>

                                {/* DASHBOARD BODY */}
                                <div className="p-5 overflow-hidden flex flex-col h-full relative">
                                    {/* TABS */}
                                    <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden mask-linear-gradient">
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-medium rounded-full whitespace-nowrap shadow-sm shrink-0">Inicio</span>
                                        {['Comunicaciones', 'Admisión', 'Secretaría'].map((tab) => (
                                            <span key={tab} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded-full whitespace-nowrap hover:bg-slate-50 cursor-default shrink-0">{tab}</span>
                                        ))}
                                    </div>

                                    {/* CONTENIDO (Placeholder) */}
                                    <div className="grid grid-cols-1 gap-3 opacity-60 pointer-events-none select-none">
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col h-24">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                                    <Activity className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-[11px] font-bold text-slate-800 truncate">Reporte Q1 2024</h4>
                                                    <span className="text-[9px] text-slate-400">Hace 2 horas</span>
                                                </div>
                                            </div>
                                            <div className="h-2 w-3/4 bg-slate-100 rounded-full mt-auto" />
                                        </div>
                                    </div>

                                    {/* MODAL OVERLAY */}
                                    {isModalOpen && (
                                        <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200">
                                            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
                                                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                                                    <h3 className="font-bold text-xs text-slate-800">Crear Nuevo</h3>
                                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="p-4 grid grid-cols-2 gap-3">
                                                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition-all group/opt">
                                                        <div className="h-8 w-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center group-hover/opt:scale-110 transition-transform">
                                                            <LinkIcon className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-blue-900">Enlace Web</span>
                                                    </button>
                                                    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all opacity-60 cursor-not-allowed">
                                                        <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                                                            <FileUp className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-600">Subir Archivo</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 2: DATOS DEL RECURSO (RESTAURADO COMPLETO) */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="02"
                    title="Detalles del Recurso"
                    description="Una vez seleccionado el tipo 'Enlace', completa la información básica. Pega la URL y asigna un título descriptivo."
                >
                    <div className="w-full bg-white rounded-lg border border-slate-200 p-6 max-w-md mx-auto shadow-sm">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            {/* URL */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    <LinkIcon className="h-3 w-3" /> Enlace del Recurso
                                </label>
                                <input type="text" placeholder="https://..." className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                            </div>

                            {/* Título */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Título</label>
                                <input type="text" placeholder="Ej: Manual de Marca 2024" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-blue-500 outline-none" />
                            </div>

                            {/* Descripción (Restaurado) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    <AlignLeft className="h-3 w-3" /> Descripción
                                </label>
                                <textarea
                                    placeholder="Describe brevemente de qué trata este recurso..."
                                    className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-blue-500 outline-none min-h-[80px] resize-none"
                                />
                            </div>

                            {/* Grid Inferior: Tags e Imagen */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        <Tag className="h-3 w-3" /> Etiquetas
                                    </label>
                                    <input type="text" placeholder="marketing, 2024" className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 focus:border-blue-500 outline-none" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        <ImageIcon className="h-3 w-3" /> Vista Previa
                                    </label>
                                    <div className="h-[38px] w-full bg-slate-50 border border-slate-200 border-dashed rounded-md flex items-center justify-center text-[10px] text-slate-400 cursor-pointer hover:bg-slate-100">
                                        Auto-generar
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 3: SELECCIONAR CARPETA (RESTAURADO "EXACTO A MI SISTEMA") */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="03"
                    title="Seleccionar Carpeta"
                    description="El orden es vital. Define dónde vivirá este recurso dentro de la estructura de la organización. Haz clic en el selector para desplegar el árbol de carpetas disponible."
                >
                    {/* Contenedor Exterior Estilizado */}
                    <div className="p-6 bg-slate-100/50 border border-slate-200 rounded-xl flex items-center justify-center min-h-[300px]">

                        {/* Card del Formulario */}
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-visible relative">
                            <div className="p-5 space-y-4">

                                {/* Header Simulado del Form */}
                                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-3">
                                    <div className="h-6 w-6 bg-blue-100 rounded-md flex items-center justify-center text-blue-600">
                                        <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-700">Ubicación de destino</h4>
                                </div>

                                {/* Input Interactivo */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Carpeta</label>

                                    <button
                                        onClick={() => setFolderOpen(!folderOpen)}
                                        className={cn(
                                            "w-full flex items-center justify-between bg-slate-50 hover:bg-white border text-left px-3 py-2.5 rounded-lg transition-all duration-200 outline-none ring-offset-1",
                                            folderOpen ? "border-blue-500 ring-2 ring-blue-100 bg-white" : "border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <FolderOpen className={cn("h-4 w-4 transition-colors", folderOpen ? "text-blue-500" : "text-slate-400")} />
                                            <span className="text-sm text-slate-700 font-medium">Inicio / Marketing</span>
                                        </div>
                                        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-200", folderOpen && "rotate-180 text-blue-500")} />
                                    </button>

                                    {/* Dropdown Menu Simulado */}
                                    {folderOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-20 animate-in zoom-in-95 slide-in-from-top-2 duration-200 overflow-hidden">
                                            <div className="p-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">

                                                {/* Option: Root */}
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                                                    <Home className="h-4 w-4 text-slate-400" />
                                                    <span className="text-xs font-medium">Inicio (Raíz)</span>
                                                </div>

                                                {/* Option: Marketing (Active) */}
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50/50 border border-blue-100 cursor-pointer text-blue-700">
                                                    <FolderOpen className="h-4 w-4 text-blue-500" />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">Marketing</span>
                                                        <span className="text-[9px] text-blue-400">Subcarpeta</span>
                                                    </div>
                                                    <CheckCircle2 className="h-3 w-3 ml-auto text-blue-500" />
                                                </div>

                                                {/* Option: Dev */}
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors group">
                                                    <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                                                    <FolderClosed className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                                    <span className="text-xs font-medium">Desarrollo</span>
                                                </div>

                                                {/* Option: RRHH */}
                                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors group">
                                                    <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-slate-500" />
                                                    <FolderClosed className="h-4 w-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                                    <span className="text-xs font-medium">Recursos Humanos</span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-[9px] text-slate-400">4 carpetas disponibles</span>
                                                <button className="text-[10px] font-bold text-blue-600 hover:underline">+ Nueva Carpeta</button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 border-slate-200">Solo lectura</Badge>
                                        <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-600 border-purple-100">Visible para todos</Badge>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 4: TIPO DE RECURSO */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="04"
                    title="Nivel de Privacidad"
                    description="Controla quién puede acceder a tu contenido. 'Global' es visible para toda la organización. 'Compartido' te permite seleccionar usuarios o grupos específicos."
                >
                    <div className="flex flex-col gap-3 max-w-sm mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div
                            onClick={() => setVisibility('global')}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden",
                                visibility === 'global'
                                    ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500"
                                    : "bg-white border-slate-200 hover:border-slate-300 opacity-70"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", visibility === 'global' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400")}>
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800">Global</h5>
                                <p className="text-[10px] text-slate-500">Visible para toda la organización</p>
                            </div>
                            {visibility === 'global' && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-blue-500" />}
                        </div>

                        <div
                            onClick={() => setVisibility('users')}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden",
                                visibility === 'users'
                                    ? "bg-white border-purple-500 shadow-md ring-1 ring-purple-500"
                                    : "bg-white border-slate-200 hover:border-slate-300 opacity-70"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", visibility === 'users' ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-400")}>
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800">Usuarios Específicos</h5>
                                <p className="text-[10px] text-slate-500">Solo personas seleccionadas</p>
                            </div>
                            {visibility === 'users' && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-purple-500" />}
                        </div>

                        <div
                            onClick={() => setVisibility('groups')}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden",
                                visibility === 'groups'
                                    ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500"
                                    : "bg-white border-slate-200 hover:border-slate-300 opacity-70"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", visibility === 'groups' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-slate-800">Grupos</h5>
                                <p className="text-[10px] text-slate-500">Miembros de un departamento</p>
                            </div>
                            {visibility === 'groups' && <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-emerald-500" />}
                        </div>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 5: AUTO-RELLENADO CON AI */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="05"
                    title="Magia con IA"
                    description="No pierdas tiempo redactando descripciones. Haz clic en el botón 'Autocompletar' y nuestra IA analizará tu enlace o título para generar tags y descripciones automáticamente."
                >
                    <div className="bg-slate-900 rounded-xl p-6 max-w-md mx-auto relative overflow-hidden text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Datos del Recurso</label>
                                    <div className="h-1 w-12 bg-purple-500 rounded mt-1"></div>
                                </div>
                                <button
                                    onClick={handleAiGenerate}
                                    disabled={aiLoading || formState.title !== ""}
                                    className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {aiLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3 w-3 group-hover:animate-pulse" />
                                    )}
                                    {formState.title ? "Generado" : "Autocompletar"}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 block">Título</span>
                                    <div className={cn(
                                        "w-full p-2 rounded bg-white/5 border border-white/10 text-xs transition-all duration-500 min-h-[34px] flex items-center",
                                        formState.title ? "text-white" : "text-white/30 italic"
                                    )}>
                                        {formState.title || "Esperando input..."}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-500 block">Descripción (IA)</span>
                                    <div className={cn(
                                        "w-full p-2 rounded bg-white/5 border border-white/10 text-xs transition-all duration-700 min-h-[60px]",
                                        formState.description ? "text-white" : "text-white/30 italic"
                                    )}>
                                        {formState.description || "La IA generará un resumen aquí..."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 6: NOTIFICACIÓN POR EMAIL */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="06"
                    title="Notificaciones Instantáneas"
                    description="Una vez compartido, el sistema dispara automáticamente una alerta. Tus compañeros recibirán un correo con acceso directo."
                >
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-sm mx-auto overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">Gestor de Correo</div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Synapse Notificaciones</h4>
                                    <p className="text-[10px] text-slate-500">Para: tú &bull; Hace 2 min</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Hola, <strong>Luis Rivera</strong> ha compartido un nuevo recurso contigo:
                                </p>

                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="p-2 bg-white rounded border border-slate-200 shadow-sm group-hover:border-blue-300">
                                        <FileUp className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Documentación Técnica Q1</h5>
                                        <p className="text-[10px] text-slate-500 mt-1">Recurso Web &bull; Marketing</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

            </div>

            {/* --- NAVIGATION FOOTER --- */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
                <div className="text-center sm:text-left">
                    <p className="text-sm text-slate-500 mb-1">Anterior</p>
                    <Button variant="outline" asChild className="group">
                        <Link href="/docs/tutorial/intro">
                            <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 rotate-180" />
                            1. Primeros Pasos
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Lección</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/identity">
                            3. Tu Espacio Personal
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}