// ARCHIVO: src/app/dashboard/groups/[id]/page.tsx

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link" 
import { 
  ArrowLeft, Calendar, ShieldCheck, Users, Briefcase, 
  Mail, LayoutGrid, Info, CheckCircle2, ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Profile } from "@/types" 

// ✅ UTILIDAD ROBUSTA DE INICIALES (MANTENIDA)
function getInitials(name: string) {
  return name
    .match(/(\b\S)?/g)
    ?.join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toUpperCase() || "U"
}

interface Props {
  params: Promise<{ id: string }>
}

// ✅ TIPOS BASADOS EN TU SCHEMA (MANTENIDOS)
interface GroupMemberRaw {
    role: 'admin' | 'member';
    profiles: Profile;
}

interface GroupDetailData {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    group_members: GroupMemberRaw[];
}

export default async function GroupDetailPage(props: Props) {
  // 1. Manejo de params
  const params = await props.params
  const groupId = params.id
  
  // 2. Cliente Supabase
  const supabase = await createClient()

  // 3. CONSULTA STRICTA (LOGICA MANTENIDA)
  const { data: rawGroup, error } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      description,
      created_at,
      group_members (
        role,
        profiles (
            id,
            full_name,
            email,
            avatar_url
        )
      )
    `)
    .eq('id', groupId)
    .single()

  // 4. VALIDACIÓN DE ERRORES
  if (error || !rawGroup) {
    console.error("❌ Error DB cargando grupo:", error)
    notFound() 
  }

  // Casting seguro y preparación de datos
  const group = rawGroup as unknown as GroupDetailData
  const members = group.group_members || []
  const admins = members.filter(m => m.role === 'admin')
  const totalMembers = members.length

  // Formato de fecha
  const date = new Date(group.created_at).toLocaleDateString('es-CL', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })

  // Estilos visuales
  const IconComponent = Briefcase 

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">

      {/* --- FONDO ESPECTACULAR (AURORA MESH) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* Blob Superior Izquierdo (Azul/Cyan) */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-indigo-500/10 blur-[130px]" />
          
          {/* Blob Inferior Derecho (Violeta/Azul) */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-violet-500/10 via-blue-400/10 to-indigo-400/10 blur-[120px]" />
          
          {/* Ruido Sutil */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- HEADER ESPECTACULAR --- */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl ring-1 ring-white/10 mb-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
            {/* Fondo del Header */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/40 to-cyan-600/30 blur-3xl -translate-y-1/2 translate-x-1/3`}></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
                {/* Icono Flotante */}
                <div className={`
                    w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shrink-0 
                    bg-gradient-to-br from-blue-700 to-indigo-900 border border-white/10 shadow-2xl
                    group transition-transform duration-500 hover:scale-105 hover:rotate-2
                `}>
                    <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-3 delay-100">
                        <Badge className="bg-blue-600 hover:bg-blue-500 text-white border-0 px-3 py-1 text-xs uppercase tracking-widest font-bold shadow-lg shadow-blue-900/20">
                           Equipo Activo
                        </Badge>
                        <Badge variant="outline" className="text-slate-300 border-white/10 backdrop-blur-sm pl-2 pr-3">
                            <Users className="w-3 h-3 mr-2 text-cyan-400" />
                            {totalMembers} {totalMembers === 1 ? 'Miembro' : 'Miembros'}
                        </Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 animate-in fade-in slide-in-from-bottom-4 delay-200">
                        {group.name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-slate-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-5 delay-300">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>Creado el {date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-emerald-400" />
                             <span>Gestionado por IPG</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
            {/* COLUMNA IZQUIERDA (8 cols) - INFORMACIÓN */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* TARJETA DE DESCRIPCIÓN */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-slate-200/50 ring-1 ring-slate-200/50 min-h-[300px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Sobre este equipo</h2>
                    </div>
                    
                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                        <p className="whitespace-pre-line">
                            {group.description || "Este grupo no tiene una descripción detallada asignada por los administradores."}
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100/50 flex gap-4">
                        <div className="flex -space-x-2 overflow-hidden">
                             {/* Mini avatares decorativos de los primeros 5 miembros */}
                             {members.slice(0, 5).map((m, i) => (
                                <Avatar key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                                    <AvatarImage src={m.profiles?.avatar_url || ""} />
                                    <AvatarFallback className="bg-slate-200 text-[10px]">{getInitials(m.profiles?.full_name || "U")}</AvatarFallback>
                                </Avatar>
                             ))}
                        </div>
                        <span className="text-sm text-slate-500 font-medium self-center">
                            {totalMembers > 5 ? `+${totalMembers - 5} miembros más` : 'forman parte de este equipo.'}
                        </span>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA (4 cols) - SIDEBAR STICKY */}
            <div className="lg:col-span-4 space-y-6">
                 
                 <div className="sticky top-6 space-y-6">

                    {/* LISTA DE MIEMBROS (SCROLLABLE) */}
                    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-md ring-1 ring-slate-200/50 flex flex-col max-h-[500px]">
                        <CardHeader className="pb-3 border-b border-slate-100/50 bg-slate-50/30">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                                <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Miembros</span>
                                <Badge variant="secondary" className="bg-white shadow-sm">{totalMembers}</Badge>
                            </CardTitle>
                        </CardHeader>
                        
                        <div className="overflow-y-auto pr-1 custom-scrollbar flex-1 p-2">
                             {members.map((member, idx) => (
                                <div key={`member-${idx}`} className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white hover:shadow-md mb-1 border border-transparent hover:border-slate-100">
                                    <Avatar className="h-8 w-8 border border-slate-100">
                                        <AvatarImage src={member.profiles?.avatar_url || ""} />
                                        <AvatarFallback className="bg-slate-100 text-slate-500 text-xs font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                            {getInitials(member.profiles?.full_name || "U")}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                                                {member.profiles?.full_name || "Usuario"}
                                            </p>
                                            {member.role === 'admin' && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold uppercase">Admin</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-500">
                                            <span className="truncate">{member.profiles?.email}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                                </div>
                             ))}

                             {members.length === 0 && (
                                <div className="p-8 text-center">
                                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">No hay miembros aún.</p>
                                </div>
                             )}
                        </div>
                    </Card>

                 </div>
            </div>

        </div>
      </div>
    </div>
  )
}