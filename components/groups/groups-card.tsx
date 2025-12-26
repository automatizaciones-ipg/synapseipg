'use client'

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, Briefcase, MoreVertical, ArrowRight, ShieldCheck, Clock, 
  Pencil, Trash2 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
// Importamos los tipos correctamente exportados
import { GroupData, GroupMember } from "@/actions/groups" 

const COLORS = {
  primary: '#1f64fc', 
  navy: '#0d2457',
  slate: '#64748B',
  admin_bg: '#1f64fc',
  member_bg: '#64748B'
}

interface GroupCardProps {
  group: GroupData
  onEdit: (group: GroupData) => void
  onDelete: (group: GroupData) => void
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  const isAdmin = group.role === 'admin'
  
  const style = isAdmin 
    ? { color: COLORS.admin_bg, icon: Briefcase, label: "Admin" }
    : { color: COLORS.member_bg, icon: Users, label: "Miembro" }

  const IconComponent = style.icon
  
  const formattedDate = new Date(group.created_at).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  // ✅ TIPADO ESTRICTO AQUÍ: 'members' puede ser undefined, default a array vacío
  const membersList: GroupMember[] = group.members || []
  const displayedMembers = membersList.slice(0, 3)
  const extraCount = (group.member_count || 0) - 3

  return (
    <Card className="flex flex-col h-full group hover:shadow-lg transition-all duration-200 border-slate-200 overflow-hidden relative bg-white hover:border-[#2b7fff]/50">
      
      {/* --- MENU FLOTANTE DE ACCIONES --- */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-white/90 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-[#1f64fc]/30 hover:text-[#1f64fc] focus:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl">
               <DropdownMenuItem 
                  onClick={() => onEdit(group)}
                  className="gap-2 text-slate-700 focus:text-[#1f64fc] focus:bg-[#1f64fc]/5 cursor-pointer font-medium py-2.5"
               >
                  <Pencil className="w-4 h-4" /> Editar Grupo
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-slate-100"/>
               <DropdownMenuItem 
                  onClick={() => onDelete(group)}
                  className="gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium py-2.5"
               >
                  <Trash2 className="w-4 h-4" /> Eliminar
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* --- ENLACE PRINCIPAL --- */}
      <Link href={`/groups/${group.id}`} className="contents" prefetch={false}>
        <CardHeader className="flex flex-row gap-4 pb-2 pt-5 px-5 items-start cursor-pointer relative">
          
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform" 
            style={{ backgroundColor: style.color }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="overflow-hidden w-full space-y-1 pr-6">
            <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-[#1f64fc] transition-colors" title={group.name}>
              {group.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium border-slate-200 text-slate-500">
                {style.label}
              </Badge>
              {isAdmin && (
                <span className="flex items-center text-[9px] text-[#1f64fc] bg-[#1f64fc]/10 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Tu Grupo
                </span>
              )}
            </div>
          </div>
        </CardHeader>
      </Link>
      
      <CardContent className="flex-grow px-5 py-2">
         <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3 h-[40px]">
           {group.description || "Sin descripción definida para este equipo."}
         </p>
         
         <div className="flex flex-wrap gap-1.5 mt-auto">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
               <Users className="w-3 h-3" /> {group.member_count} miembros
            </span>
         </div>
      </CardContent>

      <div className="w-[90%] h-[1px] bg-slate-100 mx-auto" />
      
      <CardFooter className="pt-2 pb-3 px-4 flex flex-col gap-2 mt-auto bg-white">
        <div className="flex justify-between items-center w-full">
           <div className="flex items-center gap-2.5 max-w-[100%]">
             <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                <Clock className="w-4 h-4" />
             </div>
             <div className="flex flex-col min-w-0 leading-tight">
                 <span className="text-xs font-semibold text-slate-700 truncate">Creado el</span>
                 <span className="text-[10px] text-slate-400 truncate">{formattedDate}</span>
             </div>
           </div>
        </div>

        <div className="flex justify-between items-center w-full border-t border-slate-50 pt-2">
           <div className="flex -space-x-2 shrink-0 h-6">
             {/* ✅ TIPADO ESTRICTO EN EL MAP: 'member' ahora es GroupMember */}
             {displayedMembers.map((member, idx) => (
                <Avatar key={idx} className="h-6 w-6 border-2 border-white ring-1 ring-slate-100" title={member.email}>
                    <AvatarImage src={member.avatar_url || ""} />
                    <AvatarFallback className="text-[8px] bg-[#1f64fc]/10 text-[#1f64fc] font-bold">
                      {(member.email || "U").substring(0,1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
             ))}
             {extraCount > 0 && (
                <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] text-slate-500 font-bold ring-1 ring-slate-100">
                  +{extraCount}
                </div>
             )}
           </div>

           <div className="flex gap-2">
             <Button 
               size="sm" 
               variant="outline" 
               className="h-7 px-3 text-xs border-slate-200 text-[#0d2457] hover:border-[#1f64fc] hover:text-[#1f64fc] hover:bg-[#1f64fc]/5 gap-1.5 font-medium transition-colors" 
               asChild
             >
               <Link href={`/groups/${group.id}`} prefetch={false}>
                 Entrar <ArrowRight className="w-3 h-3"/>
               </Link>
             </Button>
           </div>
        </div>
      </CardFooter>
    </Card>
  )
}