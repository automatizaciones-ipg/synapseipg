'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Search, X, Briefcase, Loader2, Users, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- DEFINICIONES DE TIPOS STRICTAS ---

export interface GroupProfile {
  id: string
  name: string
}

// CORRECCIÓN 1: Eliminamos '?' para que coincida con DB (string | null)
interface GroupMember {
  email: string
  avatar_url: string | null
}

// Interface exacta de la respuesta Raw de la BD
interface GroupMemberResponse {
  user_id: string
  profiles: {
    email: string | null
    avatar_url: string | null
  } | null
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

  // Estado local para visualización de los grupos seleccionados
  const [selectedGroupProfiles, setSelectedGroupProfiles] = useState<GroupProfile[]>([])

  // Estado para almacenar los miembros de cada grupo
  const [membersByGroup, setMembersByGroup] = useState<Record<string, GroupMember[]>>({})
  const [loadingMembers, setLoadingMembers] = useState<Record<string, boolean>>({})

  const supabase = createClient()

  // 1. Cargar metadatos de los grupos YA seleccionados
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

  // 2. Cargar miembros de los grupos seleccionados (STRICT TYPESCRIPT FIX)
  useEffect(() => {
    const fetchGroupMembers = async () => {
      const groupsToFetch = selectedGroupProfiles.filter(g => !membersByGroup[g.id] && !loadingMembers[g.id])

      if (groupsToFetch.length === 0) return

      const newLoadingState = { ...loadingMembers }
      groupsToFetch.forEach(g => { newLoadingState[g.id] = true })
      setLoadingMembers(newLoadingState)

      for (const group of groupsToFetch) {
        try {
          const { data, error } = await supabase
            .from('group_members')
            .select(`
              user_id,
              profiles:profiles (
                email,
                avatar_url
              )
            `)
            .eq('group_id', group.id)
            .returns<GroupMemberResponse[]>()

          if (!error && data) {
            // PASO A: Mapeo a objeto o null (sin filtro aún)
            const mappedMembers = data.map(row => {
              if (!row.profiles || !row.profiles.email) return null;

              // Objeto que coincide exactamente con GroupMember
              return {
                email: row.profiles.email,
                avatar_url: row.profiles.avatar_url
              };
            });

            // PASO B: Filtro Estricto con Type Predicate
            // TypeScript ahora sabe que mappedMembers es (GroupMember | null)[]
            const validMembers = mappedMembers.filter((item): item is GroupMember => item !== null);

            // PASO C: Deduplicación
            const uniqueMembersMap = new Map<string, GroupMember>()
            validMembers.forEach(m => {
              if (!uniqueMembersMap.has(m.email)) {
                uniqueMembersMap.set(m.email, m)
              }
            })

            const uniqueMembers = Array.from(uniqueMembersMap.values())

            setMembersByGroup(prev => ({
              ...prev,
              [group.id]: uniqueMembers
            }))
          }
        } catch (err) {
          console.error(`Error fetching members for group ${group.id}`, err)
        }
      }

      setLoadingMembers(prev => {
        const next = { ...prev }
        groupsToFetch.forEach(g => delete next[g.id])
        return next
      })
    }

    if (selectedGroupProfiles.length > 0) {
      fetchGroupMembers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupProfiles])

  // 3. BUSCADOR DE GRUPOS
  const handleSearch = async (searchTerm: string) => {
    setLoading(true)
    try {
      let queryBuilder = supabase
        .from('groups')
        .select('id, name')
        .eq('type', 'workgroup')
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

  // Hooks de búsqueda
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

  // 4. Toggle Selección
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
              {selectedGroups.length > 0 ? "Agregar más grupos..." : "Seleccionar grupos..."}
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
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm transition-all mb-0.5 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100 text-slate-700'}`}
                    onClick={() => toggleGroup(group)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
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

      {/* Visualización de Grupos Seleccionados (Expandido con Correos) */}
      {selectedGroupProfiles.length > 0 && (
        <div className="flex flex-col gap-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {selectedGroupProfiles.map(group => {
            const members = membersByGroup[group.id] || []
            const isLoadingMembers = loadingMembers[group.id]

            return (
              <div
                key={group.id}
                className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm"
              >
                {/* Cabecera del Grupo */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded text-blue-600">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700">{group.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => toggleGroup(group)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Lista de Miembros (Correos) */}
                <div className="bg-slate-50/50 rounded-md p-2 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Miembros del Grupo</span>
                  </div>

                  {isLoadingMembers ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 py-1 pl-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Obteniendo correos...
                    </div>
                  ) : members.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {members.map((member, idx) => (
                        <Badge
                          key={`${group.id}-${member.email}-${idx}`}
                          variant="secondary"
                          className="bg-white border border-slate-200 text-slate-600 pl-1 pr-2 py-0.5 h-auto flex items-center gap-1.5 font-mono text-[10px] hover:border-blue-200 transition-colors"
                        >
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={member.avatar_url || undefined} />
                            <AvatarFallback className="text-[8px] bg-slate-100 text-slate-500">
                              {member.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[200px]">{member.email}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic pl-1">Este grupo no tiene miembros o no se pudieron cargar.</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}