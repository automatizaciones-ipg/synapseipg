'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { updateResource } from "@/actions/resources"
import { MemberSelector } from './member-selector'
import { GroupSelector } from './group-selector'
import {
  Loader2,
  Type,
  Tag,
  Save,
  X,
  Link2,
  FileBox,
  Layout,
  Lock,
  Globe,
  Users,
  Briefcase,
  ShieldCheck
} from "lucide-react"

// --- TIPOS ESTRICTOS ---
type VisibilityTab = "public" | "users" | "groups"

interface ResourceUpdatePayload {
  title: string
  description: string
  category: string
  tags: string[]
  link?: string
  is_public: boolean
  shared_with: string[]
  shared_groups: string[]
}

interface EditResourceDialogProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    title: string
    description?: string
    category?: string
    tags?: string[]
    // Propiedades de la BD
    file_type?: string
    file_url?: string
    // Propiedades mapeadas
    type?: string
    url_or_path?: string
  }
}

const CATEGORIES = [
  { value: 'documents', label: 'Documentación' },
  { value: 'images', label: 'Imágenes / Medios' },
  { value: 'spreadsheets', label: 'Hojas de Cálculo' },
  { value: 'presentations', label: 'Presentaciones' },
  { value: 'others', label: 'Otros' }
]

