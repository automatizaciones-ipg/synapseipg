'use client'

// 1. AGREGADO: useEffect
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Save, Folder, Lock, AlertCircle, Globe } from 'lucide-react' 

// Componentes internos
import { FolderSelector } from "@/components/resources/folder-selector"
import { MemberSelector } from './member-selector'
import { GroupSelector } from './group-selector'

// Tipos
import { ResourceFormProps, CATEGORIES } from './new-resource-types'

export function ResourceForm({ 
  formData, setFormData, 
  selectedUsers, setSelectedUsers, 
  selectedGroups, setSelectedGroups, 
  onSave, onAI, loading, aiLoading, isFile = false,
  selectedFolderId, setSelectedFolderId, selectedFolderName, setSelectedFolderName, isAdmin
}: ResourceFormProps) {

  // 2. AGREGADO: Lógica para forzar "Globales" por defecto al iniciar
  useEffect(() => {
    // Si no hay ID ni nombre seleccionados (estado inicial limpio)
    if (!selectedFolderId && !selectedFolderName) {
      // 'tab-globales' es el ID que usa el FolderSelector para la pestaña Organización/Globales
      setSelectedFolderId('tab-globales') 
      setSelectedFolderName('Globales')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- LÓGICA DE EXCLUSIVIDAD ---
  const hasUsers = selectedUsers.length > 0
  const hasGroups = selectedGroups.length > 0

  const isGroupsLocked = hasUsers
  const isUsersLocked = hasGroups
  
  // Lógica visual para determinar si es público en tiempo real
  const isPublic = !hasUsers && !hasGroups

  return (
    <Card className="border-blue-100 shadow-md h-fit">
      
      {/* Header con botón de IA */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800">Detalles del Recurso</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:bg-blue-50 h-8 font-medium" 
          onClick={onAI} 
          disabled={aiLoading}
        >
          {aiLoading ? (
            <Loader2 className="w-3 h-3 animate-spin mr-2" />
          ) : (
            <Sparkles className="w-3 h-3 mr-2 text-yellow-500" />
          )}
          Autocompletar
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        
        {/* Título */}
        <div className="space-y-2">
          <Label>Título</Label>
          <Input 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            placeholder="Título del recurso..." 
          />
        </div>
        
        {/* Selector de Carpetas */}
        <div className="space-y-2 border border-slate-100 rounded-lg p-3 bg-slate-50/50">
           <Label className="flex items-center gap-2 mb-1">
             <Folder className="w-4 h-4 text-amber-500" />
             Ubicación
           </Label>
           <div className="flex flex-col gap-2">
             <FolderSelector 
              currentFolderId={selectedFolderId}
              onSelect={(id, name) => {
                setSelectedFolderId(id)
                setSelectedFolderName(name)
              } }
              isAdmin={isAdmin} currentCategory={''}             />
             <p className="text-[11px] text-slate-400 pl-1">
                Se guardará en: <span className="font-medium text-slate-600">{selectedFolderName || 'Globales'}</span>
             </p>
           </div>
        </div>

        {/* Categoría y Tags */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label>Categoría</Label>
             <Select 
               value={formData.category} 
               onValueChange={(val) => setFormData({ ...formData, category: val })}
             >
               <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
               <SelectContent>
                 {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label>Tags</Label>
             <Input 
               value={formData.tags} 
               onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
               placeholder="Ej: 2024, urgente" 
             />
           </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            placeholder="Opcional..." 
            rows={2} 
          />
        </div>

        {/* Configuración de Acceso */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configuración de Acceso</Label>
                {/* Etiqueta de estado flotante */}
                {!isPublic && (
                    <span className="text-[10px] flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-in fade-in">
                        <Lock className="w-3 h-3" />
                        Privado
                    </span>
                )}
            </div>
            
            {/* Contenedor Usuarios */}
            <div className={`relative transition-all duration-300 ${isUsersLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="bg-slate-50/30 p-3 rounded-lg border border-slate-100">
                   <MemberSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                </div>
                {isUsersLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
                        <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg">
                            <Lock className="w-3 h-3 mr-2" />
                            Compartiendo a Grupos
                        </div>
                    </div>
                )}
            </div>

            {/* Contenedor Grupos */}
            <div className={`relative transition-all duration-300 ${isGroupsLocked ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <div className="bg-[#1f64fc]/5 p-3 rounded-lg border border-[#1f64fc]/10">
                   <GroupSelector selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} />
                </div>
                {isGroupsLocked && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
                         <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg">
                            <Lock className="w-3 h-3 mr-2" />
                            Compartiendo a Usuarios
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* INDICADOR VISUAL DE PRIVACIDAD */}
        <div className={`rounded-lg p-3 border flex items-start gap-3 transition-colors duration-300 ${isPublic ? 'bg-blue-50/50 border-blue-100' : 'bg-amber-50/50 border-amber-100'}`}>
          {isPublic ? (
             <>
               <div className="bg-blue-100 p-1.5 rounded-full mt-0.5 shrink-0">
                 <Globe className="w-4 h-4 text-blue-600" />
               </div>
               <div>
                 <p className="text-sm font-medium text-blue-900">Visible para todos</p>
                 <p className="text-xs text-blue-700/80 leading-tight mt-0.5">Cualquier miembro de la organización podrá ver este recurso.</p>
               </div>
             </>
          ) : (
             <>
               <div className="bg-amber-100 p-1.5 rounded-full mt-0.5 shrink-0">
                 <Lock className="w-4 h-4 text-amber-600" />
               </div>
               <div>
                 <p className="text-sm font-medium text-amber-900">Acceso Restringido</p>
                 <p className="text-xs text-amber-800/80 leading-tight mt-0.5">
                   Solo tú y {hasUsers ? `los usuarios seleccionados` : `los miembros del grupo`} podrán ver esto.
                 </p>
               </div>
             </>
          )}
        </div>

        {/* Botón Guardar */}
        <Button 
            className="w-full bg-[#1f64fc] hover:bg-[#155dfc] mt-2 shadow-lg shadow-[#1f64fc]/20" 
            onClick={onSave} 
            disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isFile ? "Subir y Compartir" : "Guardar y Compartir"}
        </Button>
      </CardContent>
    </Card>
  )
}