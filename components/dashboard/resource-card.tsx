'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

// UI Components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileText, Globe, Youtube, Cloud, Layout, 
  CalendarDays, Copy, Heart, MoreVertical, Pencil, Trash2, Lock, Check,
  Share2
} from "lucide-react"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Utils
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { toggleFavorite } from "@/actions/resources"

// =====================================================================
// 1. DEFINICIÓN DE TIPOS
// =====================================================================

export interface ResourceProfile {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface ResourceShareRelation {
  user_id: string
  profiles: ResourceProfile | null 
}

export interface ResourceWithRelations {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
  updated_at: string
  created_by: string // ✅ AGREGADO: Necesario para identificar al creador
  
  file_type: string | null
  file_url: string | null
  file_path: string | null
  file_size: number | null
  
  is_favorite: boolean
  is_public: boolean
  is_shared_with_me?: boolean 

  folder_id: string | null
  tags: string[] | null
  
  // Datos Relacionales
  profiles: ResourceProfile | null 
  resource_shares: ResourceShareRelation[]
}

interface ResourceCardProps {
  resource: ResourceWithRelations 
  variant?: 'grid' | 'list'
  onEdit?: (resource: ResourceWithRelations) => void
  onDelete?: (resourceId: string) => void
}

// =====================================================================
// 2. HELPERS VISUALES (COMPONENTES PUROS)
// =====================================================================

/**
 * Muestra los avatares apilados de los usuarios con acceso.
 * Usa TooltipProvider para mostrar nombres al pasar el mouse.
 */
const SharedUsersPreview = ({ users }: { users: ResourceShareRelation[] }) => {
  // Filtrar usuarios válidos (que tengan perfil no nulo)
  const validProfiles = users
    .map(u => u.profiles)
    .filter((p): p is ResourceProfile => p !== null);

  if (validProfiles.length === 0) return null;

  const MAX_VISIBLE = 3;
  const displayUsers = validProfiles.slice(0, MAX_VISIBLE);
  const remaining = validProfiles.length - MAX_VISIBLE;

  return (
    <div className="flex items-center -space-x-2.5 hover:space-x-1 transition-all duration-300 ease-in-out pl-2">
      <TooltipProvider delayDuration={200}>
        {displayUsers.map((profile, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-white ring-1 ring-slate-100 bg-white transition-transform hover:z-20 hover:scale-110 cursor-help shadow-sm">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-[8px] bg-indigo-50 text-indigo-700 font-bold">
                  {(profile.full_name || profile.email || 'U').substring(0,1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-medium">{profile.full_name || profile.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remaining > 0 && (
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="h-6 w-6 rounded-full bg-slate-50 border-2 border-white ring-1 ring-slate-100 flex items-center justify-center text-[8px] text-slate-500 font-bold z-10 shadow-sm cursor-help hover:bg-slate-100">
                  +{remaining}
                </div>
             </TooltipTrigger>
             <TooltipContent>
               <p className="text-xs">Compartido con {remaining} personas más</p>
             </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

const GlobalBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-indigo-50 text-indigo-600 border-indigo-100 px-2 text-[10px] font-semibold select-none hover:bg-indigo-100 transition-colors">
    <Globe className="w-3 h-3" /> Global
  </Badge>
)

const SharedWithMeBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-orange-50 text-orange-600 border-orange-100 px-2 text-[10px] font-semibold select-none hover:bg-orange-100 transition-colors">
    <Share2 className="w-3 h-3" /> Compartido
  </Badge>
)

const PrivateBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-slate-50 text-slate-500 border-slate-100 px-2 text-[10px] font-semibold select-none">
    <Lock className="w-3 h-3" /> Privado
  </Badge>
)

// =====================================================================
// 3. COMPONENTE PRINCIPAL
// =====================================================================

export function ResourceCard({ resource, variant = 'grid', onEdit, onDelete }: ResourceCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isFavorite, setIsFavorite] = useState(resource.is_favorite)
  const [isDeleting, setIsDeleting] = useState(false)

  // -- SAFE DATA ACCESS --
  const sharedList = resource.resource_shares || [];
  const hasShares = sharedList.length > 0;
  const isLink = resource.file_type === 'link' || !resource.file_path;
  const targetUrl = resource.file_url || '#';

  // ---------------------------------------------------------------------------
  // 🕵️ ZONA DE LOGS DIAGNÓSTICO
  // ---------------------------------------------------------------------------
  // Solo logueamos si hay información relevante de "shares" para no saturar
  if (hasShares || resource.is_shared_with_me) {
     console.groupCollapsed(`🔍 [CARD DEBUG] ${resource.title}`);
     console.log(`🆔 Resource ID: ${resource.id}`);
     // ✅ CORREGIDO: Usamos created_by que ahora existe en el tipo
     console.log(`👤 Creator ID: ${resource.created_by}`); 
     console.log(`📬 Is Shared With Me: ${resource.is_shared_with_me}`);
     console.log(`📤 Shares Count (By Me): ${sharedList.length}`);
     if (hasShares) {
        console.table(sharedList.map(s => ({ 
            userId: s.user_id, 
            email: s.profiles?.email 
        })));
     }
     console.groupEnd();
  }
  // ---------------------------------------------------------------------------
  
  // Formatters
  const createdDate = new Date(resource.created_at)
  const formattedDate = !isNaN(createdDate.getTime()) 
    ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }).format(createdDate)
    : 'Fecha inválida';
  
  const authorName = resource.profiles?.full_name || 'Desconocido'
  const authorEmail = resource.profiles?.email || ''
  const authorInitials = (authorName || "U").substring(0, 2).toUpperCase()
  const authorAvatar = resource.profiles?.avatar_url

  // ✅ LÓGICA DE PRIORIDAD VISUAL
  // Determina qué indicador mostrar en la esquina inferior derecha
  const renderStatus = () => {
    // 1. Prioridad: Si me lo compartieron a mí (Badge Naranja)
    if (resource.is_shared_with_me) return <SharedWithMeBadge />
    
    // 2. Prioridad: Si YO soy el dueño y lo compartí con otros (Muestra las caritas)
    if (hasShares) return <SharedUsersPreview users={sharedList} />
    
    // 3. Prioridad: Si es público global (Badge Azul)
    if (resource.is_public) return <GlobalBadge />
    
    // 4. Fallback: Privado (Badge Gris)
    return <PrivateBadge />
  }

  // Handlers
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (typeof window !== "undefined") {
        const url = `${window.location.origin}/resources/${resource.id}`
        navigator.clipboard.writeText(url)
        setCopied(true); toast.success("Enlace copiado"); setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const newState = !isFavorite; setIsFavorite(newState)
    newState ? toast.success("Añadido a favoritos") : toast.info("Eliminado de favoritos")
    try { await toggleFavorite(resource.id) } catch { setIsFavorite(!newState) }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!onDelete) return
    setIsDeleting(true)
    try { await onDelete(resource.id) } catch { setIsDeleting(false); toast.error("Error al eliminar") }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (onEdit) onEdit(resource)
  }

  // Estilos de Iconos
  const getResourceStyle = () => {
    const url = (targetUrl || "").toLowerCase();
    if (isLink) {
      if (url.includes("youtube") || url.includes("youtu.be")) return { color: "#EF4444", icon: Youtube, label: "Video" }
      if (url.includes("drive.google") || url.includes("docs.google")) return { color: "#0F9D58", icon: Cloud, label: "Drive" }
      if (url.includes("figma") || url.includes("canva")) return { color: "#A259FF", icon: Layout, label: "Diseño" }
      return { color: "#64748B", icon: Globe, label: "Enlace" }
    }
    // Tipos de archivos comunes
    const ext = resource.file_path?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return { color: "#EA4335", icon: FileText, label: "PDF" }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return { color: "#16A34A", icon: FileText, label: "Excel" }
    
    return { color: "#3B82F6", icon: FileText, label: "Archivo" }
  }

  const style = getResourceStyle()
  const IconComponent = style.icon

  // =====================================================================
  // VISTA: LISTA (Compacta)
  // =====================================================================
  if (variant === 'list') {
    return (
      <div 
        onClick={() => router.push(`/resources/${resource.id}`)}
        className={cn(
          "group flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:border-blue-200 relative cursor-pointer",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        <div 
            className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
            style={{ backgroundColor: style.color }}
        >
            <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 grid gap-1">
           <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors" title={resource.title}>
                {resource.title}
              </h3>
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider h-5 px-1.5 border-slate-200 text-slate-500 shrink-0">
                {style.label}
              </Badge>
           </div>
           <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-500">{resource.category}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {formattedDate}</span>
          </div>
        </div>

        {/* Autor en lista */}
        <div className="hidden md:flex items-center gap-2 w-[180px] shrink-0 border-l border-slate-100 pl-4">
             <Avatar className="h-7 w-7 border border-slate-100">
                <AvatarImage src={authorAvatar || ""} />
                <AvatarFallback className="text-[9px] font-bold bg-slate-100 text-slate-600">{authorInitials}</AvatarFallback>
             </Avatar>
             <div className="flex flex-col overflow-hidden">
                 <span className="text-xs font-semibold text-slate-700 truncate">{authorName}</span>
                 <span className="text-[9px] text-slate-400 truncate">{authorEmail}</span>
             </div>
        </div>

        {/* Acciones e Indicadores */}
        <div className="flex items-center gap-1 shrink-0 ml-4">
            <div className="hidden sm:flex items-center justify-end mr-3 min-w-[80px]">
               {renderStatus()}
            </div>

            <Button size="icon" variant="ghost" className={cn("h-8 w-8 hover:bg-slate-50", isFavorite ? "text-red-500" : "text-slate-400")} onClick={handleToggleFavorite}>
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </Button>

            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={handleCopyLink} title="Copiar enlace">
                {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}><Pencil className="w-3.5 h-3.5 mr-2"/> Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600"><Trash2 className="w-3.5 h-3.5 mr-2"/> Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    )
  }

  // =====================================================================
  // VISTA: GRID (Tarjeta)
  // =====================================================================
  return (
    <Card className={cn(
      "flex flex-col h-full group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-visible relative cursor-pointer bg-white hover:-translate-y-1", 
      isDeleting && "opacity-50 pointer-events-none"
    )} onClick={() => router.push(`/resources/${resource.id}`)}>
      
      {/* Botón Favorito Flotante */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button 
            onClick={handleToggleFavorite}
            className={cn(
              "p-2 rounded-full bg-white/95 shadow-sm border transition-all backdrop-blur-sm hover:scale-105",
              isFavorite ? "border-red-100 text-red-500" : "border-slate-100 text-slate-400 hover:text-red-500"
            )}
         >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
         </button>
      </div>

      <CardHeader className="flex flex-row gap-4 pb-2 pt-5 px-5 items-start">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 group-hover:rotate-3 transition-transform duration-300"
            style={{ backgroundColor: style.color }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="overflow-hidden w-full space-y-1.5">
            <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight" title={resource.title}>
              {resource.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-slate-200 text-slate-500 h-5">
                {resource.category}
              </Badge>
              <span className="text-[10px] font-semibold opacity-90" style={{ color: style.color }}>
                {style.label}
              </span>
            </div>
          </div>
      </CardHeader>
      
      <CardContent className="flex-grow px-5 py-2 space-y-3 flex flex-col">
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-[40px] font-normal">
            {resource.description || "Sin descripción disponible."}
        </p>
        
        {/* ZONA DE ESTADO (Avatares vs Badges) */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 min-h-[36px]">
             <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                {formattedDate}
             </div>
             <div className="flex justify-end pl-2">
                {renderStatus()}
             </div>
        </div>
        
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {resource.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-medium">#{tag}</span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 pb-4 px-5 flex justify-between items-center mt-auto bg-slate-50/50 rounded-b-xl border-t border-slate-100">
        <div className="flex items-center gap-2 max-w-[50%]">
          <Avatar className="h-6 w-6 border border-slate-200">
            <AvatarImage src={authorAvatar || ""} />
            <AvatarFallback className="text-[8px] font-bold bg-white text-slate-600">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] font-semibold text-slate-700 truncate block">
               {authorName}
              </span>
          </div>
        </div>

        <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 px-0 text-slate-400 hover:text-slate-700" onClick={handleCopyLink} title="Copiar Link">
                 {copied ? <Check className="w-3.5 h-3.5 text-green-600"/> : <Copy className="w-3.5 h-3.5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 focus:ring-0">
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    <Pencil className="w-3.5 h-3.5 mr-2"/> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5 mr-2"/> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 gap-1.5 ml-1 transition-colors" asChild onClick={(e) => e.stopPropagation()}>
                {isLink ? 
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer">Visitar</a> : 
                  <a href={targetUrl} target="_blank" download>Bajar</a>
                }
            </Button>
        </div>
      </CardFooter>
    </Card>
  )
}