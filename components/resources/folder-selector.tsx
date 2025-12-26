'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Folder, FolderOpen, ChevronRight, Plus, ChevronLeft, Loader2, Home, 
  Globe, Megaphone, FolderTree, Building2, Users, GraduationCap, Wallet, Rocket, LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
// Asegúrate de que estas rutas sean correctas en tu proyecto
import { createFolder, getFolders } from '@/actions/folders' 

// --- Tipos Locales ---
interface FolderRow {
    id: string
    name: string
    parent_id: string | null
    category: string | null
    created_at?: string
}

interface VirtualRoot {
  id: string
  name: string
  category: string
  icon: LucideIcon
}

interface NavItem {
  id: string
  name: string
  category: string
  is_virtual: boolean
}

interface FolderSelectorProps {
  // Callback robusto: Devuelve ID, Nombre y la Categoría obligatoria
  onSelect: (folderId: string | null, folderName: string, category: string) => void
  currentFolderId: string | null
  currentCategory: string
  isAdmin: boolean
}

// --- Constantes ---
const SYSTEM_ROOTS: VirtualRoot[] = [
  { id: 'root-global', name: 'Globales', category: 'Globales', icon: Globe },
  { id: 'root-comms', name: 'Comunicaciones', category: 'Comunicaciones', icon: Megaphone },
  { id: 'root-adm', name: 'Admisión', category: 'Admisión', icon: FolderTree },
  { id: 'root-sec', name: 'Secretaría General', category: 'Secretaría General', icon: Building2 },
  { id: 'root-rrhh', name: 'Gestión de Personas', category: 'Gestión de Personas', icon: Users },
  { id: 'root-acad', name: 'Asuntos Académicos', category: 'Asuntos Académicos', icon: GraduationCap },
  { id: 'root-eco', name: 'Asuntos Económicos', category: 'Asuntos Económicos', icon: Wallet },
  { id: 'root-dev', name: 'Desarrollo', category: 'Desarrollo', icon: Rocket },
]

