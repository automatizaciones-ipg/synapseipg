'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Search, X, Briefcase, Loader2, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Interfaz adaptada a tu tabla 'groups'
export interface GroupProfile {
  id: string
  name: string
}

interface GroupSelectorProps {
  selectedGroups: string[]
  setSelectedGroups: (ids: string[]) => void
}

export function GroupSelector({ selectedGroups, setSelectedGroups }: GroupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GroupProfile[]>([])
  const [loading, setLoading] = useState(false)
  
  // Estado local para visualización (chips)
  const [selectedGroupProfiles, setSelectedGroupProfiles] = useState<GroupProfile[]>([])
  
  const supabase = createClient()

  // 1. Cargar metadatos de los grupos YA seleccionados (Persistencia visual)
  useEffect(() => {
    const fetchSelected = async () => {
      if (selectedGroups.length === 0) {
        setSelectedGroupProfiles([])
        return
      }
      
      const currentIds = selectedGroupProfiles.map(g => g.id)
      const needsFetch = selectedGroups.some(id => !currentIds.includes(id))

      if (needsFetch) {
        try {
            // ADAPTACIÓN: Buscamos en 'groups' en lugar de 'work_groups'
            const { data } = await supabase
                .from('groups') 
                .select('id, name')
                .in('id', selectedGroups)
                .returns<GroupProfile[]>()
            
            if (data) setSelectedGroupProfiles(data)
        } catch (e) {
            console.error("Error cargando grupos seleccionados", e)
        }
      } else {
         setSelectedGroupProfiles(prev => prev.filter(g => selectedGroups.includes(g.id)))
      }
    }
    fetchSelected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroups])

  // 2. BUSCADOR DE GRUPOS (Lógica adaptada a tu estructura real)
  const handleSearch = async (searchTerm: string) => {
    setLoading(true)
    try {
      // ADAPTACIÓN CRÍTICA:
      // 1. Tabla: 'groups'
      // 2. Filtro: type = 'workgroup' (Igual que en tu action.ts)
      let queryBuilder = supabase
        .from('groups')
        .select('id, name')
        .eq('type', 'workgroup') // <--- AQUÍ ESTÁ LA CLAVE PARA QUE FUNCIONE CON TU DB
        .order('name', { ascending: true })
        .limit(20)

      if (searchTerm.trim().length > 0) {
        queryBuilder = queryBuilder.ilike('name', `%${searchTerm}%`)
      }

      const { data, error } = await queryBuilder.returns<GroupProfile[]>()
      
      if (error) {
        console.error("Error fetching groups:", error.message)
      } else if (data) {
        setResults(data)
      }

    } catch (error) {
      console.warn("Excepción buscando grupos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Hooks de búsqueda (igual que el ejemplo)
  useEffect(() => {
    if (isOpen) handleSearch(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]) 
  
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => handleSearch(query), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // 3. Toggle Selección
  const toggleGroup = (group: GroupProfile) => {
    if (selectedGroups.includes(group.id)) {
      setSelectedGroupProfiles(prev => prev.filter(g => g.id !== group.id))
      setSelectedGroups(selectedGroups.filter(g => g !== group.id))
    } else {
      if (!selectedGroupProfiles.find(p => p.id === group.id)) {
          setSelectedGroupProfiles(prev => [...prev, group])
      }
      setSelectedGroups([...selectedGroups, group.id])
    }
  }

  return (
    <div className="space-y-3">
       {/* Label Header */}
       <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Grupos de Trabajo
        </label>
        {selectedGroups.length > 0 && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
            {selectedGroups.length}
            </span>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            className="w-full justify-between bg-white text-slate-600 hover:bg-slate-50 h-10 border-slate-200"
          >
             <span className="truncate">
                {selectedGroups.length > 0 
                    ? "Agregar más grupos..." 
                    : "Seleccionar grupos..."}
             </span>
             <Briefcase className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 shadow-xl border-slate-200" align="start">
           
           <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center px-2 py-1.5 bg-white rounded-md border border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <Input 
                className="border-0 bg-transparent h-6 p-0 text-sm focus-visible:ring-0 placeholder:text-slate-400" 
                placeholder="Buscar por nombre..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-[220px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
             {loading ? (
                <div className="py-6 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-xs">Cargando...</span>
                </div>
             ) : results.length === 0 ? (
                <div className="py-8 text-center px-4">
                    <p className="text-sm font-medium text-slate-600">No se encontraron grupos.</p>
                    <p className="text-xs text-slate-400 mt-1">Verifica que existan grupos de tipo workgroup.</p>
                </div>
             ) : (
                 results.map((group) => {
                    const isSelected = selectedGroups.includes(group.id)
                    return (
                        <div 
                          key={group.id} 
                          className={`
                            flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm transition-all mb-0.5
                            ${isSelected 
                                ? 'bg-blue-50 text-blue-700 font-medium' 
                                : 'hover:bg-slate-100 text-slate-700'}
                          `}
                          onClick={() => toggleGroup(group)}
                        >
                          <div className={`
                            w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                            ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}
                          `}>
                             {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="truncate">{group.name}</span>
                        </div>
                    )
                 })
             )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Badges de seleccionados */}
      {selectedGroupProfiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in zoom-in-95 duration-200">
          {selectedGroupProfiles.map(group => (
             <Badge 
                key={group.id} 
                variant="outline" 
                className="bg-white border-blue-100 text-blue-700 pl-2 pr-1 py-1 flex items-center gap-1.5 shadow-sm group hover:border-blue-300 transition-colors"
             >
                <span className="max-w-[150px] truncate font-normal">{group.name}</span>
                <div 
                   role="button"
                   className="cursor-pointer hover:bg-red-100 rounded-full p-0.5 transition-colors text-blue-300 hover:text-red-500"
                   onClick={(e) => {
                       e.stopPropagation();
                       toggleGroup(group);
                   }}
                >
                   <X className="w-3 h-3" />
                </div>
             </Badge>
          ))}
        </div>
      )}
    </div>
  )
}