'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation' 
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { saveResource } from '@/actions/resources' 
import { analyzeLinkMetadata } from '@/lib/gemini'

// UI y Componentes
import { UploadZone } from '@/components/resources/upload-zone'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link2, Cloud, Loader2, Lock } from 'lucide-react'

// Componentes Internos
import { ResourceForm } from '@/components/resources/resource-form'
import { ResourcePreview } from '@/components/resources/resource-preview'
import { ResourceFormData, MAX_FILE_SIZE, CATEGORIES } from '@/components/resources/new-resource-types'

export default function NewResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // 1. CAPTURAR CONTEXTO INICIAL (Para saber de dónde venimos)
  const initialFolderId = searchParams.get('folderId')
  const initialCategory = searchParams.get('category')

  const [isMounted, setIsMounted] = useState(false)
  const [roleLoading, setRoleLoading] = useState(true)
  
  // Tabs y Estados de Carga
  const [activeTab, setActiveTab] = useState("link") 
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Inputs principales
  const [linkUrl, setLinkUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState<ResourceFormData>({
    title: "",
    description: "",
    // Si la URL traía una categoría (ej: "Admisión"), la usamos de base
    category: initialCategory && initialCategory !== 'null' ? initialCategory : "Otros",
    tags: "",
    color: "#3b82f6",
    is_public: true, 
    iconType: "file"
  })

  // Selectores de permisos
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  
  // 2. GESTIÓN DE CARPETA SELECCIONADA
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId || null)
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>("Inicio (Raíz)")

  // Efecto: Obtener nombre de la carpeta inicial
  useEffect(() => {
    const fetchFolderName = async () => {
        if (!initialFolderId) return;
        
        console.log(`🔍 [PAGE] Buscando nombre para carpeta inicial ID: ${initialFolderId}`)
        const { data, error } = await supabase
            .from('folders')
            .select('name')
            .eq('id', initialFolderId)
            .single()
            
        if (!error && data) {
            setSelectedFolderName(data.name)
        } else {
            console.warn("No se pudo obtener nombre de carpeta inicial")
        }
    }
    
    if (initialFolderId) fetchFolderName()
  }, [initialFolderId, supabase])


  // Efecto: Inicialización de Usuario y Rol
  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
          
            const hasUploadPermission = ['admin', 'global_admin'].includes(profile?.role)
            setIsAdmin(hasUploadPermission)
          
            if (hasUploadPermission) setActiveTab("file")
            else setActiveTab("link")
        }
      } catch (error) {
        console.error("Error sesión", error)
      } finally {
        setRoleLoading(false)
        setIsMounted(true)
      }
    }
    initPage()
  }, [supabase])

  // --- LOGICA DE ANALISIS CON IA ---
  const handleAnalyzeLink = async () => {
    if (!linkUrl) return toast.error("Ingresa una URL primero")
    setAiLoading(true)
    try {
      const result = await analyzeLinkMetadata(linkUrl)
      if (result) {
        let matchedCategory = formData.category
        if (result.category) {
            const found = CATEGORIES.find(c => c.toLowerCase() === result.category?.toLowerCase())
            if (found) matchedCategory = found
        }

        setFormData(prev => ({
          ...prev,
          title: result.title || prev.title,
          description: result.description || prev.description,
          tags: result.tags?.join(", ") || prev.tags,
          category: matchedCategory,
          color: result.color || prev.color
        }))
        toast.success("Datos autocompletados con IA ✨")
      }
    } catch (error: unknown) {
      console.error(error)
      toast.error("No se pudo analizar el enlace")
    } finally {
      setAiLoading(false)
    }
  }

  const handleAnalyzeFile = async (file: File) => {
    setAiLoading(true)
    try {
        const name = file.name.split('.').slice(0, -1).join('.')
        setFormData(prev => ({
            ...prev,
            title: name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
        }))
        toast.success("Archivo analizado ✨")
    } catch (error: unknown) {
        console.error(error)
    } finally {
        setAiLoading(false)
    }
  }

  // --- GUARDADO DEL RECURSO (CON REDIRECCIÓN AL INICIO /) ---
  const handleSave = async () => {
    if (!formData.title) return toast.error("El título es obligatorio")
    if (activeTab === "link" && !linkUrl) return toast.error("Falta el enlace")
    if (activeTab === "file" && !selectedFile) return toast.error("Falta el archivo")

    if (!formData.is_public && selectedUsers.length === 0 && selectedGroups.length === 0) {
        return toast.error("⚠️ Para un recurso privado, debes seleccionar al menos un Grupo o un Usuario.")
    }

    setLoading(true)
    const toastId = toast.loading("Publicando recurso...")

    try {
        let filePath = null
        let fileType = 'link'
        let fileSize = 0

        // Subida de Archivo
        if (activeTab === "file" && selectedFile) {
            fileType = selectedFile.type
            fileSize = selectedFile.size
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(7)}_${Date.now()}.${fileExt}`
            
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('resources')
                .upload(fileName, selectedFile)

            if (uploadError) throw uploadError
            filePath = uploadData.path
        }

        const result = await saveResource({
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            file_url: null, 
            file_path: filePath,
            link: activeTab === "link" ? linkUrl : null,
            file_type: fileType,
            file_size: fileSize,
            shared_with: selectedUsers,
            shared_groups: selectedGroups,
            folder_id: selectedFolderId
        })

        if (!result.success) throw new Error(result.message)

        toast.success("Recurso publicado correctamente", { id: toastId })
        
        // -----------------------------------------------------------------
        // 🚀 REDIRECCIÓN EXACTA A TU INICIO (/)
        // -----------------------------------------------------------------
        // Aquí construimos la URL para que 'ResourceBrowser' sepa dónde abrirse.
        
        const baseUrl = '/' // Tu ruta raíz donde vive el navegador
        const params = new URLSearchParams()
        
        // Lógica de Contexto (Igual a tu FolderSelector):
        
        // 1. Si se guardó en una CARPETA ESPECÍFICA
        if (selectedFolderId) {
            params.set('folderId', selectedFolderId)
            
            // Enviamos también la categoría para mantener la pestaña activa
            if (formData.category && formData.category !== 'Otros' && formData.category !== 'Globales') {
                params.set('category', formData.category)
            }
        } 
        // 2. Si se guardó en una PESTAÑA (Raíz Virtual, sin carpeta)
        else if (formData.category && formData.category !== 'Otros' && formData.category !== 'Globales') {
             params.set('category', formData.category)
        }
        
        // Generamos la URL final: "/" o "/?category=Admisión" o "/?folderId=XYZ"
        const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl

        // Refrescamos caché de Next.js y navegamos
        router.refresh()
        router.push(finalUrl)
        
    } catch (error: unknown) {
        let errorMessage = "Error desconocido al guardar"
        if (error instanceof Error) errorMessage = error.message
        else if (typeof error === 'string') errorMessage = error
        
        console.error("❌ Error Save Resource:", errorMessage)
        
        if (errorMessage.toLowerCase().includes("infinite recursion")) {
             toast.error("Error Crítico de Base de Datos: Recursión en políticas. Contacta al administrador.", { id: toastId })
        } else {
             toast.error(errorMessage, { id: toastId })
        }
    } finally {
        setLoading(false)
    }
  }

  const handleFileSelect = (file: File | null) => {
    if (!file) {
        setSelectedFile(null)
        return
    }
    if (file.size > MAX_FILE_SIZE) return toast.error("El archivo es demasiado grande (Máx 50MB)")
    
    setSelectedFile(file)
    handleAnalyzeFile(file) 
  }

  if (!isMounted || roleLoading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    )
  }

  const formProps = {
    formData, setFormData,
    selectedUsers, setSelectedUsers,
    selectedGroups, setSelectedGroups,
    onSave: handleSave,
    loading, aiLoading,
    selectedFolderId, setSelectedFolderId,
    selectedFolderName: selectedFolderName || "Inicio (Raíz)",
    setSelectedFolderName,
    isAdmin
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nuevo Recurso</h1>
          <p className="text-slate-500">Agrega enlaces o archivos para compartir con la organización.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        {/* Selector de Tipo */}
        <div className="w-full bg-slate-100/50 p-1.5 rounded-lg mb-8">
            <TabsList className="grid w-full grid-cols-2 h-auto bg-transparent p-0 gap-2">
            {isAdmin ? (
                <TabsTrigger 
                    value="file" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 py-3 transition-all duration-300 font-medium"
                >
                    <Cloud className="w-4 h-4 mr-2" /> Subir Archivo
                </TabsTrigger>
            ) : (
                <div className="flex items-center justify-center text-slate-400 text-sm font-medium cursor-not-allowed select-none py-3 opacity-60 bg-slate-50 rounded-md">
                    <Lock className="w-3 h-3 mr-2" /> Archivo (Admin)
                </div>
            )}
            <TabsTrigger 
                value="link" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-slate-200 py-3 transition-all duration-300 font-medium"
            >
                <Link2 className="w-4 h-4 mr-2" /> Enlace Web
            </TabsTrigger>
            </TabsList>
        </div>

        {/* --- CONTENIDO: ARCHIVO --- */}
        <TabsContent value="file" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'file' && isAdmin && (
                !selectedFile ? (
                <div className="max-w-3xl mx-auto py-8">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 transition-all hover:shadow-md">
                          <UploadZone 
                            onFileSelect={handleFileSelect} 
                            selectedFile={selectedFile} 
                          />
                      </div>
                </div>
                ) : (
                <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 scale-95 opacity-80 hover:scale-100 hover:opacity-100 transition-all cursor-pointer">
                            <UploadZone 
                                onFileSelect={handleFileSelect} 
                                selectedFile={selectedFile} 
                            />
                        </div>
                        <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100">
                            <Label className="text-slate-400 mb-5 block text-[10px] uppercase tracking-widest font-bold">Vista Previa</Label>
                             <ResourcePreview 
                                title={formData.title}
                                subtitle={selectedFile.name}
                                category={formData.category}
                                color={formData.color}
                                isFile={true}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <ResourceForm 
                            {...formProps} 
                            isFile={true} 
                            onAI={() => selectedFile && handleAnalyzeFile(selectedFile)} 
                        />
                    </div>
                </div>
                )
            )}
        </TabsContent>

        {/* --- CONTENIDO: LINK --- */}
        <TabsContent value="link" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex flex-col space-y-1">
                        <Label className="text-base font-semibold text-slate-800">Enlace del Recurso</Label>
                        <p className="text-sm text-slate-500">Pega la URL para analizar su contenido automáticamente.</p>
                    </div>
                    <div className="relative">
                        <Link2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input 
                            placeholder="https://..." 
                            className="pl-11 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-base rounded-lg"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100">
                      <Label className="text-slate-400 mb-5 block text-[10px] uppercase tracking-widest font-bold">Vista Previa</Label>
                      <ResourcePreview 
                            title={formData.title}
                            subtitle={linkUrl}
                            category={formData.category}
                            color={formData.color}
                            isFile={false}
                        />
                </div>
            </div>
            
            <div className="lg:col-span-5">
                <ResourceForm 
                      {...formProps}
                      isFile={false} 
                      onAI={handleAnalyzeLink}
                />
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}