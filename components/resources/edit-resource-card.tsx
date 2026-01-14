'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { toast } from "sonner"
import { updateResource } from "@/actions/resources"
import { 
  Loader2, 
  Type, 
  FileText, 
  Tag, 
  Save, 
  X,
  Link2,
  FileBox,
  Hash,
  Layout,
  Lock,
  Globe
} from "lucide-react"

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
  
  // Detección robusta de si es Link o Archivo
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

    setLoading(true)
    try {
      // 1. CORRECCIÓN DE CALIDAD (ESLint): 
      // Usamos 'const' porque la referencia al array no cambia, solo su contenido.
      const finalTags = [...formData.tags]; 
      const pendingTag = tagInput.trim();
      
      // Lógica inteligente: Si quedó texto sin dar Enter, lo agregamos
      if (pendingTag && !finalTags.includes(pendingTag)) {
         finalTags.push(pendingTag);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: finalTags, // Se envía el array limpio ["tag1", "tag2"]
        link: isLinkResource ? formData.link : undefined 
      }

      const response = await updateResource(resource.id, payload)

      if (response.success) {
        toast.success("Recurso actualizado con éxito")
        onClose()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Error de conexión al actualizar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !loading && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 bg-white border-0 shadow-2xl rounded-2xl overflow-hidden font-sans">
        
        {/* HEADER */}
        <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 px-6 py-5">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 tracking-tight">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                    <Layout className="h-5 w-5" />
                </div>
                <div>
                    Editar Recurso
                    <span className="block text-xs font-medium text-slate-400 font-normal mt-0.5">
                        {isLinkResource ? "Editando Enlace Externo" : "Editando Metadatos de Archivo"}
                    </span>
                </div>
            </DialogTitle>
            <DialogDescription className="sr-only">Formulario de edición</DialogDescription>
            </DialogHeader>
        </div>
        
        <div className="px-7 py-6 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
            
            {/* 1. CAMPO DE FUENTE */}
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
                            onChange={(e) => setFormData({...formData, link: e.target.value})}
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

            {/* 2. TÍTULO */}
            <div className="space-y-2.5">
                <Label htmlFor="title" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-blue-600" /> Título
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11 border-slate-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium text-slate-800"
                    disabled={loading}
                />
            </div>

            <div className="grid grid-cols-2 gap-5">
                {/* 3. CATEGORÍA */}
                <div className="space-y-2.5">
                    <Label htmlFor="category" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-blue-600" /> Categoría
                    </Label>
                    <div className="relative">
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            disabled={loading}
                            className="w-full h-11 appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all cursor-pointer hover:border-slate-300"
                        >
                            <option value="" disabled>Seleccionar...</option>
                            {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 1L5 5L9 1"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 4. TAGS */}
                <div className="space-y-2.5">
                    <Label htmlFor="tags" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-blue-600" /> Etiquetas
                    </Label>
                    <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Escribe y presiona Enter..."
                        className="h-11 border-slate-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-sm"
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
                        className="flex flex-wrap gap-2 pt-1"
                    >
                        {formData.tags.map((tag, index) => (
                            <motion.span
                                key={`${tag}-${index}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 group"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    type="button"
                                    className="text-blue-400 hover:text-blue-700 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. DESCRIPCIÓN */}
            <div className="space-y-2.5">
                <Label htmlFor="description" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Descripción
                </Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detalles adicionales..."
                    className="resize-none min-h-[100px] border-slate-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all leading-relaxed"
                    disabled={loading}
                />
            </div>
        </div>

        {/* FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">
               {isLinkResource ? 'Modo: Edición de Enlace' : 'Modo: Metadatos de Archivo'}
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