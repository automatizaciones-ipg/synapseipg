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
  FolderOpen
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { updateFolder, deleteFolder, createFolder } from "@/actions/folders"
import { deleteResource } from "@/actions/resources"

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
}

// ✅ INTERFAZ ESTRICTA PARA LA RESPUESTA DE CREAR CARPETA
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
  systemTabs = []
}: ResourceBrowserProps) {

  const router = useRouter()

  const isAuditor = userRole === 'auditor'
  const isAdmin = userRole === 'admin'
  const isGlobalContext = browserContext === 'home'

  const defaultTab = isGlobalContext ? "Inicio" : "Todos"

  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(defaultTab)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<FolderType[]>([])

  // ✅ TIPADO ESTRICTO DE ESTADO DE RECURSOS
  const [resources, setResources] = useState<ResourceWithRelations[]>(
    initialResources as unknown as ResourceWithRelations[]
  )

  // ✅ TIPADO ESTRICTO DE ESTADO DE CARPETAS (Optimistic UI)
  const [currentFoldersState, setCurrentFoldersState] = useState<FolderType[]>(initialFolders)

  // Estados de acciones (CRUD Carpetas)
  const [activeMenuFolderId, setActiveMenuFolderId] = useState<string | null>(null)
  const [folderToEdit, setFolderToEdit] = useState<FolderType | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null)

  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newName, setNewName] = useState("")
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // ----------------------------------------------------------------------
  // 2. SINCRONIZACIÓN (Server -> Client)
  // ----------------------------------------------------------------------
  useEffect(() => {
    setResources(initialResources as unknown as ResourceWithRelations[])
    setCurrentFoldersState(initialFolders)
  }, [initialResources, initialFolders])

  useEffect(() => {
    console.groupCollapsed(`🚀 [BROWSER INIT] Context: ${browserContext}`);
    console.log("Total Resources Loaded:", resources.length);
    console.log("Total Folders Loaded:", initialFolders.length);
    console.log("User Role:", userRole);
    console.groupEnd();
  }, [resources.length, initialFolders.length, browserContext, userRole]);

  // ----------------------------------------------------------------------
  // LISTA NEGRA TEMPORAL (EPHEMERAL BLACKLIST)
  // ----------------------------------------------------------------------
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

  // Filtrar Carpetas (Usando el estado local optimista)
  const currentFolders = useMemo(() => {
    return currentFoldersState.filter(folder => {
      const matchesScope = checkScope(folder.category, folder.is_global, folder.parent_id);

      if (!matchesScope) return false;
      if (searchTerm) return folder.name.toLowerCase().includes(searchTerm.toLowerCase());

      return folder.parent_id === currentFolderId;
    })
  }, [currentFoldersState, currentFolderId, searchTerm, checkScope])

  // Filtrar Recursos
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

  // ----------------------------------------------------------------------
  // 4. HANDLERS
  // ----------------------------------------------------------------------

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentFolderId(null);
    setFolderPath([]);
    setSearchTerm("");
  };

  const handleEnterFolder = (folder: FolderType) => {
    setFolderPath([...folderPath, folder])
    setCurrentFolderId(folder.id)
    setSearchTerm("")
  }

  const handleNavigateUp = () => {
    if (folderPath.length === 0) return
    const newPath = [...folderPath]
    newPath.pop()
    setFolderPath(newPath)
    setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null)
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setFolderPath([])
      setCurrentFolderId(null)
    } else {
      const newPath = folderPath.slice(0, index + 1)
      setFolderPath(newPath)
      setCurrentFolderId(newPath[newPath.length - 1].id)
    }
  }

  // --- CRUD CARPETAS (FIX: CIERRE DE MODAL Y REFRESCO) ---
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    setIsLoadingAction(true)

    let targetIsGlobal = false;
    let targetCategory: string | null = null;

    if (browserContext === 'home') {
      if (selectedCategory === "Inicio") {
        targetIsGlobal = false;
        targetCategory = null;
      } else if (SYSTEM_CATEGORIES.includes(selectedCategory)) {
        targetIsGlobal = false;
        targetCategory = selectedCategory;
      }
    }

    // ✅ CASTEO ESTRICTO PARA ACCESO SEGURO A PROPIEDADES
    const res = await createFolder(newFolderName, currentFolderId, targetIsGlobal, targetCategory) as CreateFolderResponse

    if (res.success && res.folder) {
      toast.success("Carpeta creada correctamente")
      // 1. Actualización Optimista
      setCurrentFoldersState(prev => [res.folder as FolderType, ...prev])
      // 2. Limpieza de Formulario
      setNewFolderName("")
      // 3. Cierre de Modal (AQUÍ ESTABA EL PROBLEMA)
      setIsCreatingFolder(false)
      // 4. Refresco de servidor
      router.refresh()
    } else {
      toast.error(res.message || "Error al crear carpeta")
    }
    setIsLoadingAction(false)
  }

  const initiateEdit = (e: React.MouseEvent, folder: FolderType) => { e.stopPropagation(); setFolderToEdit(folder); setNewName(folder.name); setActiveMenuFolderId(null); }

  const handleUpdateFolder = async () => {
    if (!folderToEdit) return;
    setIsLoadingAction(true);
    await updateFolder(folderToEdit.id, newName);
    setCurrentFoldersState(prev => prev.map(f => f.id === folderToEdit.id ? { ...f, name: newName } : f));
    setIsLoadingAction(false);
    setFolderToEdit(null);
    router.refresh();
  }

  const initiateDelete = (e: React.MouseEvent, folder: FolderType) => { e.stopPropagation(); setFolderToDelete(folder); setActiveMenuFolderId(null); }

  const handleDeleteFolderAction = async () => {
    if (!folderToDelete) return;
    setIsLoadingAction(true);
    await deleteFolder(folderToDelete.id);
    setCurrentFoldersState(prev => prev.filter(f => f.id !== folderToDelete.id));
    setIsLoadingAction(false);
    setFolderToDelete(null);
    router.refresh();
  }

  // Handlers Recursos
  const handleEditResource = (resource: ResourceWithRelations) => { router.push(`/resources/${resource.id}/edit`) }

  const handleDeleteResourceAction = async (resourceId: string) => {
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
  }

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuFolderId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // ----------------------------------------------------------------------
  // LOGICA UI: Permisos (SOLUCIÓN MAESTRA PARA "INICIO")
  // ----------------------------------------------------------------------

  // ✅ MEMOIZACIÓN DE LA REGLA DE NEGOCIO
  const canCreateFolderHere = useMemo(() => {
    // 1. En "Mis Recursos" SIEMPRE se puede
    if (browserContext === 'mine') return true;

    // 2. En "Inicio" depende de la pestaña (selectedCategory)
    if (browserContext === 'home') {
      // ⛔ SI ESTOY EN LA RAÍZ "INICIO" -> NO SE PUEDE
      if (selectedCategory === "Inicio") return false;

      // ✅ SI ESTOY EN UNA PESTAÑA DE SISTEMA (Ej: Comunicaciones) -> SI SE PUEDE
      return true;
    }

    // 3. Favoritos y Compartidos -> NUNCA
    return false;
  }, [browserContext, selectedCategory]);

  const showEmptyStateActions = useMemo(() => {
    // Definimos dónde es "válido" tener acciones, pero el botón de carpeta
    // se controlará individualmente con 'canCreateFolderHere' dentro del JSX
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
    <div className="space-y-6 p-6 sm:p-8 animate-in fade-in duration-500 relative">

      {/* MODALES */}
      {isCreatingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Nueva Carpeta</h3>
              <button onClick={() => setIsCreatingFolder(false)}><X className="w-5 h-5" /></button>
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

      {folderToEdit && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm"><div className="p-6"><input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-2 rounded" /> <div className="flex justify-end mt-4 gap-2"><Button onClick={() => setFolderToEdit(null)}>Cancelar</Button><Button onClick={handleUpdateFolder}>Guardar</Button></div></div></div></div>)}
      {folderToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm"><div className="p-6 text-center"><p>¿Eliminar {folderToDelete.name}?</p><div className="flex justify-center mt-4 gap-2"><Button onClick={() => setFolderToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={handleDeleteFolderAction}>Eliminar</Button></div></div></div></div>)}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <button onClick={() => handleBreadcrumbClick(-1)} className={cn("flex items-center hover:text-blue-600 transition-colors", currentFolderId === null && "font-bold text-slate-800")}>
              <HeaderIcon className="w-4 h-4 mr-1" />
              {browserContext === 'home' ? "Inicio" : (browserContext === 'mine' ? "Mis Recursos" : (browserContext === 'favorites' ? "Favoritos" : "Compartidos"))}
            </button>
            {folderPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1 text-slate-300" />
                <button onClick={() => handleBreadcrumbClick(index)} className={cn("hover:text-blue-600 transition-colors max-w-[150px] truncate", index === folderPath.length - 1 && "font-bold text-slate-800")}>
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{headerTitle}</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder={searchPlaceholder} />

          {/* ✅ BOTÓN NUEVA CARPETA (HEADER): Visible solo si canCreateFolderHere */}
          {canCreateFolderHere && (
            <Button variant="outline" onClick={() => setIsCreatingFolder(true)} className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600">
              <FolderPlus className="w-4 h-4 mr-2" /> Nueva Carpeta
            </Button>
          )}

          <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
            <Link href="/resources/new">{isAuditor ? <><Link2 className="w-4 h-4 mr-2" /> Nuevo Recurso</> : <><Plus className="w-4 h-4 mr-2" /> Nuevo Recurso</>}</Link>
          </Button>
        </div>
      </div>

      {/* TABS / FILTROS */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {isGlobalContext ? (
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            categories={tabsToRender}
          />
        ) : (
          <div className="text-sm font-medium text-slate-500 italic">
            {browserContext === 'mine' ? "Tus archivos personales" : (browserContext === 'favorites' ? "Tus elementos guardados" : "Archivos compartidos contigo")}
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentFolderId && (
            <Button variant="ghost" onClick={handleNavigateUp} className="mr-2 text-slate-500 hover:text-slate-900"><ArrowLeft className="w-4 h-4 mr-2" /> Atrás</Button>
          )}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            <button onClick={() => setView('grid')} className={cn("p-1.5 rounded-md transition-all", view === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="min-h-[300px]">
        {/* CARPETAS */}
        {currentFolders.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-[11px]">{searchTerm ? "Carpetas encontradas" : "Carpetas"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentFolders.map(folder => {
                const isGlobalFolder = Boolean(folder.is_global);
                return (
                  <div
                    key={folder.id}
                    onClick={() => handleEnterFolder(folder)}
                    className={cn(
                      "group relative flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md cursor-pointer transition-all active:scale-95",
                      isGlobalFolder ? "hover:border-blue-400" : "hover:border-slate-300"
                    )}
                  >
                    {/* Menú Contextual */}
                    {(!isGlobalFolder || isAdmin) && (
                      <div className="absolute top-2 right-2 z-10">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuFolderId(activeMenuFolderId === folder.id ? null : folder.id); }} className="p-1 rounded-full text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenuFolderId === folder.id && (
                          <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <button onClick={(e) => initiateEdit(e, folder)} className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex items-center gap-2"><Pencil className="w-3 h-3" /> Renombrar</button>
                            <button onClick={(e) => initiateDelete(e, folder)} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3 h-3" /> Eliminar</button>
                          </div>
                        )}
                      </div>
                    )}
                    {isGlobalFolder ? (
                      <div className="relative mb-3"><Folder className="w-10 h-10 text-indigo-100 fill-indigo-500" /><div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-white shadow-sm"><Globe className="w-3 h-3 text-indigo-600" /></div></div>
                    ) : (
                      <div className="relative mb-3"><Folder className="w-10 h-10 text-amber-400 fill-amber-50" /></div>
                    )}
                    <span className="text-sm font-medium text-center truncate w-full px-2">{folder.name}</span>
                    {isGlobalFolder && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-indigo-50 text-indigo-700 mt-1 border border-indigo-100">Global</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ARCHIVOS */}
        <div className={cn("mt-4", view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3")}>
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              variant={view}
              onEdit={handleEditResource}
              onDelete={handleDeleteResourceAction}
              onFavoriteToggle={handleOptimisticUnfavorite}
            />
          ))}
        </div>

        {/* ESTADO VACÍO INTELIGENTE */}
        {filteredResources.length === 0 && currentFolders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Esta sección está vacía</p>

            {showEmptyStateActions && (
              <div className="flex gap-4 mt-4">
                {/* ✅ BOTÓN NUEVA CARPETA (EMPTY STATE): Controlado por canCreateFolderHere */}
                {canCreateFolderHere && <Button variant="outline" onClick={() => setIsCreatingFolder(true)}>Crear Carpeta</Button>}
                <Button variant="default" asChild><Link href="/resources/new">Subir Archivo</Link></Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}