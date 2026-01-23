'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    User,
    ShieldCheck,
    Mail,
    Save,
    Heart,
    Activity,
    ExternalLink,
    LayoutDashboard,
    Users,
    FileText
} from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"

export default function LessonTwoPage() {
    // Estado para la simulación del "Me gusta/Favorito" en el Paso 02
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- HEADER --- */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/intro" className="hover:text-blue-600 transition-colors">
                        2. Subiendo un Recurso
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">3. Tu Espacio Personal</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                    Tu Identidad Digital
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Synapse posee apartados de navegación esclusivos para cada funcionalidad. Aprende a personalizar tu perfil, añadir recursos a favoritos y conocer los recursos que el equipo comparte contigo.
                </p>
            </div>

            <div className="space-y-8">

                {/* ================================================================================== */}
                {/* PASO 1: PERFIL Y AVATAR */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="01"
                    title="Imagen Profesional"
                    description="Tu avatar es visible para todos en los Grupos y Recursos compartidos. Puedes cambiar tu imagen de perfil en cualquier momento desde Configuraciónes en el dashboard lateral izquierdo, para que tu equipo pueda identificarte fácilmente."
                >
                    {/* MOCKUP: EDIT PROFILE */}
                    <div className="p-6 bg-slate-50 h-full min-h-[250px] flex items-center justify-center">
                        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-100 p-6 relative overflow-hidden group pt-12">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                            <div className="relative flex flex-col items-center -mt-10 mb-4">
                                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-slate-200 shadow-md flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-105 transition-transform">
                                    <User className="h-10 w-10 text-slate-400" />
                                    {/* Overlay al hacer hover simulado */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h4 className="mt-2 font-bold text-slate-900">Luis Rivera Araya</h4>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Correo Institucional</label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200 text-sm text-slate-600">
                                        <Mail className="h-3.5 w-3.5" />
                                        correo.institucional@ipg.cl
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

                {/* ================================================================================== */}
                {/* PASO 2: TUS RECURSOS FAVORITOS (DISEÑO FIJO TIPO MÓVIL) */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="02"
                    title="Tus Recursos Favoritos"
                    description="En el apartado favoritos del dashboard, podrás encontrar de manera rápida todos los recursos que hayas agregado a favoritos. Puedes agregar o quitar de favoritos los recursos que quieras y cuando quieras haciendo click en el Corazón fijado en la parte superior derecha."
                >
                    <div className="w-full h-full min-h-[320px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex">

                        {/* --- SIDEBAR MOCKUP (FORZADO A MÓVIL/ICONOS SIEMPRE) --- */}
                        {/* Se eliminó 'sm:w-48' para mantenerlo siempre estrecho (w-16) */}
                        <div className="w-16 bg-white border-r border-slate-200 flex flex-col py-6 gap-2 shrink-0 items-center">
                            {/* Logo Placeholder - Siempre pequeño */}
                            <div className="px-2 mb-4">
                                <div className="h-6 w-6 bg-blue-600 rounded-sm"></div>
                            </div>

                            {/* Items Inactivos (Solo Iconos) */}
                            <div className="flex items-center justify-center h-10 w-10 text-slate-400 rounded-md hover:bg-slate-50">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>

                            {/* ITEM ACTIVO: FAVORITOS */}
                            <div className="flex items-center justify-center h-10 w-10 bg-blue-50 text-blue-600 rounded-md relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-600 rounded-r-full"></div>
                                <Heart className="h-5 w-5 fill-current" />
                            </div>

                            {/* Item Inactivo: Compartidos */}
                            <div className="flex items-center justify-center h-10 w-10 text-slate-400 rounded-md hover:bg-slate-50">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>

                        {/* --- MAIN CONTENT MOCKUP --- */}
                        <div className="flex-1 p-4 bg-slate-50 flex flex-col justify-center relative overflow-hidden">
                            {/* Grid de fondo sutil */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                            {/* Header del Content (Simplificado Móvil) */}
                            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pb-4 border-b border-slate-200/60 z-10">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Tus Favoritos</span>
                            </div>

                            {/* TARJETA INTERACTIVA DE FAVORITOS (CENTRADA, ANCHO FIJO TIPO MÓVIL) */}
                            <div className="w-full max-w-[300px] bg-white rounded-xl shadow-lg border border-slate-200 p-5 relative transition-all duration-300 hover:shadow-xl hover:border-slate-300 group z-20 mx-auto mt-8">

                                {/* --- BOTÓN CORAZÓN (TOP RIGHT) --- */}
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={cn(
                                        "absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 z-30 focus:outline-none",
                                        isFavorite
                                            ? "bg-rose-50 text-rose-500 shadow-sm ring-1 ring-rose-100 hover:bg-rose-100 scale-110"
                                            : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    )}
                                    title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                >
                                    <Heart
                                        className={cn(
                                            "h-5 w-5 transition-all duration-300",
                                            isFavorite ? "fill-current scale-110" : "scale-100"
                                        )}
                                    />
                                </button>

                                {/* Contenido de la Tarjeta */}
                                <div className="flex flex-col h-full gap-4">

                                    {/* Header del Recurso */}
                                    <div className="flex items-start justify-between pr-10">
                                        <div className="flex gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight">Supabase Dashboards</h4>
                                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                                                    TECNOLOGÍA
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        Panel de administración para esquemas de base de datos.
                                    </p>

                                    {/* Footer del Recurso */}
                                    <div className="pt-3 mt-auto border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 text-[8px] flex items-center justify-center font-bold text-slate-600" title="Usuario 1">LR</div>
                                            <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-300 text-[8px] flex items-center justify-center font-bold text-slate-600" title="Usuario 2">JD</div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="text-[10px] font-medium text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                                                Abrir <ExternalLink className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje de Feedback */}
                            <div className="flex justify-center mt-6 h-8">
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-500 transform",
                                    isFavorite
                                        ? "bg-rose-100 text-rose-700 opacity-100 translate-y-0 shadow-sm"
                                        : "bg-slate-200 text-slate-400 opacity-0 translate-y-4"
                                )}>
                                    <Heart className="h-3 w-3 fill-current" /> Recurso añadido a favoritos
                                </div>
                            </div>

                            {!isFavorite && (
                                <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 animate-pulse">
                                    Haz clic en el corazón para probar
                                </div>
                            )}

                        </div>
                    </div>
                </TutorialCard>

                {/* ================================================================================== */}
                {/* PASO 3: COMPARTIDOS CONTIGO (DISEÑO FIJO TIPO MÓVIL) */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="03"
                    title="Compartidos Contigo"
                    description="Cuando un colaborador de ipg comparta un recurso contigo, podrás acceder a él directamente en el apartado de Compartidos del Dashboard izquierdo. Todos los recursos que están disponibles para ti, los verás en este apartado."
                >
                    <div className="w-full h-full min-h-[320px] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex">

                        {/* --- SIDEBAR MOCKUP (FORZADO A MÓVIL) --- */}
                        <div className="w-16 bg-white border-r border-slate-200 flex flex-col py-6 gap-2 shrink-0 items-center">
                            {/* Logo */}
                            <div className="px-2 mb-4">
                                <div className="h-6 w-6 bg-blue-600 rounded-sm"></div>
                            </div>

                            {/* Items Inactivos */}
                            <div className="flex items-center justify-center h-10 w-10 text-slate-400 rounded-md hover:bg-slate-50">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>

                            <div className="flex items-center justify-center h-10 w-10 text-slate-400 rounded-md hover:bg-slate-50">
                                <Heart className="h-5 w-5" />
                            </div>

                            {/* ITEM ACTIVO: COMPARTIDOS */}
                            <div className="flex items-center justify-center h-10 w-10 bg-blue-50 text-blue-600 rounded-md relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-blue-600 rounded-r-full"></div>
                                <Users className="h-5 w-5" />
                            </div>
                        </div>

                        {/* --- MAIN CONTENT MOCKUP --- */}
                        <div className="flex-1 p-4 bg-slate-50 flex flex-col justify-center relative">
                            {/* Header del Content */}
                            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pb-4 border-b border-slate-200/60">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Compartidos</span>
                            </div>

                            {/* SINGLE SHARED RESOURCE CARD (CENTRADA) */}
                            <div className="w-full max-w-[300px] bg-white rounded-xl shadow-sm border border-slate-200 p-5 mx-auto mt-8 transition-transform hover:scale-[1.02] cursor-default">

                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-8 w-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200 uppercase">
                                        Docs
                                    </span>
                                </div>

                                <h5 className="font-bold text-slate-800 text-sm mb-1">Guía de Estilos 2024</h5>
                                <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                    Documentación oficial para el uso de marca y componentes UI en proyectos internos.
                                </p>

                                {/* Footer: Shared By */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className="h-7 w-7 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-[9px] font-bold text-emerald-700">
                                                AP
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px] shadow-sm">
                                                <Activity className="h-2.5 w-2.5 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-400 font-medium leading-none mb-0.5">Compartido por</span>
                                            <span className="text-[10px] font-bold text-slate-700 leading-none">Luis Rivera</span>
                                        </div>
                                    </div>
                                    <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
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
                            2. Subiendo un Recurso
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Lección</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/navigation">
                            4. Navegación Maestra
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}