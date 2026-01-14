'use client'

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  Trash2, RotateCcw, FileText, Link2, FileSpreadsheet,
  Image as ImageIcon, Search, CalendarClock, MoreVertical,
  HardDrive, UserX, FolderOpen, AlertCircle, SearchX
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

import { restoreResource, deletePermanently } from "@/actions/resources"
import { Resource } from "@/types"

// TIPO DEFINIDO
export type TrashedResource = Omit<Resource, 'deleted_at'> & { 
  deleted_at: string
  file_size?: number
  deleted_by_id?: string | null
  deleted_by_name?: string | null
}

// --- ESTILOS VISUALES DEL SISTEMA IPG ---
const getFileIcon = (type: string, fileName: string = '') => {
  const props = { className: "w-5 h-5" }
  if (type === 'link') return <Link2 {...props} />
  if (fileName?.endsWith('.xlsx') || fileName?.endsWith('.csv')) return <FileSpreadsheet {...props} />
  if (type?.includes('image') || fileName?.match(/\.(jpg|jpeg|png|gif)$/i)) return <ImageIcon {...props} />
  return <FileText {...props} />
}

const getIconBackground = (type: string) => {
  if (type === 'link') return 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
  if (type?.includes('image')) return 'bg-purple-50 text-purple-600 ring-1 ring-purple-100'
  return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
}

