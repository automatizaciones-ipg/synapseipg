'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Users, Plus, Shield, Globe, Lock, Briefcase, Check, UserPlus, X } from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Datos simulados para el ejercicio
const INITIAL_GROUPS = [
    { id: 1, name: "Finanzas", members: 3, color: "bg-blue-600" },
    { id: 2, name: "RRHH", members: 5, color: "bg-emerald-600" }
]

const INITIAL_MEMBERS = [
    { id: 1, init: "LR", color: "bg-blue-100 text-blue-700" },
    { id: 2, init: "JP", color: "bg-amber-100 text-amber-700" },
]

export default function LessonFivePage() {

    // --- ESTADOS INTERACTIVOS ---

    // 1. Group Creator
    const [groups, setGroups] = useState(INITIAL_GROUPS)
    const [isCreating, setIsCreating] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")

    // 2. Member Manager
    const [members, setMembers] = useState(INITIAL_MEMBERS)
    const [isInviting, setIsInviting] = useState(false)

    // 3. Permission Toggle
    const [permission, setPermission] = useState<'public' | 'private' | 'group'>('private')

    // Handlers
    const handleAddGroup = () => {
        if (!newGroupName.trim()) return
        const newGroup = {
            id: Date.now(),
            name: newGroupName,
            members: 1,
            color: "bg-indigo-600"
        }
        setGroups([...groups, newGroup])
        setNewGroupName("")
        setIsCreating(false)
    }

    const handleAddMember = () => {
        if (members.length >= 5) return // Limit para demo
        setIsInviting(true)
        // Simulamos red
        setTimeout(() => {
            setMembers([...members, { id: Date.now(), init: "NU", color: "bg-slate-100 text-slate-700" }])
            setIsInviting(false)
        }, 600)
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* HEADER */}
            <div className="space-y-6 border-b border-slate-200 pb-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/docs/tutorial/resources" className="hover:text-blue-600 transition-colors">
                        5. Gestión de Recursos
                    </Link>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-medium text-blue-600">6. Colaboración & Grupos</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
                        Colaboración & Grupos
                    </h1>
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
                        Teamwork
                    </Badge>
                </div>

                <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                    Nadie trabaja solo. Aprende a crear espacios de trabajo compartidos, gestionar equipos y definir quién ve qué con precisión quirúrgica.
                </p>
            </div>

            <div className="space-y-8">

                {/* PASO 1: CREACIÓN DE GRUPOS (INTERACTIVO) */}
                <TutorialCard
                    step="01"
                    title="Espacios de Trabajo"
                    description="Crea grupos para departamentos o proyectos específicos. Prueba creando un nuevo grupo llamado 'Marketing' en este simulador."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[300px] flex flex-col relative overflow-hidden">

                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mis Grupos</h4>
                            {!isCreating && (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors shadow-sm"
                                >
                                    <Plus className="h-3 w-3" /> Nuevo
                                </button>
                            )}
                        </div>

                        {/* Grid de Grupos */}
                        <div className="grid grid-cols-2 gap-3 content-start flex-1 overflow-y-auto pb-2 pr-1 custom-scrollbar">
                            {/* Formulario Inline (Animado) */}
                            {isCreating && (
                                <div className="col-span-2 bg-white border border-blue-200 rounded-xl p-3 shadow-md animate-in slide-in-from-top-2 fade-in duration-300">
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Nombre del Grupo</label>
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Ej: Marketing"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                                        />
                                        <button onClick={handleAddGroup} className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"><Check className="h-4 w-4" /></button>
                                        <button onClick={() => setIsCreating(false)} className="bg-slate-100 text-slate-500 p-1.5 rounded hover:bg-slate-200"><X className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            )}

                            {/* Lista de Grupos */}
                            {groups.map((group) => (
                                <div key={group.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-24 animate-in zoom-in duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-sm", group.color)}>
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <MoreVerticalDot />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700 text-sm group-hover:text-blue-700">{group.name}</div>
                                        <div className="text-[10px] text-slate-400">{group.members} miembros</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 2: GESTIÓN DE MIEMBROS (INTERACTIVO) */}
                <TutorialCard
                    step="02"
                    title="Gestión de Talento"
                    description="Añade colegas a tus grupos fácilmente. Simula enviar una invitación y ve cómo crece el equipo."
                >
                    <div className="p-6 bg-slate-50 h-full min-h-[250px] flex items-center justify-center">
                        <div className="w-full max-w-xs bg-white rounded-xl shadow-lg border border-slate-200 p-5">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Proyecto Alpha</h3>
                                    <p className="text-xs text-slate-500">Grupo Privado</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-semibold text-slate-600">Miembros del equipo</label>
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{members.length} activos</span>
                                </div>

                                {/* Avatar Stack Interactivo */}
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                                        {members.map((m) => (
                                            <div key={m.id} className={cn("h-9 w-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer animate-in fade-in zoom-in duration-300", m.color)}>
                                                {m.init}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={handleAddMember}
                                        disabled={isInviting}
                                        className="h-9 w-9 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all ml-1"
                                    >
                                        {isInviting ? <span className="animate-spin text-xs">C</span> : <Plus className="h-4 w-4" />}
                                    </button>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2 text-[10px] text-blue-700">
                                    <Users className="h-3 w-3 mt-0.5 shrink-0" />
                                    <p>Los nuevos miembros tendrán acceso automático a la carpeta compartida.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: SEMÁFORO DE PERMISOS (INTERACTIVO) */}
                <TutorialCard
                    step="03"
                    title="Permisos Inteligentes"
                    description="Controla quién ve qué. Alterna entre los modos de privacidad para entender cómo afecta la visibilidad de tus recursos."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[300px] flex flex-col items-center justify-center">

                        {/* Toggle Switch */}
                        <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex mb-8">
                            <button
                                onClick={() => setPermission('public')}
                                className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2", permission === 'public' ? "bg-emerald-100 text-emerald-700 shadow-sm" : "text-slate-500 hover:bg-slate-50")}
                            >
                                <Globe className="h-3 w-3" /> Global
                            </button>
                            <button
                                onClick={() => setPermission('group')}
                                className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2", permission === 'group' ? "bg-indigo-100 text-indigo-700 shadow-sm" : "text-slate-500 hover:bg-slate-50")}
                            >
                                <Users className="h-3 w-3" /> Grupos
                            </button>
                            <button
                                onClick={() => setPermission('private')}
                                className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2", permission === 'private' ? "bg-amber-100 text-amber-700 shadow-sm" : "text-slate-500 hover:bg-slate-50")}
                            >
                                <Lock className="h-3 w-3" /> Privado
                            </button>
                        </div>

                        {/* Visual Feedback Card */}
                        <div className="w-full max-w-[280px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative transition-all duration-500">

                            {/* Status Banner */}
                            <div className={cn(
                                "h-2 w-full transition-colors duration-500",
                                permission === 'public' ? "bg-emerald-500" : (permission === 'group' ? "bg-indigo-500" : "bg-amber-500")
                            )} />

                            <div className="p-5 text-center space-y-4">
                                <div className={cn(
                                    "mx-auto h-14 w-14 rounded-full flex items-center justify-center transition-colors duration-500 bg-opacity-20",
                                    permission === 'public' ? "bg-emerald-100 text-emerald-600" : (permission === 'group' ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600")
                                )}>
                                    {permission === 'public' && <Globe className="h-7 w-7 animate-in zoom-in duration-300" />}
                                    {permission === 'group' && <Users className="h-7 w-7 animate-in zoom-in duration-300" />}
                                    {permission === 'private' && <Lock className="h-7 w-7 animate-in zoom-in duration-300" />}
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 transition-all">
                                        {permission === 'public' ? "Visible para Todos" : (permission === 'group' ? "Solo Miembros" : "Solo Tú")}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 h-8 px-2 leading-tight">
                                        {permission === 'public' && "Cualquier usuario de la organización puede ver y descargar este recurso."}
                                        {permission === 'group' && "Solo los integrantes de los grupos seleccionados tendrán acceso."}
                                        {permission === 'private' && "Nadie más puede ver esto. Es tu archivo personal seguro."}
                                    </p>
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
                        <Link href="/docs/tutorial/resources">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            5. Gestión de Recursos
                        </Link>
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-sm text-slate-500 mb-1">Siguiente Módulo</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white px-8">
                        <Link href="/docs/tutorial/tools">
                            7. Mis Herramientas
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    )
}

function MoreVerticalDot() {
    return (
        <div className="flex flex-col gap-[2px] p-1 cursor-pointer opacity-50 hover:opacity-100">
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
        </div>
    )
}