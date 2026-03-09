'use client'

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Resource } from "@/types"
import { ResourceCard, ResourceWithRelations } from "@/components/dashboard/resource-card"

import { SearchInput } from "@/components/dashboard/search-input"
import { CategoryFilter } from "@/components/dashboard/category-filter"
import { Button } from "@/components/ui/button"

import {
  Plus, LayoutGrid, List, Link2, Folder, ChevronRight, Home, ArrowLeft,
  MoreVertical, Pencil, Trash2, X, Loader2, FolderPlus, Star, Share2,
  Globe, Megaphone, FolderTree, Building2, Users, GraduationCap, Wallet, Rocket,
  FolderOpen, Network
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { updateFolder, deleteFolder, createFolder } from "@/actions/folders"
import { deleteResource } from "@/actions/resources"

// 🔥 IMPORTAMOS LA BESTIA FASE BLUE Y SUS TIPOS ESTRICTOS
import DistributionNetwork, { DistResource, DistFolder } from "@/components/comunications/DistributionNetwork"

// ----------------------------------------------------------------------
// 1. CONFIGURACIÓN Y TIPOS
// ----------------------------------------------------------------------

const SYSTEM_CATEGORIES = [
  "Comunicaciones",
  "Admisión",
  "Inducción",
  "Secretaría General",
  "RRHH",
  "Finanzas",
  "Asuntos Académicos",
  "Asuntos Económicos & Administrativos",
  "Desarrollo"
]

export interface FolderType {
  id: string
  name: string
  parent_id: string | null
  user_id: string
  is_global: boolean | number
  category?: string | null
  created_at: string
}

export interface SystemTab {
  id: string
  label: string
  category: string
  icon: string
}

interface ResourceBrowserProps {
  initialResources: Resource[]
  initialFolders: FolderType[]
  userEmail?: string | null
  userRole: 'admin' | 'auditor'
  browserContext: 'home' | 'mine' | 'favorites' | 'shared'
  systemTabs?: SystemTab[]
  initialCategory?: string 
  initialFolderId?: string
}

interface CreateFolderResponse {
  success: boolean
  message: string
  folder?: FolderType
}

export function ResourceBrowser({
  initialResources,
  initialFolders = [],
  userEmail,
  userRole,
  browserContext,
  systemTabs = [],
  initialCategory,
  initialFolderId
}: ResourceBrowserProps) {

  const router = useRouter()

  const isAuditor = userRole === 'auditor'
  const isAdmin = userRole === 'admin'
  const isGlobalContext = browserContext === 'home'

  const defaultTab = isGlobalContext ? "Inicio" : "Todos"

  // ----------------------------------------------------------------------
  // 🔥 LÓGICA DE INICIALIZACIÓN CONTEXTUAL
  // ----------------------------------------------------------------------
  
  const startCategory = useMemo(() => {
      if (initialCategory && initialCategory !== 'null' && initialCategory !== 'undefined') {
          return initialCategory;
      }
      return defaultTab;
  }, [initialCategory, defaultTab]);

  const startFolderId = useMemo(() => {
      if (initialFolderId && initialFolderId !== 'null' && initialFolderId !== 'undefined') {
          return initialFolderId;
      }
      return null;
  }, [initialFolderId]);

  const startFolderPath = useMemo(() => {
      if (!startFolderId) return [];
      const foundFolder = initialFolders.find(f => f.id === startFolderId);
      return foundFolder ? [foundFolder] : []; 
  }, [startFolderId, initialFolders]);

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(startCategory)
  
  // 🔥 ESTADO DE VISTA DINÁMICO: Si es Inicio arranca en 'neural', sino en 'grid'
  const [view, setView] = useState<'neural' | 'grid' | 'list'>(isGlobalContext ? 'neural' : 'grid')

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(startFolderId)
  const [folderPath, setFolderPath] = useState<FolderType[]>(startFolderPath)

  const [resources, setResources] = useState<ResourceWithRelations[]>(
    initialResources as unknown as ResourceWithRelations[]
  )

  const [currentFoldersState, setCurrentFoldersState] = useState<FolderType[]>(initialFolders)

  const [activeMenuFolderId, setActiveMenuFolderId] = useState<string | null>(null)
  const [folderToEdit, setFolderToEdit] = useState<FolderType | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null)

  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newName, setNewName] = useState("")
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // ----------------------------------------------------------------------
  // 2. SINCRONIZACIÓN
  // ----------------------------------------------------------------------
  useEffect(() => {
    setResources(initialResources as unknown as ResourceWithRelations[])
    setCurrentFoldersState(initialFolders)
  }, [initialResources, initialFolders])

  const [hiddenResourceIds, setHiddenResourceIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setHiddenResourceIds(new Set())
  }, [resources])

  const handleOptimisticUnfavorite = useCallback((resourceId: string, isNowFavorite: boolean) => {
    if (browserContext === 'favorites' && !isNowFavorite) {
      setHiddenResourceIds(prev => {
        const newSet = new Set(prev)
        newSet.add(resourceId)
        return newSet
      })
      router.refresh()
    } else {
      router.refresh()
    }
  }, [browserContext, router])

  // ----------------------------------------------------------------------
  // 3. LÓGICA DE FILTRADO (CORE ROBUSTO)
  // ----------------------------------------------------------------------

  const tabsToRender = useMemo(() => {
    if (!isGlobalContext) return [];
    const fixedTabs = [
      { label: "Comunicaciones", category: "Comunicaciones", icon: "Megaphone" },
      { label: "Admisión", category: "Admisión", icon: "GraduationCap" },
      { label: "Secretaría General", category: "Secretaría General", icon: "Building2" },
      { label: "Gestión de Personas", category: "Gestión de Personas", icon: "Users" },
      { label: "Asuntos Académicos", category: "Asuntos Académicos", icon: "FolderTree" },
      { label: "Asuntos Económicos & Administrativos", category: "Asuntos Económicos & Administrativos", icon: "Wallet" },
      { label: "Desarrollo", category: "Desarrollo", icon: "Rocket" }
    ];

    const sourceTabs = systemTabs.length > 0 ? systemTabs : fixedTabs;
    return ["Inicio", ...sourceTabs.map(t => t.category)];
  }, [isGlobalContext, systemTabs]);

  const searchPlaceholder = useMemo(() => {
    if (currentFolderId) {
      const currentFolderName = folderPath[folderPath.length - 1]?.name || "carpeta actual";
      return `Buscar en ${currentFolderName}...`;
    }
    if (browserContext === 'home') return `Buscar en ${selectedCategory}...`;
    if (browserContext === 'mine') return "Buscar en mis recursos...";
    if (browserContext === 'favorites') return "Buscar en favoritos...";
    if (browserContext === 'shared') return "Buscar en compartidos...";
    return "Buscar...";
  }, [currentFolderId, folderPath, browserContext, selectedCategory]);

  const checkScope = useCallback((itemCategory: string | undefined | null, itemIsGlobal: boolean | number | undefined | null, itemFolderId: string | null) => {
    if (!isGlobalContext) return true;

    if (selectedCategory !== "Inicio") {
      return itemCategory === selectedCategory;
    }

    const belongsToSystemTab = itemCategory && SYSTEM_CATEGORIES.includes(itemCategory);
    return itemFolderId === null && !belongsToSystemTab;

  }, [selectedCategory, isGlobalContext]);

  const currentFolders = useMemo(() => {
    return currentFoldersState.filter(folder => {
      const matchesScope = checkScope(folder.category, folder.is_global, folder.parent_id);
      if (!matchesScope) return false;
      if (searchTerm) return folder.name.toLowerCase().includes(searchTerm.toLowerCase());
      return folder.parent_id === currentFolderId;
    })
  }, [currentFoldersState, currentFolderId, searchTerm, checkScope])

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (hiddenResourceIds.has(resource.id)) return false;

      const matchesScope = checkScope(resource.category, resource.is_public, resource.folder_id);
      const term = searchTerm.toLowerCase();
      const matchesSearch = !term || resource.title.toLowerCase().includes(term) || (resource.tags && resource.tags.some(t => t.toLowerCase().includes(term)));

      let matchesFolder = false;
      if (searchTerm) {
        matchesFolder = true;
      } else {
        const isFlatView = (browserContext === 'favorites' || browserContext === 'shared') && currentFolderId === null;
        if (isFlatView) {
          matchesFolder = true;
        } else {
          matchesFolder = (resource.folder_id === currentFolderId);
        }
      }
      return matchesScope && matchesSearch && matchesFolder;
    })
  }, [resources, searchTerm, currentFolderId, checkScope, browserContext, hiddenResourceIds])


  // ======================================================================
  // 🔥 MAPEOS ESTRICTOS PARA EL MOTOR DE RED NEURONAL 🔥
  // ======================================================================
  const distResources = useMemo<DistResource[]>(() => {
    return resources.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category || 'General',
      folder_id: r.folder_id,
      is_public: r.is_public || false,
      file_type: r.file_type || 'FILE',
      file_size: r.file_size ? Number(r.file_size) : null,
      tags: r.tags || [],
      created_at: r.created_at,
      profiles: r.profiles ? {
        full_name: r.profiles.full_name,
        avatar_url: r.profiles.avatar_url
      } : null
    }));
  }, [resources]);

  const distFolders = useMemo<DistFolder[]>(() => {
    return currentFoldersState.map(f => ({
      id: f.id,
      name: f.name,
      parent_id: f.parent_id,
      category: f.category,
      is_global: f.is_global
    }));
  }, [currentFoldersState]);


  // ----------------------------------------------------------------------
  // 4. HANDLERS (OPTIMIZADOS CON USECALLBACK)
  // ----------------------------------------------------------------------

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentFolderId(null);
    setFolderPath([]);
    setSearchTerm("");
  }, []);

  const handleEnterFolder = useCallback((folder: FolderType) => {
    setFolderPath(prev => [...prev, folder])
    setCurrentFolderId(folder.id)
    setSearchTerm("")
  }, []);

  const handleNavigateUp = useCallback(() => {
    setFolderPath(prev => {
      if (prev.length === 0) return prev;
      const newPath = [...prev];
      newPath.pop();
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
      return newPath;
    });
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index === -1) {
      setFolderPath([])
      setCurrentFolderId(null)
    } else {
      setFolderPath(prev => {
        const newPath = prev.slice(0, index + 1);
        setCurrentFolderId(newPath[newPath.length - 1].id);
        return newPath;
      });
    }
  }, []);

  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) return
    setIsLoadingAction(true)

    let targetIsGlobal = false;
    let targetCategory: string | null = null;

    if (browserContext === 'home') {
      if (selectedCategory !== "Inicio" && SYSTEM_CATEGORIES.includes(selectedCategory)) {
        targetIsGlobal = false;
        targetCategory = selectedCategory;
      }
    }

    const res = await createFolder(newFolderName, currentFolderId, targetIsGlobal, targetCategory) as CreateFolderResponse

    if (res.success && res.folder) {
      toast.success("Carpeta creada correctamente")
      setCurrentFoldersState(prev => [res.folder as FolderType, ...prev])
      setNewFolderName("")
      setIsCreatingFolder(false)
      router.refresh()
    } else {
      toast.error(res.message || "Error al crear carpeta")
    }
    setIsLoadingAction(false)
  }, [newFolderName, browserContext, selectedCategory, currentFolderId, router]);

  const initiateEdit = useCallback((e: React.MouseEvent, folder: FolderType) => { 
    e.stopPropagation(); 
    setFolderToEdit(folder); 
    setNewName(folder.name); 
    setActiveMenuFolderId(null); 
  }, []);

  const handleUpdateFolder = useCallback(async () => {
    if (!folderToEdit) return;
    setIsLoadingAction(true);
    await updateFolder(folderToEdit.id, newName);
    setCurrentFoldersState(prev => prev.map(f => f.id === folderToEdit.id ? { ...f, name: newName } : f));
    setIsLoadingAction(false);
    setFolderToEdit(null);
    router.refresh();
  }, [folderToEdit, newName, router]);

  const initiateDelete = useCallback((e: React.MouseEvent, folder: FolderType) => { 
    e.stopPropagation(); 
    setFolderToDelete(folder); 
    setActiveMenuFolderId(null); 
  }, []);

  const handleDeleteFolderAction = useCallback(async () => {
    if (!folderToDelete) return;
    setIsLoadingAction(true);
    await deleteFolder(folderToDelete.id);
    setCurrentFoldersState(prev => prev.filter(f => f.id !== folderToDelete.id));
    setIsLoadingAction(false);
    setFolderToDelete(null);
    router.refresh();
  }, [folderToDelete, router]);

  const handleEditResource = useCallback((resource: ResourceWithRelations) => { 
    router.push(`/resources/${resource.id}/edit`) 
  }, [router]);

  const handleDeleteResourceAction = useCallback(async (resourceId: string) => {
    setIsLoadingAction(true)
    try {
      await deleteResource(resourceId)
      toast.success("Recurso eliminado correctamente")
      setResources(prev => prev.filter(r => r.id !== resourceId))
      router.refresh()
    } catch (error) {
      toast.error("Error al eliminar el recurso")
      console.error(error)
    } finally {
      setIsLoadingAction(false)
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuFolderId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // ----------------------------------------------------------------------
  // LOGICA UI: Permisos 
  // ----------------------------------------------------------------------

  const canCreateFolderHere = useMemo(() => {
    if (browserContext === 'mine') return true;
    if (browserContext === 'home') {
      if (selectedCategory === "Inicio") return false;
      return true;
    }
    return false;
  }, [browserContext, selectedCategory]);

  const showEmptyStateActions = useMemo(() => {
    return ['home', 'mine', 'favorites', 'shared'].includes(browserContext);
  }, [browserContext]);

  const headerTitle = useMemo(() => {
    if (browserContext === 'favorites') return "Favoritos";
    if (browserContext === 'shared') return "Compartidos";
    if (browserContext === 'mine') return "Mis Recursos";
    if (currentFolderId) return folderPath[folderPath.length - 1].name;
    return selectedCategory === "Inicio" ? "Panel General" : selectedCategory;
  }, [browserContext, currentFolderId, folderPath, selectedCategory]);

  const HeaderIcon = browserContext === 'favorites' ? Star : (browserContext === 'shared' ? Share2 : (browserContext === 'mine' ? Folder : Home));

  // ----------------------------------------------------------------------
  // 5. RENDER
  // ----------------------------------------------------------------------

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 relative min-h-screen">

      {/* MODALES REUTILIZADOS */}
      {isCreatingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Nueva Carpeta</h3>
              <button onClick={() => setIsCreatingFolder(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Nombre..." className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()} />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <Button variant="ghost" onClick={() => setIsCreatingFolder(false)} disabled={isLoadingAction}>Cancelar</Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || isLoadingAction} className="bg-blue-600 text-white">
                {isLoadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {folderToEdit && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm"><div className="p-6"><input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" /> <div className="flex justify-end mt-4 gap-2"><Button onClick={() => setFolderToEdit(null)} variant="ghost">Cancelar</Button><Button onClick={handleUpdateFolder} className="bg-blue-600">Guardar</Button></div></div></div></div>)}
    
      {folderToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm"><div className="p-6 text-center"><p className="text-slate-700 mb-4">¿Eliminar definitivamente la carpeta <strong>{folderToDelete.name}</strong>?</p><div className="flex justify-center mt-4 gap-3"><Button onClick={() => setFolderToDelete(null)} variant="outline">Cancelar</Button><Button variant="destructive" onClick={handleDeleteFolderAction}>Sí, Eliminar</Button></div></div></div></div>)}

      {/* HEADER PRINCIPAL RESPONSIVO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 relative z-30">
        <div className="w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">
            <button onClick={() => handleBreadcrumbClick(-1)} className={cn("flex items-center hover:text-blue-600 transition-colors", currentFolderId === null && "font-bold text-slate-800")}>
              <HeaderIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              {browserContext === 'home' ? "Inicio" : (browserContext === 'mine' ? "Mis Recursos" : (browserContext === 'favorites' ? "Favoritos" : "Compartidos"))}
            </button>
            {folderPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-0.5 sm:mx-1 text-slate-300" />
                <button onClick={() => handleBreadcrumbClick(index)} className={cn("hover:text-blue-600 transition-colors max-w-[100px] sm:max-w-[150px] truncate", index === folderPath.length - 1 && "font-bold text-slate-800")}>
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 truncate w-full">{headerTitle}</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-64 lg:w-72">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder={searchPlaceholder} />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {canCreateFolderHere && (
              <Button variant="outline" onClick={() => setIsCreatingFolder(true)} className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600">
                <FolderPlus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Nueva Carpeta</span>
              </Button>
            )}

            <Button asChild className="flex-1 sm:flex-none bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
              <Link href={`/resources/new?folderId=${currentFolderId || ''}&category=${selectedCategory !== 'Inicio' ? selectedCategory : ''}`}>
                 {isAuditor ? <><Link2 className="w-4 h-4 mr-2" /> Nuevo Recurso</> : <><Plus className="w-4 h-4 mr-2" /> Nuevo Recurso</>}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* TABS / FILTROS Y SWITCHER DE VISTAS (SCROLLABLE EN MÓVIL) */}
      <div className="border-b border-slate-100 pb-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 relative z-30 bg-transparent w-full">
        <div className="w-full xl:w-auto overflow-hidden">
            {isGlobalContext ? (
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
                categories={tabsToRender}
            />
            ) : (
            <div className="text-sm font-medium text-slate-500 italic pb-2">
                {browserContext === 'mine' ? "Tus archivos personales" : (browserContext === 'favorites' ? "Tus elementos guardados" : "Archivos compartidos contigo")}
            </div>
            )}
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar snap-x">
          {currentFolderId && (
            <Button variant="ghost" onClick={handleNavigateUp} className="mr-1 text-slate-500 hover:text-slate-900 shrink-0 snap-start"><ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Atrás</span></Button>
          )}
          
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 shrink-0 shadow-inner snap-start">
            
            {/* 🔥 EL BOTÓN DE TOPOLOGÍA SOLO APARECE SI ESTAMOS EN "HOME" (INICIO) */}
            {isGlobalContext && (
              <button 
                onClick={() => setView('neural')} 
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-semibold shadow-sm", 
                  view === 'neural' ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border border-blue-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
              >
                <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Topología</span>
              </button>
            )}

            <button 
              onClick={() => setView('grid')} 
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium", 
                view === 'grid' ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cuadrícula</span>
            </button>

            <button 
              onClick={() => setView('list')} 
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-medium", 
                view === 'list' ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>

          </div>
        </div>
      </div>

      {/* ======================================================================
        🔥 CONTENEDOR DE CROSS-FADE EXTREMO Y OPTIMIZADO (CSS GRID HACK) 🔥
        ======================================================================
      */}
      <div className="grid grid-cols-1 grid-rows-1 mt-4 sm:mt-6 w-full max-w-[100vw] overflow-x-hidden">
        
        {/* VISTA NEURONAL (Topología) - SOLO SE RENDERIZA SI ESTAMOS EN INICIO PARA AHORRAR RAM */}
        {isGlobalContext && (
          <div 
            className={cn(
              "col-start-1 row-start-1 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
              view === 'neural' 
                ? "opacity-100 scale-100 z-20 pointer-events-auto translate-y-0" 
                : "opacity-0 scale-95 -z-10 pointer-events-none translate-y-8 invisible"
            )}
          >
            <DistributionNetwork 
              resources={distResources} 
              folders={distFolders} 
              selectedCategory={selectedCategory} 
              searchTerm={searchTerm} 
            />
          </div>
        )}

        {/* VISTA CLÁSICA (Grid / List) */}
        <div 
          className={cn(
            "col-start-1 row-start-1 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
            view !== 'neural' 
              ? "opacity-100 scale-100 z-20 pointer-events-auto translate-y-0" 
              : "opacity-0 scale-105 -z-10 pointer-events-none -translate-y-8 invisible"
          )}
        >
          <div className="min-h-[300px] w-full">
            {/* CARPETAS */}
            {currentFolders.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-3 sm:mb-4 uppercase tracking-wider text-[10px] sm:text-[11px]">{searchTerm ? "Carpetas encontradas" : "Carpetas"}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {currentFolders.map(folder => {
                    const isGlobalFolder = Boolean(folder.is_global);
                    return (
                      <div
                        key={folder.id}
                        onClick={() => handleEnterFolder(folder)}
                        className={cn(
                          "group relative flex flex-col items-center p-3 sm:p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md cursor-pointer transition-all active:scale-95",
                          isGlobalFolder ? "hover:border-blue-400" : "hover:border-slate-300"
                        )}
                      >
                        {(!isGlobalFolder || isAdmin) && (
                          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10">
                            <button onClick={(e) => { e.stopPropagation(); setActiveMenuFolderId(activeMenuFolderId === folder.id ? null : folder.id); }} className="p-1 rounded-full text-slate-400 hover:text-slate-700 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            {activeMenuFolderId === folder.id && (
                              <div className="absolute right-0 top-6 w-28 sm:w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button onClick={(e) => initiateEdit(e, folder)} className="w-full text-left px-3 py-2 text-[11px] sm:text-xs hover:bg-blue-50 flex items-center gap-2"><Pencil className="w-3 h-3" /> Renombrar</button>
                                <button onClick={(e) => initiateDelete(e, folder)} className="w-full text-left px-3 py-2 text-[11px] sm:text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3 h-3" /> Eliminar</button>
                              </div>
                            )}
                          </div>
                        )}
                        {isGlobalFolder ? (
                          <div className="relative mb-2 sm:mb-3"><Folder className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-100 fill-indigo-500" /><div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-white shadow-sm"><Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-600" /></div></div>
                        ) : (
                          <div className="relative mb-2 sm:mb-3"><Folder className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 fill-amber-50" /></div>
                        )}
                        <span className="text-xs sm:text-sm font-medium text-center truncate w-full px-1 sm:px-2">{folder.name}</span>
                        {isGlobalFolder && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-medium bg-indigo-50 text-indigo-700 mt-1 border border-indigo-100">Global</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ARCHIVOS (Grid Responsivo Inteligente) */}
            <div className={cn("mt-4 transition-all duration-500 w-full", view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" : "flex flex-col gap-3 w-full overflow-hidden")}>
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  variant={view === 'list' ? 'list' : 'grid'}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResourceAction}
                  onFavoriteToggle={handleOptimisticUnfavorite}
                />
              ))}
            </div>

            {/* ESTADO VACÍO INTELIGENTE */}
            {filteredResources.length === 0 && currentFolders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mb-3" />
                <p className="text-sm sm:text-base text-slate-500 font-medium">Esta sección está vacía</p>

                {showEmptyStateActions && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-5 w-full sm:w-auto">
                    {canCreateFolderHere && <Button variant="outline" onClick={() => setIsCreatingFolder(true)} className="w-full sm:w-auto">Crear Carpeta</Button>}
                    <Button variant="default" asChild className="w-full sm:w-auto">
                        <Link href={`/resources/new?folderId=${currentFolderId || ''}&category=${selectedCategory !== 'Inicio' ? selectedCategory : ''}`}>Subir Archivo</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}