export function EditResourceDialog({ isOpen, onClose, resource }: EditResourceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const supabase = createClient()

  const isLinkResource =
    resource.file_type === 'link' ||
    resource.type === 'link' ||
    (resource.file_url && resource.file_url.startsWith('http'));

  const currentUrl = resource.file_url || resource.url_or_path || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    link: ''
  })

  // --- ESTADOS DE PERMISOS ---
  const [activeTab, setActiveTab] = useState<VisibilityTab>("public")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)

  // 1. CARGA INICIAL DE DATOS DEL FORMULARIO
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: resource.title || '',
        description: resource.description || '',
        category: resource.category || '',
        tags: resource.tags || [],
        link: isLinkResource ? currentUrl : ''
      })
      setTagInput('')
    }
  }, [isOpen, resource, isLinkResource, currentUrl])

  // 2. HIDRATACIÓN INTELIGENTE (Determina la pestaña activa)
  useEffect(() => {
    if (!isOpen || !resource.id) return;

    let isMounted = true;

    const hydratePermissions = async () => {
      setIsLoadingPermissions(true);
      try {
        // Consultamos TODO: Permisos y si es Público
        const [usersResponse, groupsResponse, resourceMeta] = await Promise.all([
          supabase.from('resource_shares').select('user_id').eq('resource_id', resource.id),
          supabase.from('resource_group_shares').select('group_id').eq('resource_id', resource.id),
          supabase.from('resources').select('is_public').eq('id', resource.id).single()
        ]);

        if (!isMounted) return;

        const userIds = usersResponse.data?.map((row: { user_id: string }) => row.user_id) || [];
        const groupIds = groupsResponse.data?.map((row: { group_id: string }) => row.group_id) || [];
        const isPublic = resourceMeta.data?.is_public ?? true;

        setSelectedUsers(userIds);
        setSelectedGroups(groupIds);

        // LOGICA DE PESTAÑA INICIAL (Exclusión Mutua)
        if (isPublic) {
          setActiveTab("public");
        } else if (userIds.length > 0) {
          setActiveTab("users");
        } else if (groupIds.length > 0) {
          setActiveTab("groups");
        } else {
          setActiveTab("users");
        }

      } catch (error) {
        console.error("Error hidratando permisos:", error);
        toast.error("Error al cargar configuración de privacidad");
      } finally {
        if (isMounted) setIsLoadingPermissions(false);
      }
    };

    hydratePermissions();

    return () => {
      isMounted = false;
      setSelectedUsers([]);
      setSelectedGroups([]);
      setIsLoadingPermissions(false);
      setActiveTab("public");
    };
  }, [resource.id, isOpen, supabase]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("El título es obligatorio")
      return
    }

    // VALIDACIÓN DE EXCLUSIVIDAD
    if (activeTab === 'users' && selectedUsers.length === 0) {
      toast.error("Selecciona al menos un usuario o cambia a modo Público/Grupos")
      return
    }
    if (activeTab === 'groups' && selectedGroups.length === 0) {
      toast.error("Selecciona al menos un grupo o cambia a modo Público/Usuarios")
      return
    }

    setLoading(true)
    try {
      const finalTags = [...formData.tags];
      const pendingTag = tagInput.trim();
      if (pendingTag && !finalTags.includes(pendingTag)) {
        finalTags.push(pendingTag);
      }

      // CONSTRUCCIÓN DEL PAYLOAD (Typescript Estricto)
      const payload: ResourceUpdatePayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: finalTags,
        link: isLinkResource ? formData.link : undefined,
        // Lógica de exclusividad estricta
        is_public: activeTab === 'public',
        shared_with: activeTab === 'users' ? selectedUsers : [],
        shared_groups: activeTab === 'groups' ? selectedGroups : []
      }

      const response = await updateResource(resource.id, payload)

      if (response.success) {
        toast.success("Recurso actualizado correctamente")
        onClose()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Error al guardar cambios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="bg-white border-b border-slate-100 px-6 py-5 shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                Editar Recurso
                <span className="block text-xs font-medium text-slate-400 font-normal mt-0.5">
                  {isLinkResource ? "Configuración de Enlace" : "Metadatos de Archivo"}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">Edición de recurso</DialogDescription>
          </DialogHeader>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-7 py-6 space-y-6">

            {/* 0. CAMPO DE FUENTE (RESTAURADO) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                {isLinkResource ? (
                  <><Globe className="w-3 h-3 text-blue-500" /> URL del Enlace</>
                ) : (
                  <><Lock className="w-3 h-3 text-amber-500/70" /> Archivo Original <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 ml-auto">Solo Lectura</span></>
                )}
              </Label>

              {isLinkResource ? (
                <div className="relative">
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="pl-9 bg-blue-50/30 border-blue-100 focus:border-blue-400 text-blue-800 font-medium transition-all"
                    placeholder="https://ejemplo.com"
                    disabled={loading}
                  />
                  <Link2 className="w-4 h-4 text-blue-500 absolute left-3 top-3.5" />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-100/50 border border-slate-200 rounded-lg text-slate-500 text-sm select-none cursor-not-allowed transition-colors hover:bg-slate-100">
                  <div className="shrink-0 text-slate-400">
                    <FileBox className="w-4 h-4" />
                  </div>
                  <div className="truncate font-mono text-xs opacity-80 w-full">
                    {currentUrl || resource.title || "Archivo gestionado internamente"}
                  </div>
                  <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                </div>
              )}
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* 1. SECCIÓN PRINCIPAL */}
            <div className="space-y-4">
              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-blue-600" /> Título del Recurso
                </Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-10 font-medium"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-slate-700">Categoría</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={loading}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="" disabled>Seleccionar...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold text-slate-700">Etiquetas</Label>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Añadir tag..."
                    className="h-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <AnimatePresence>
                {formData.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2.5">
                <Label className="text-xs font-bold text-slate-700">Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px] resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* 2. PESTAÑAS DE PRIVACIDAD */}
            <div className="space-y-4">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Control de Acceso
              </Label>

              {isLoadingPermissions ? (
                <div className="flex items-center justify-center p-8 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500/50" />
                  <span className="ml-3 text-sm text-slate-500 font-medium">Sincronizando permisos...</span>
                </div>
              ) : (
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as VisibilityTab)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 mb-4">
                    <TabsTrigger
                      value="public"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                    >
                      <Globe className="w-4 h-4 mr-2" /> Global
                    </TabsTrigger>
                    <TabsTrigger
                      value="users"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                    >
                      <Users className="w-4 h-4 mr-2" /> Personas
                    </TabsTrigger>
                    <TabsTrigger
                      value="groups"
                      className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                    >
                      <Briefcase className="w-4 h-4 mr-2" /> Grupos
                    </TabsTrigger>
                  </TabsList>

                  {/* CONTENIDO PESTAÑA 1: GLOBAL */}
                  <TabsContent value="public" className="mt-0 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-1">
                        <Globe className="w-6 h-6 text-blue-500" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Acceso Público Organizacional</h4>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Este recurso será visible para <strong>todos los miembros</strong> de la organización en la sección de inicio.
                      </p>
                    </div>
                  </TabsContent>

                  {/* CONTENIDO PESTAÑA 2: USUARIOS */}
                  <TabsContent value="users" className="mt-0 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                    <div className="bg-amber-50 border border-amber-100 px-4 py-3 rounded-md flex gap-3 mb-2">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        El recurso será <strong>Privado</strong>. Solo los usuarios listados abajo podrán verlo.
                      </p>
                    </div>
                    <MemberSelector
                      selectedUsers={selectedUsers}
                      setSelectedUsers={setSelectedUsers}
                    />
                  </TabsContent>

                  {/* CONTENIDO PESTAÑA 3: GRUPOS */}
                  <TabsContent value="groups" className="mt-0 animate-in fade-in zoom-in-95 duration-200 space-y-3">
                    <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-md flex gap-3 mb-2">
                      <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-indigo-800">
                        El recurso será <strong>Privado</strong>. Visible solo para miembros de los grupos seleccionados.
                      </p>
                    </div>
                    <GroupSelector
                      selectedGroups={selectedGroups}
                      setSelectedGroups={setSelectedGroups}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-400 font-medium">
            {isLinkResource ? 'Link Web' : 'Archivo Local'}
          </span>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 px-5 h-10"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}