// ARCHIVO: components/dashboard/resource-card.tsx
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

// ✅ NUEVO IMPORT: El componente de Edición Profesional
import { EditResourceDialog } from "@/components/resources/edit-resource-card"

// ✅ UTILIDAD ROBUSTA
function getInitials(name: string) {
  return name
    .match(/(\b\S)?/g)
    ?.join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toUpperCase() || "U"
}

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
  created_by: string
  
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

export interface ResourceCardProps {
  resource: ResourceWithRelations 
  variant?: 'grid' | 'list'
  onEdit?: (resource: ResourceWithRelations) => void
  onDelete?: (resourceId: string) => Promise<void> | void
  onFavoriteToggle?: (resourceId: string, isNowFavorite: boolean) => void
}

// =====================================================================
// 2. HELPERS VISUALES
// =====================================================================

const SharedUsersPreview = ({ users }: { users: ResourceShareRelation[] }) => {
  const validProfiles = users.map(u => u.profiles).filter((p): p is ResourceProfile => p !== null);
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
                  {getInitials(profile.full_name || profile.email || 'U')}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent><p className="text-xs font-medium">{profile.full_name || profile.email}</p></TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Tooltip>
             <TooltipTrigger asChild>
                <div className="h-6 w-6 rounded-full bg-slate-50 border-2 border-white ring-1 ring-slate-100 flex items-center justify-center text-[8px] text-slate-500 font-bold z-10 shadow-sm cursor-help hover:bg-slate-100">+{remaining}</div>
             </TooltipTrigger>
             <TooltipContent><p className="text-xs">Compartido con {remaining} personas más</p></TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

const GlobalBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-indigo-50 text-indigo-600 border-indigo-100 px-2 text-[10px] font-semibold select-none hover:bg-indigo-100 transition-colors">
    <Globe className="w-3 h-3" /> <span className="hidden sm:inline">Global</span>
  </Badge>
)
const SharedWithMeBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-orange-50 text-orange-600 border-orange-100 px-2 text-[10px] font-semibold select-none hover:bg-orange-100 transition-colors">
    <Share2 className="w-3 h-3" /> <span className="hidden sm:inline">Compartido</span>
  </Badge>
)
const PrivateBadge = () => (
  <Badge variant="secondary" className="h-6 gap-1.5 bg-slate-50 text-slate-500 border-slate-100 px-2 text-[10px] font-semibold select-none">
    <Lock className="w-3 h-3" /> <span className="hidden sm:inline">Privado</span>
  </Badge>
)

// =====================================================================
// 3. COMPONENTE PRINCIPAL 
// =====================================================================

