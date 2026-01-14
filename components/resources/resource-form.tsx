'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" 
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

  // --- LÓGICA VISUAL ---
  const visualIsPublic = formData.is_public;

  // Calculamos el nombre visual una sola vez.
  const visualLocationName = (selectedFolderName && selectedFolderName !== 'Inicio') 
    ? selectedFolderName 
    : 'Inicio (Raíz)';

  const hasUsers = selectedUsers.length > 0;
  const hasGroups = selectedGroups.length > 0;

  return (
    <Card className="border-blue-100 shadow-md h-fit">
      
      {/* Header */}
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            {isFile ? <Folder className="w-4 h-4 text-blue-500" /> : <Globe className="w-4 h-4 text-blue-500" />}
            Detalles del Recurso
        </CardTitle>
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
          <Label>Título <span className="text-red-500">*</span></Label>
          <Input 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            placeholder="Título del recurso..." 
            className="bg-white"
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
               currentCategory={formData.category}
               // Pasamos el nombre visual explícito para que el botón no cambie erráticamente
               currentFolderName={visualLocationName}
               
               onSelect={(id, name, category) => {
                 setSelectedFolderId(id)
                 setSelectedFolderName(name)
                 
                 // Lógica: La carpeta IMPONE la categoría
                 if (category && category !== 'Globales') {
                   setFormData({ ...formData, category: category })
                 }
               }}
               isAdmin={isAdmin} 
             />
             <p className="text-[11px] text-slate-400 pl-1">
                Se guardará en: <span className="font-medium text-slate-600">{visualLocationName}</span>
             </p>
           </div>
        </div>

        {/* Categoría y Tags */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
             {/* FIX: Label indica que es automático */}
             <Label className="flex items-center gap-1.5">
                Categoría 
                <Lock className="w-3 h-3 text-slate-400" />
             </Label>
             
             {/* FIX: Select con disabled={true} para bloquear manual, pero mantiene value vinculado */}
             <Select 
               disabled={true}
               value={formData.category} 
               onValueChange={(val) => setFormData({ ...formData, category: val })}
             >
               <SelectTrigger className="bg-slate-100 text-slate-600 cursor-not-allowed border-slate-200">
                 <SelectValue placeholder="Seleccionar..." />
               </SelectTrigger>
               <SelectContent>
                 {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <p className="text-[10px] text-slate-400">Se asigna según la carpeta.</p>
           </div>

           <div className="space-y-2">
             <Label>Tags</Label>
             <Input 
               value={formData.tags} 
               onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
               placeholder="Ej: 2024, urgente" 
               className="bg-white"
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
            className="bg-white resize-none"
          />
        </div>

        <div className="h-px bg-slate-100 my-2" />

        {/* Visibilidad */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-800">Visibilidad Global</Label>
                <p className="text-xs text-slate-500">
                    {visualIsPublic 
                        ? "Visible para toda la organización." 
                        : "Privado (Solo grupos o usuarios específicos)."
                    }
                </p>
            </div>
            <Switch
                checked={visualIsPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                className="data-[state=checked]:bg-blue-600"
            />
        </div>

        {/* Permisos */}
        {!visualIsPublic && (
            <div className="pt-2 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded text-xs border border-amber-100">
                    <AlertCircle className="w-4 h-4" />
                    <span>Configura quién tiene acceso (Grupos O Usuarios).</span>
                </div>
                
                <div className={hasUsers ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                   <Label className="text-xs font-bold text-slate-500 uppercase">Grupos</Label>
                   <div className="bg-[#1f64fc]/5 p-3 rounded-lg border border-[#1f64fc]/10 mt-1">
                       <GroupSelector selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} />
                   </div>
                </div>

                <div className={hasGroups ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                   <Label className="text-xs font-bold text-slate-500 uppercase">Usuarios Individuales</Label>
                   <div className="bg-slate-50/30 p-3 rounded-lg border border-slate-100 mt-1">
                       <MemberSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                   </div>
                </div>
            </div>
        )}

        {/* Indicador Visual Final */}
        <div className={`rounded-lg p-3 border flex items-start gap-3 transition-colors duration-300 ${visualIsPublic ? 'bg-blue-50/50 border-blue-100' : 'bg-amber-50/50 border-amber-100'}`}>
          {visualIsPublic ? (
              <>
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5 shrink-0">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Recurso Público</p>
                  <p className="text-xs text-blue-700/80 leading-tight mt-0.5">Visible para todos en la sección {visualLocationName}.</p>
                </div>
              </>
          ) : (
              <>
                <div className="bg-amber-100 p-1.5 rounded-full mt-0.5 shrink-0">
                  <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-900">Recurso Privado</p>
                  <p className="text-xs text-amber-800/80 leading-tight mt-0.5">
                    Solo tú y {hasUsers ? 'los usuarios listados' : (hasGroups ? 'los grupos listados' : 'los seleccionados')} podrán ver esto.
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
          {isFile ? "Subir y Guardar" : "Guardar Recurso"}
        </Button>
      </CardContent>
    </Card>
  )
}