const formatBytes = (bytes: number = 0) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function TrashClient({ initialResources, currentUserId }: { initialResources: TrashedResource[], currentUserId: string }) {
  const [resources, setResources] = useState<TrashedResource[]>(initialResources)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRestore = async (id: string) => {
    setLoadingId(id)
    try {
      const res = await restoreResource(id)
      if (res.success) {
        toast.success("Recurso restaurado y disponible")
        setResources(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Error de conexión al restaurar")
    }
    setLoadingId(null)
  }

  const handleDeletePermanent = async (id: string) => {
    if (!window.confirm("⚠️ ¿Eliminar definitivamente?\n\nEsta acción no se puede deshacer y perderás el archivo para siempre.")) return;
    
    setLoadingId(id)
    try {
      const res = await deletePermanently(id)
      if (res.success) {
        toast.success("Eliminado del sistema permanentemente")
        setResources(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error("Error al intentar eliminar")
    }
    setLoadingId(null)
  }

  // --- RENDERIZADO INTELIGENTE DE USUARIO ---
  const renderDeletedBy = (userId?: string | null, userName?: string | null) => {
      if (userId === currentUserId) {
          return <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px] border border-indigo-100">Tú</span>;
      }
      if (userName) {
           return <span className="text-slate-700 font-medium truncate max-w-[140px]">{userName}</span>;
      }
      if (userId) {
          return (
            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
               ID: {userId.slice(0, 4)}...
            </span>
          );
      }
      return <span className="text-slate-400 italic text-[11px]">Desconocido</span>;
  }

  // --- EMPTY STATE GLOBAL (Sin nada en papelera) ---
  if (resources.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="bg-slate-50 p-6 rounded-full shadow-inner mb-4 ring-1 ring-slate-100">
            <Trash2 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Papelera limpia</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
          No hay elementos eliminados recientemente. Todo está en orden.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      {/* BARRA SUPERIOR FLOTANTE ESTILO GLASS */}
      <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-white/40 shadow-sm ring-1 ring-slate-200/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
                placeholder="Buscar en papelera..." 
                className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50 transition-all rounded-xl h-10 text-sm shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        {/* LADO DERECHO: INFO 30 DÍAS + CONTADOR */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end px-1">
            {/* AVISO EXPLICITO 30 DÍAS */}
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100/50 shadow-sm">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-[11px] font-medium whitespace-nowrap">
                   Se eliminan en 30 días
                </span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />

            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                {filteredResources.length} archivos
            </span>
        </div>
      </div>

      <div className="w-full">
        {/* --- EMPTY STATE DE BÚSQUEDA --- */}
        {filteredResources.length === 0 && searchTerm !== '' ? (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
            >
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <SearchX className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-600 font-medium">
                    No hay resultados para <span className="text-indigo-600 font-bold">{searchTerm}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">Intenta con otro término.</p>
            </motion.div>
        ) : (
            /* --- LISTA DE RESULTADOS --- */
            <AnimatePresence mode='popLayout'>
                <div className="grid grid-cols-1 gap-3">
                {filteredResources.map((resource) => (
                    <motion.div
                    layout
                    key={resource.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                    >
                    {/* --- DESKTOP VIEW --- */}
                    <div className="hidden lg:grid grid-cols-12 items-center p-4 gap-6">
                        
                        {/* 1. Icono e Info Principal */}
                        <div className="col-span-5 flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 transition-transform group-hover:scale-105 duration-300 ${getIconBackground(resource.file_type || 'file')}`}>
                            {getFileIcon(resource.file_type || 'file', resource.title)}
                            </div>
                            <div className="min-w-0 flex flex-col gap-0.5">
                                <h4 className="font-semibold text-slate-900 truncate text-sm group-hover:text-indigo-600 transition-colors">
                                    {resource.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        {resource.category || 'General'}
                                    </span>
                                    {resource.folder_id && (
                                        <span className="flex items-center text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                            <FolderOpen className="w-3 h-3 mr-1" /> Carpeta
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Metadatos (Fecha y Usuario) */}
                        <div className="col-span-4 flex flex-col justify-center border-l border-slate-50 pl-6 h-full space-y-2">
                            <div className="flex items-center gap-2" title={`Eliminado el: ${format(new Date(resource.deleted_at), "dd MMM yyyy, HH:mm", { locale: es })}`}>
                                <div className="bg-red-50 text-red-500 p-1 rounded-md">
                                    <CalendarClock className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-slate-600">
                                    {formatDistanceToNow(new Date(resource.deleted_at), { addSuffix: true, locale: es })}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs">
                                <div className="bg-slate-100 text-slate-500 p-1 rounded-md">
                                    <UserX className="w-3.5 h-3.5" />
                                </div>
                                {renderDeletedBy(resource.deleted_by_id, resource.deleted_by_name)}
                            </div>
                        </div>

                        {/* 3. Acciones y Peso */}
                        <div className="col-span-3 flex items-center justify-end gap-4 pl-4">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-auto">
                                <HardDrive className="w-3.5 h-3.5" />
                                {formatBytes(resource.file_size)}
                            </div>

                            {/* Botones con Tooltip */}
                            <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                onClick={() => handleRestore(resource.id)} 
                                                disabled={loadingId === resource.id}
                                                size="sm" 
                                                className="h-9 w-9 p-0 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-sm"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-emerald-600 border-emerald-700 text-white"><p>Restaurar archivo</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                onClick={() => handleDeletePermanent(resource.id)} 
                                                disabled={loadingId === resource.id}
                                                size="sm" 
                                                variant="ghost"
                                                className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-red-600 border-red-700 text-white"><p>Eliminar definitivamente</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>

                    {/* --- MOBILE VIEW --- */}
                    <div className="lg:hidden flex flex-col p-4 gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 overflow-hidden">
                                <div className={`p-2.5 rounded-lg shrink-0 border shadow-sm ${getIconBackground(resource.file_type || 'file')}`}>
                                    {getFileIcon(resource.file_type || 'file', resource.title)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-slate-900 truncate text-sm leading-tight">
                                        {resource.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            {resource.category || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2 text-slate-400 hover:bg-slate-50 rounded-full">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100 p-1">
                                <DropdownMenuItem onClick={() => handleRestore(resource.id)} className="rounded-lg focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer py-2.5">
                                    <RotateCcw className="w-4 h-4 mr-2 text-emerald-500" /> Restaurar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeletePermanent(resource.id)} className="rounded-lg focus:bg-red-50 focus:text-red-700 text-red-600 cursor-pointer py-2.5">
                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar Definitivo
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="bg-slate-50/80 rounded-xl p-3 flex flex-col gap-2 border border-slate-100">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 flex items-center gap-1.5">
                                    <CalendarClock className="w-3.5 h-3.5 text-red-400" />
                                    {formatDistanceToNow(new Date(resource.deleted_at), { addSuffix: true, locale: es })}
                                </span>
                                <span className="text-slate-400 flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" /> {formatBytes(resource.file_size)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-slate-200/50 mt-1">
                                <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                    <UserX className="w-3.5 h-3.5 text-slate-400" />
                                    {renderDeletedBy(resource.deleted_by_id, resource.deleted_by_name)}
                                </span>
                                <Button 
                                    onClick={() => handleRestore(resource.id)} 
                                    size="sm"
                                    className="h-7 text-[10px] px-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all"
                                >
                                    Restaurar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Indicador sutil de borde inferior */}
                    <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full lg:hidden" />
                    </motion.div>
                ))}
                </div>
            </AnimatePresence>
        )}
      </div>
    </div>
  )
}