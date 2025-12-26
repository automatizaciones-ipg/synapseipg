'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Search, UserPlus, X, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from './new-resource-types'

interface MemberSelectorProps {
  selectedUsers: string[]
  setSelectedUsers: (ids: string[]) => void
}

export function MemberSelector({ selectedUsers, setSelectedUsers }: MemberSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProfiles, setSelectedProfiles] = useState<UserProfile[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null) // ID del usuario actual
  
  const supabase = createClient()

  // 0. Obtener ID del usuario actual para excluirlo de la búsqueda
  useEffect(() => {
    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setCurrentUserId(user.id)
    }
    getCurrentUser()
  }, [supabase])

  // 1. Recuperar perfiles completos de los IDs seleccionados
  useEffect(() => {
    const fetchSelectedProfiles = async () => {
      // Si no hay usuarios, limpiamos los perfiles visuales
      if (selectedUsers.length === 0) {
        setSelectedProfiles([])
        return
      }

      // IMPORTANTE: Solo hacemos fetch si hay discrepancia entre IDs seleccionados y perfiles cargados
      // Esto evita parpadeos al borrar
      const currentIds = selectedProfiles.map(p => p.id)
      const needsFetch = selectedUsers.some(id => !currentIds.includes(id))
      
      if (needsFetch) {
          const { data } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .in('id', selectedUsers)
          
          if (data) setSelectedProfiles(data)
      } else {
        // Si no necesitamos fetch (porque borramos), solo filtramos los perfiles locales para que coincidan
        setSelectedProfiles(prev => prev.filter(p => selectedUsers.includes(p.id)))
      }
    }
    
    fetchSelectedProfiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUsers]) // Dependencia limpia

  // 2. Lógica de búsqueda (CORREGIDA: Excluye al usuario actual)
  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        let dbQuery = supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url')
          .ilike('email', `%${query}%`)
          .limit(5)
        
        // ✅ CORRECCIÓN: Excluir al usuario creador
        if (currentUserId) {
            dbQuery = dbQuery.neq('id', currentUserId)
        }
        
        const { data } = await dbQuery
        if (data) setResults(data as UserProfile[])
      } catch (error) {
        console.error("Error buscando usuarios:", error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 300)
    return () => clearTimeout(timer)
  }, [query, supabase, currentUserId])

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      // ✅ CORRECCIÓN "X": Actualización optimista inmediata
      // Eliminamos primero del estado visual para respuesta instantánea
      setSelectedProfiles(prev => prev.filter(p => p.id !== userId))
      // Luego actualizamos el estado lógico que dispara el useEffect
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          Usuarios individuales
        </label>
        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
          {selectedUsers.length} seleccionados
        </span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700">
             {selectedUsers.length > 0 ? `${selectedUsers.length} usuarios` : "Buscar por correo..."}
             <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-2 border-b border-slate-100">
            <div className="flex items-center px-2 py-1 bg-slate-50 rounded-md border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <Input 
                className="border-0 bg-transparent h-8 p-0 text-sm focus-visible:ring-0 placeholder:text-slate-400" 
                placeholder="Escribe un correo..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {loading && <div className="text-xs text-center py-4 text-slate-400">Buscando...</div>}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="text-xs text-center py-4 text-slate-400">No se encontraron usuarios</div>
            )}
            {results.map((user) => {
              const isSelected = selectedUsers.includes(user.id)
              return (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                  onClick={() => toggleUser(user.id)}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                      {user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 truncate">{user.full_name || "Usuario"}</span>
                    <span className="text-xs text-slate-400 truncate">{user.email}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Chips de Usuarios */}
      {selectedProfiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in">
          {selectedProfiles.map(user => (
            <Badge key={user.id} variant="secondary" className="bg-white border border-slate-200 text-slate-600 pl-1 pr-2 py-1 flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-[9px]">{user.email.substring(0,1)}</AvatarFallback>
              </Avatar>
              <span className="max-w-[100px] truncate">{user.full_name?.split(' ')[0] || user.email.split('@')[0]}</span>
              <div 
                role="button"
                className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                onClick={(e) => {
                    e.stopPropagation(); // Evita burbujeo de eventos
                    toggleUser(user.id);
                }}
              >
                 <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
              </div>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}