export function ResourceCard({ resource, variant = 'grid', onEdit, onDelete, onFavoriteToggle }: ResourceCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  // Sync de favoritos
  const [isFavorite, setIsFavorite] = useState(resource.is_favorite)
  const [prevIsFavorite, setPrevIsFavorite] = useState(resource.is_favorite)

  if (resource.is_favorite !== prevIsFavorite) {
    setPrevIsFavorite(resource.is_favorite)
    setIsFavorite(resource.is_favorite)
  }

  // Safe Access
  const sharedList = resource.resource_shares || [];
  const hasShares = sharedList.length > 0;
  const isLink = resource.file_type === 'link' || !resource.file_path;
  const targetUrl = resource.file_url || '#';

  const createdDate = new Date(resource.created_at)
  const formattedDate = !isNaN(createdDate.getTime()) 
    ? new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }).format(createdDate)
    : 'Fecha inválida';
  
  const authorName = resource.profiles?.full_name || 'Desconocido'
  const authorEmail = resource.profiles?.email || ''
  const authorInitials = getInitials(authorName || "U")
  const authorAvatar = resource.profiles?.avatar_url

  const renderStatus = () => {
    if (hasShares) return <SharedUsersPreview users={sharedList} />
    if (resource.is_shared_with_me) return <SharedWithMeBadge />
    if (resource.is_public) return <GlobalBadge />
    return <PrivateBadge />
  }

  // -------------------------------------------------------------------
  // HANDLERS ROBUSTOS
  // -------------------------------------------------------------------

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
    const newState = !isFavorite
    setIsFavorite(newState) 
    if (onFavoriteToggle) onFavoriteToggle(resource.id, newState)
    newState ? toast.success("Añadido a favoritos") : toast.info("Eliminado de favoritos")
    try { await toggleFavorite(resource.id) } catch (error) { 
      setIsFavorite(!newState) 
      if (onFavoriteToggle) onFavoriteToggle(resource.id, !newState) 
      toast.error("Error al actualizar favoritos")
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!onDelete) return
    
    setIsDeleting(true) 
    try { 
      await onDelete(resource.id) 
      setIsDeleted(true) 
      toast.success("Enviado a la papelera")
    } catch (error) { 
      console.error("Error deleting resource:", error)
      setIsDeleting(false) 
      toast.error("No se pudo enviar a la papelera") 
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation() 
    setIsEditOpen(true) 
  }

  const getResourceStyle = () => {
    const url = (targetUrl || "").toLowerCase();
    if (isLink) {
      if (url.includes("youtube") || url.includes("youtu.be")) return { color: "#EF4444", icon: Youtube, label: "Video" }
      if (url.includes("drive.google") || url.includes("docs.google")) return { color: "#0F9D58", icon: Cloud, label: "Drive" }
      if (url.includes("figma") || url.includes("canva")) return { color: "#A259FF", icon: Layout, label: "Diseño" }
      return { color: "#64748B", icon: Globe, label: "Enlace" }
    }
    const ext = resource.file_path?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return { color: "#EA4335", icon: FileText, label: "PDF" }
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return { color: "#16A34A", icon: FileText, label: "Excel" }
    return { color: "#3B82F6", icon: FileText, label: "Archivo" }
  }

  const style = getResourceStyle()
  const IconComponent = style.icon

  if (isDeleted) return null;

  const editResourceData = {
    id: resource.id,
    title: resource.title,
    description: resource.description || "", 
    category: resource.category,
    tags: resource.tags || [],
    file_url: resource.file_url || resource.file_path || "",
    is_public: resource.is_public
  };

  // =====================================================================
  // VISTA: LISTA (Intacta, tal como la pediste)
  // =====================================================================
  if (variant === 'list') {
    return (
      <>
        <div 
          onClick={() => router.push(`/resources/${resource.id}`)}
          className={cn(
            "group flex items-center gap-3 md:gap-4 bg-white border border-slate-200 rounded-lg p-2.5 md:p-3 hover:shadow-md transition-all duration-200 hover:border-blue-200 relative cursor-pointer min-w-0 w-full",
            isDeleting && "opacity-50 pointer-events-none select-none grayscale"
          )}
        >
          {/* Icono */}
          <div 
              className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: style.color }}
          >
              <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 grid gap-0.5 md:gap-1">
             <div className="flex items-center gap-2 pr-2 min-w-0">
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 break-words leading-tight group-hover:text-blue-600 transition-colors" title={resource.title}>
                  {resource.title}
                </h3>
                <Badge variant="outline" className="hidden sm:inline-flex text-[9px] uppercase tracking-wider h-5 px-1.5 border-slate-200 text-slate-500 shrink-0 self-start mt-0.5">
                  {style.label}
                </Badge>
             </div>
             <div className="flex items-center gap-2 md:gap-3 text-xs text-slate-400 truncate">
                <span className="flex items-center gap-1 font-medium text-slate-500 truncate">{resource.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                <span className="flex items-center gap-1 shrink-0"><CalendarDays className="w-3 h-3" /> {formattedDate}</span>
            </div>
          </div>

          {/* Autor */}
          <div className="hidden lg:flex items-center gap-2 w-[160px] xl:w-[180px] shrink-0 border-l border-slate-100 pl-4">
                <Avatar className="h-7 w-7 border border-slate-100">
                  <AvatarImage src={authorAvatar || ""} />
                  <AvatarFallback className="text-[9px] font-bold bg-slate-100 text-slate-600">{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-slate-700 truncate">{authorName}</span>
                    <span className="text-[9px] text-slate-400 truncate">{authorEmail}</span>
                </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-0.5 md:gap-1 shrink-0 ml-1 md:ml-4">
              <div className="hidden xl:flex items-center justify-end mr-3 min-w-[80px]">
                 {renderStatus()}
              </div>

              <Button size="icon" variant="ghost" className={cn("h-8 w-8 hover:bg-slate-50", isFavorite ? "text-red-500" : "text-slate-400")} onClick={handleToggleFavorite}>
                  <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </Button>

              <Button size="icon" variant="ghost" className="hidden sm:inline-flex h-8 w-8 text-slate-400 hover:text-slate-600" onClick={handleCopyLink} title="Copiar enlace">
                  {copied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                      <Pencil className="w-3.5 h-3.5 mr-2"/> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { handleCopyLink(e); }} className="sm:hidden cursor-pointer">
                      <Copy className="w-3.5 h-3.5 mr-2"/> Copiar enlace
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5 mr-2"/> Enviar a la papelera
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>

        <EditResourceDialog 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          resource={editResourceData} 
        />
      </>
    )
  }

  // =====================================================================
  // VISTA: GRID (Corregida responsividad y hover de favoritos)
  // =====================================================================
  return (
    <>
      <Card className={cn(
        "flex flex-col h-full group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-visible relative cursor-pointer bg-white hover:-translate-y-1", 
        isDeleting && "opacity-50 pointer-events-none select-none grayscale"
      )} 
      onClick={() => router.push(`/resources/${resource.id}`)}
      >
        
        {/* ✅ AJUSTE: Botón de favoritos siempre visible, se eliminó opacity-0 */}
        <div className="absolute top-3 right-3 z-10 transition-opacity duration-300">
           <button 
             onClick={handleToggleFavorite}
             className={cn(
               "p-2 rounded-full bg-white/95 shadow-sm border transition-all backdrop-blur-sm hover:scale-105",
               isFavorite ? "border-red-100 text-red-500" : "border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100"
             )}
           >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
           </button>
        </div>

        {/* ✅ AJUSTE: shrink-0 añadido para proteger la cabecera en pantallas con zoom */}
        <CardHeader className="flex flex-row gap-4 pb-2 pt-5 px-5 items-start shrink-0">
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
        
        {/* ✅ AJUSTE: Removidos los altos estáticos (h-[40px]), agrupados los elementos bottom para proteger el flex */}
        <CardContent className="flex-grow px-5 py-2 flex flex-col gap-3 min-h-0">
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {resource.description || "Sin descripción disponible."}
          </p>
          
          <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-slate-50">
              <div className="flex items-center justify-between min-h-[28px]">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                       <CalendarDays className="w-3.5 h-3.5" />
                       {formattedDate}
                    </div>
                    <div className="flex justify-end pl-2">
                       {renderStatus()}
                    </div>
              </div>
              
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 font-medium truncate max-w-full">#{tag}</span>
                  ))}
                </div>
              )}
          </div>
        </CardContent>

        {/* ✅ AJUSTE: shrink-0 añadido, se eliminó mt-auto redundante para proteger el footer */}
        <CardFooter className="pt-3 pb-4 px-5 flex justify-between items-center bg-slate-50/50 rounded-b-xl border-t border-slate-100 shrink-0">
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

          <div className="flex items-center gap-1 shrink-0">
              <Button size="sm" variant="ghost" className="h-7 w-7 px-0 text-slate-400 hover:text-slate-700 shrink-0" onClick={handleCopyLink} title="Copiar Link">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600"/> : <Copy className="w-3.5 h-3.5" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 focus:ring-0 shrink-0">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                      <Pencil className="w-3.5 h-3.5 mr-2"/> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5 mr-2"/> Papelera
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 gap-1.5 ml-1 transition-colors shrink-0" asChild onClick={(e) => e.stopPropagation()}>
                  {isLink ? 
                    <a href={targetUrl} target="_blank" rel="noopener noreferrer">Visitar</a> : 
                    <a href={targetUrl} target="_blank" download>Descargar</a>
                  }
              </Button>
          </div>
        </CardFooter>
      </Card>

      <EditResourceDialog 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        resource={editResourceData}
      />
    </>
  )
}