export function FolderSelector({ onSelect, currentFolderId, currentCategory, isAdmin }: FolderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [path, setPath] = useState<NavItem[]>([]) 
  const [folders, setFolders] = useState<FolderRow[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estados de creación
  const [isCreating, setIsCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedInModal, setSelectedInModal] = useState<string | null>(null)

  // 1. Determinar contexto actual (Padre y Categoría)
  const getContext = useCallback(() => {
    const last = path[path.length - 1]
    if (!last) return { parentId: null, category: null, isRoot: true }
    
    // Si es virtual, filtramos por su categoría
    if (last.is_virtual) return { parentId: null, category: last.category, isRoot: false }
    
    // Si es real, filtramos por su ID (la categoría se hereda visualmente)
    return { parentId: last.id, category: last.category, isRoot: false }
  }, [path])

  // 2. Cargar carpetas
  const loadData = useCallback(async () => {
    // Si estamos en la raíz absoluta (sin path), no cargamos nada (mostramos las raíces virtuales)
    if (path.length === 0) {
      setFolders([])
      return
    }

    setLoading(true)
    const ctx = getContext()

    try {
      console.log('📂 [FolderSelector] Fetching:', ctx)
      // Ajuste para tu server action: getFolders(parentId, isGlobal, category)
      const res = await getFolders(ctx.parentId, true, ctx.category || undefined)
      
      if (res.success && Array.isArray(res.data)) {
        setFolders(res.data as FolderRow[])
      } else {
        setFolders([])
      }
    } catch (error) {
      console.error('❌ Error loading folders:', error)
      toast.error("Error cargando estructura")
    } finally {
      setLoading(false)
    }
  }, [path, getContext])

  useEffect(() => { if (isOpen) loadData() }, [isOpen, loadData])

  // 3. Crear Carpeta Nueva
  const handleCreate = async () => {
    if (!newFolderName.trim()) return
    const ctx = getContext()
    
    if (ctx.isRoot) {
      toast.error("Selecciona primero una categoría raíz")
      return
    }

    // Fallback de seguridad: si no hay categoría, usamos Globales
    const categoryToSave = ctx.category || 'Globales'

    try {
        console.log('✨ [FolderSelector] Creando:', { name: newFolderName, parent: ctx.parentId, category: categoryToSave })
        const res = await createFolder(newFolderName, ctx.parentId, true, categoryToSave)
        
        if (res.success) {
            toast.success("Carpeta creada correctamente")
            setNewFolderName("")
            setIsCreating(false)
            loadData()
        } else {
            toast.error(res.message || "Error al crear carpeta")
        }
    } catch (e) {
        console.error(e)
        toast.error("Error de conexión al crear")
    }
  }

  // 4. Confirmar Selección (Lógica CRÍTICA)
  const handleConfirm = () => {
    // CASO A: Selección explícita de una sub-carpeta en la lista
    if (selectedInModal) {
      const folder = folders.find(f => f.id === selectedInModal)
      if (folder) {
        console.log('✅ [Selector] Seleccionada sub-carpeta:', folder.name)
        onSelect(folder.id, folder.name, folder.category || 'Globales')
        setIsOpen(false)
        return
      }
    }

    // CASO B: Guardar en la ubicación actual del path
    if (path.length > 0) {
      const current = path[path.length - 1]
      
      if (current.is_virtual) {
        // Es una raíz (ej. "Comunicaciones")
        console.log('✅ [Selector] Seleccionada Raíz Virtual:', current.name)
        onSelect(null, `${current.name} (Raíz)`, current.category)
      } else {
        // Es una carpeta abierta donde estamos navegando
        console.log('✅ [Selector] Guardando en carpeta actual:', current.name)
        onSelect(current.id, current.name, current.category)
      }
      setIsOpen(false)
      return
    }

    toast.error("Por favor selecciona una ubicación válida")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-slate-700 font-normal border-dashed border-slate-300 hover:border-blue-400 bg-white group transition-all">
           <span className="flex items-center gap-2 truncate">
             {currentFolderId ? <FolderOpen className="w-4 h-4 text-blue-600 group-hover:text-blue-500" /> : <Globe className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />}
             <span className="truncate">
                {currentFolderId ? "Carpeta Seleccionada" : `${currentCategory} (Raíz)`}
             </span>
           </span>
           <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 group-hover:bg-blue-100 transition-colors">Cambiar</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md h-[550px] flex flex-col p-0 gap-0 bg-white shadow-2xl overflow-hidden">
        <DialogHeader className="p-4 border-b shrink-0 bg-white z-10">
          <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-blue-600" />
            Seleccionar Ubicación
          </DialogTitle>
        </DialogHeader>

        {/* NAVEGACIÓN (Breadcrumbs) */}
        <div className="bg-slate-50 px-3 py-2 border-b overflow-x-auto whitespace-nowrap shrink-0 shadow-inner">
            <div className="flex items-center gap-1 text-sm">
                 <button 
                    onClick={() => { setPath([]); setSelectedInModal(null); }} 
                    className="px-2 py-1 hover:bg-white rounded flex items-center gap-1 text-slate-500 font-bold text-xs uppercase tracking-wide border border-transparent hover:border-slate-200 transition-all"
                 >
                    <Home className="w-3.5 h-3.5" /> ORG
                 </button>
                 {path.map((item, idx) => (
                    <div key={idx} className="flex items-center animate-in fade-in slide-in-from-left-2 duration-200">
                        <ChevronRight className="w-3 h-3 text-slate-300 mx-0.5" />
                        <button 
                            onClick={() => { setPath(path.slice(0, idx + 1)); setSelectedInModal(null); }}
                            className={cn(
                                "px-2 py-0.5 rounded truncate max-w-[120px] transition-colors border border-transparent", 
                                idx === path.length - 1 
                                    ? "font-semibold text-blue-700 bg-blue-50 border-blue-100" 
                                    : "text-slate-600 hover:text-blue-600 hover:bg-white hover:border-slate-200"
                            )}
                        >
                            {item.name}
                        </button>
                    </div>
                 ))}
            </div>
        </div>

        {/* LISTA DE CARPETAS */}
        <ScrollArea className="flex-1 bg-white p-2">
            {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                    <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
                    <span className="text-xs">Cargando estructura...</span>
                </div>
            )}

            {/* Vista Raíz */}
            {!loading && path.length === 0 && (
                <div className="grid grid-cols-1 gap-1 animate-in fade-in zoom-in-95 duration-300">
                    {SYSTEM_ROOTS.map(root => (
                        <div 
                            key={root.id}
                            onClick={() => setPath([{ id: root.id, name: root.name, category: root.category, is_virtual: true }])}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100 transition-all"
                        >
                            <div className="p-2 bg-slate-100 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600 text-slate-500 transition-colors">
                                <root.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-slate-900">{root.name}</span>
                            <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                        </div>
                    ))}
                </div>
            )}

            {/* Vista Carpeta Interna */}
            {!loading && path.length > 0 && (
                <div className="space-y-1 animate-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => { 
                             setPath(prev => { const n = [...prev]; n.pop(); return n; }); 
                             setSelectedInModal(null);
                        }} 
                        className="flex items-center gap-2 p-2 w-full hover:bg-slate-100 rounded-lg text-slate-500 text-sm mb-2 font-medium transition-colors"
                    >
                         <ChevronLeft className="w-4 h-4" /> Volver atrás
                    </button>

                    {folders.length === 0 && !isCreating && (
                        <div className="flex flex-col items-center py-10 text-slate-400 opacity-60">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <FolderOpen className="w-8 h-8 stroke-1" />
                            </div>
                            <span className="text-sm font-medium">Esta carpeta está vacía</span>
                        </div>
                    )}

                    {folders.map(f => (
                        <div 
                            key={f.id}
                            onClick={() => setSelectedInModal(f.id)}
                            onDoubleClick={() => { 
                                // Navegar más profundo
                                setPath(prev => [...prev, { id: f.id, name: f.name, category: f.category || 'Globales', is_virtual: false }]); 
                                setSelectedInModal(null); 
                            }}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all select-none group",
                                selectedInModal === f.id ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white hover:bg-slate-50 border-transparent hover:border-slate-100"
                            )}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Folder className={cn("w-5 h-5 transition-colors", selectedInModal === f.id ? "text-blue-500 fill-blue-100" : "text-amber-400 fill-amber-50 group-hover:text-amber-500")} />
                                <span className={cn("truncate text-sm font-medium", selectedInModal === f.id ? "text-blue-700" : "text-slate-700")}>{f.name}</span>
                            </div>
                            {selectedInModal === f.id && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>}
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>

        {/* FOOTER DE ACCIONES */}
        <div className="p-4 border-t bg-slate-50 shrink-0 z-10">
             {isCreating ? (
                <div className="flex gap-2 w-full animate-in slide-in-from-bottom-2 fade-in">
                    <Input 
                        value={newFolderName} 
                        onChange={e => setNewFolderName(e.target.value)} 
                        placeholder="Nombre de nueva carpeta..." 
                        className="bg-white focus-visible:ring-blue-500" 
                        autoFocus 
                        onKeyDown={e => e.key === 'Enter' && handleCreate()} 
                    />
                    <Button onClick={handleCreate} disabled={!newFolderName.trim()}>Crear</Button>
                    <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)}><Plus className="w-4 h-4 rotate-45" /></Button>
                </div>
             ) : (
                <div className="flex justify-between items-center gap-3">
                    {path.length > 0 && isAdmin ? (
                        <Button variant="ghost" size="sm" onClick={() => setIsCreating(true)} className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Plus className="w-4 h-4 mr-1.5" /> Nueva Carpeta
                        </Button>
                    ) : <div />}
                    
                    <Button 
                        onClick={handleConfirm} 
                        className={cn("bg-blue-600 hover:bg-blue-700 flex-1 shadow-md shadow-blue-900/10 transition-all", (!path.length && !selectedInModal) && "opacity-50 cursor-not-allowed")}
                        disabled={path.length === 0 && !selectedInModal}
                    >
                        {selectedInModal ? 'Seleccionar Carpeta' : 'Guardar Aquí'}
                    </Button>
                </div>
             )}
        </div>
      </DialogContent>
    </Dialog>
  )
}