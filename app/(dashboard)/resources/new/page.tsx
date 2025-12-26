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

// Componentes
import { ResourceForm } from '@/components/resources/resource-form'
import { ResourcePreview } from '@/components/resources/resource-preview'
import { ResourceFormData, MAX_FILE_SIZE, CATEGORIES } from '@/components/resources/new-resource-types'

export default function NewResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // 1. CAPTURAR CONTEXTO INICIAL
  const initialFolderId = searchParams.get('folderId')

  const [isMounted, setIsMounted] = useState(false)
  const [roleLoading, setRoleLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState("link") 
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [linkUrl, setLinkUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState<ResourceFormData>({
    title: "",
    description: "",
    category: "Otros",
    tags: "",
    color: "#3b82f6",
    is_public: false
  })

  // Selectores de permisos
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  
  // ===========================================================================
  // 2. GESTIÓN DE CARPETA SELECCIONADA (ESTADO ELEVADO)
  // ===========================================================================
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId || null)
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>("Carpeta Principal")

  // Efecto para obtener el nombre de la carpeta inicial si existe ID
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


  // Inicialización de Usuario y Rol
  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
            const userIsAdmin = profile?.role === 'admin'
            setIsAdmin(userIsAdmin)
            if (userIsAdmin) setActiveTab("file")
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

  // --- LOGICA DE ANALISIS (IA) ---
  const handleAnalyzeLink = async () => {
    if (!linkUrl) return toast.error("Ingresa una URL primero")
    setAiLoading(true)
    try {
      const result = await analyzeLinkMetadata(linkUrl)
      if (result) {
        let matchedCategory = "Otros"
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

  // --- GUARDADO ---
  const handleSave = async () => {
    // Validaciones
    if (!formData.title) return toast.error("El título es obligatorio")
    if (activeTab === "link" && !linkUrl) return toast.error("Falta el enlace")
    if (activeTab === "file" && !selectedFile) return toast.error("Falta el archivo")

    // Logs para verificar antes de enviar
    console.group("💾 [PAGE] Intentando Guardar Recurso")
    console.log("Título:", formData.title)
    console.log("Folder ID seleccionado:", selectedFolderId)
    console.log("Folder Name seleccionado:", selectedFolderName)
    console.groupEnd()

    setLoading(true)
    try {
        let filePath = null
        let fileType = 'link'
        let fileSize = 0

        // 1. Subida de Archivo (Storage)
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

        // 2. Insert en DB
        // IMPORTANTE: Aquí se pasa explícitamente selectedFolderId
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
            folder_id: selectedFolderId // ✅ USANDO EL ESTADO ELEVADO
        })

        if (!result.success) throw new Error(result.message)

        toast.success("Recurso publicado correctamente")
        
        // 3. Redirección Inteligente
        if (selectedFolderId) {
            sessionStorage.setItem('target_folder_open', selectedFolderId);
        }

        // Hard Navigation para limpiar caches y forzar reload del Dashboard
        window.location.href = '/';
        
    } catch (error: unknown) {
        let errorMessage = "Error desconocido al guardar"
        if (error instanceof Error) errorMessage = error.message
        else if (typeof error === 'string') errorMessage = error
        toast.error(errorMessage)
    } finally {
        setLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) return toast.error("El archivo es demasiado grande (Máx 50MB)")
    setSelectedFile(file)
    handleAnalyzeFile(file)
  }

  if (!isMounted || roleLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
  }

  // Props para el formulario, incluyendo el selector de carpetas
  const formProps = {
    formData, setFormData,
    selectedUsers, setSelectedUsers,
    selectedGroups, setSelectedGroups,
    onSave: handleSave,
    loading, aiLoading,
    selectedFolderId, setSelectedFolderId,
    selectedFolderName: selectedFolderName || "Carpeta Principal",
    setSelectedFolderName,
    isAdmin
  }

  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8 animate-in fade-in duration-500">
      
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

        {/* --- PESTAÑA ARCHIVO --- */}
        {isAdmin && (
            <TabsContent value="file" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
             
             {!selectedFile && (
                <div className="max-w-3xl mx-auto py-8">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 transition-all hover:shadow-md">
                         <UploadZone onFileSelect={handleFileSelect} />
                      </div>
                </div>
             )}

             {selectedFile && (
                <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 scale-95 opacity-80 hover:scale-100 hover:opacity-100 transition-all cursor-pointer">
                            <UploadZone onFileSelect={handleFileSelect} />
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
             )}
            </TabsContent>
        )}

        {/* --- PESTAÑA LINK --- */}
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