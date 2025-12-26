'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Plus, Users, X, Loader2, Check, Sparkles, UserPlus, Briefcase, AlertTriangle, Pencil
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'

// --- CORRECCIÓN AQUÍ: Importamos las funciones con sus nuevos nombres "Workgroup" ---
import { 
  createWorkgroup, 
  updateWorkgroup, 
  deleteWorkgroup, 
  GroupData, 
  GroupMember 
} from '@/actions/groups'

import { searchUsers, UserProfile } from '@/actions/users' 
import { GroupCard } from './groups-card'

interface GroupsViewProps {
  initialGroups: GroupData[]
  userEmail: string
}

export default function GroupsView({ initialGroups, userEmail }: GroupsViewProps) {
  const router = useRouter()
  
  // --- ESTADOS ---
  const [groups, setGroups] = useState<GroupData[]>(initialGroups)
  // Sincronizar estado si initialGroups cambia (útil para revalidación server-side)
  useEffect(() => {
    setGroups(initialGroups)
  }, [initialGroups])

  const [search, setSearch] = useState('')
  
  // Estados Modal Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null) 
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  
  // Estados Búsqueda Usuarios
  const [userQuery, setUserQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Estado Modal Borrar
  const [groupToDelete, setGroupToDelete] = useState<GroupData | null>(null)

  // -- HANDLERS DE APERTURA --

  const openCreateModal = () => {
    setEditingGroup(null)
    setFormData({ name: '', description: '' })
    setSelectedUsers([])
    setIsModalOpen(true)
  }

  const openEditModal = (group: GroupData) => {
    setEditingGroup(group)
    setFormData({ name: group.name, description: group.description || '' })
    
    // Mapeo seguro de miembros a UserProfile para el chip
    const mappedMembers: UserProfile[] = (group.members || []).map((m: GroupMember) => ({
        id: m.id || '', 
        email: m.email,
        full_name: m.full_name || '',
        avatar_url: m.avatar_url
    }))
    setSelectedUsers(mappedMembers)
    setIsModalOpen(true)
  }

  const openDeleteConfirm = (group: GroupData) => {
    setGroupToDelete(group)
  }

  // -- EFECTO BÚSQUEDA USUARIOS --
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (userQuery.length >= 2) {
        setIsSearching(true)
        const results = await searchUsers(userQuery)
        const filtered = results.filter(u => 
          !selectedUsers.some(s => s.email === u.email) && u.email !== userEmail
        )
        setSearchResults(filtered)
        setShowDropdown(true)
        setIsSearching(false)
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [userQuery, selectedUsers, userEmail])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUsers([...selectedUsers, user])
    setUserQuery('')
    setShowDropdown(false)
  }

  const handleRemoveUser = (email: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.email !== email))
  }

  // -- ACCIÓN PRINCIPAL (CREAR O EDITAR) --
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("El nombre del grupo es obligatorio")
      return
    }
    setIsLoading(true)
    const memberEmails = selectedUsers.map(u => u.email)

    let res;
    if (editingGroup) {
      // CORRECCIÓN: Usamos updateWorkgroup
      res = await updateWorkgroup(editingGroup.id, formData.name, formData.description, memberEmails)
    } else {
      // CORRECCIÓN: Usamos createWorkgroup
      res = await createWorkgroup(formData.name, formData.description, memberEmails)
    }
    
    if (res.success) {
      toast.success(editingGroup ? "Grupo actualizado correctamente" : "Grupo creado exitosamente")
      setIsModalOpen(false)
      setFormData({ name: '', description: '' })
      setSelectedUsers([])
      setUserQuery('')
      router.refresh() 
    } else {
      toast.error(res.message || "Error al procesar la solicitud")
    }
    setIsLoading(false)
  }

  // -- ACCIÓN BORRAR --
  const handleConfirmDelete = async () => {
    if (!groupToDelete) return
    setIsLoading(true)
    // CORRECCIÓN: Usamos deleteWorkgroup
    const res = await deleteWorkgroup(groupToDelete.id)
    if (res.success) {
      toast.success("El grupo ha sido eliminado")
      setGroupToDelete(null)
      router.refresh()
    } else {
      toast.error(res.message || "Error al eliminar")
    }
    setIsLoading(false)
  }

  const filteredGroups = groups.filter(g => {
    const query = search.toLowerCase()
    return g.name.toLowerCase().includes(query) || 
           g.members?.some(m => m.email.toLowerCase().includes(query))
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#1f64fc]/10 rounded-xl text-[#1f64fc]">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0d2457]">
                  Grupos de Trabajo
                </h1>
                <p className="text-slate-500">Gestiona tus equipos y colaboraciones.</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
           <div className="relative w-full sm:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input 
               placeholder="Buscar grupo..." 
               className="pl-10 bg-white border-slate-200 focus:border-[#1f64fc] focus:ring-[#1f64fc]/20 rounded-lg"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>

           <Button 
             onClick={openCreateModal}
             className="bg-[#1f64fc] hover:bg-[#155dfc] text-white shadow-sm transition-colors rounded-lg"
           >
             <Plus className="w-4 h-4 mr-2" /> Nuevo Grupo
           </Button>
        </div>
      </div>

      {/* --- MODAL UNIFICADO --- */}
      <Dialog open={isModalOpen} onOpenChange={(open: boolean) => setIsModalOpen(open)}>
         <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 rounded-xl border-none shadow-2xl">
           <div className="bg-[#0d2457] p-6 text-white relative overflow-hidden">
             <div className="relative z-10">
               <DialogHeader>
                 <DialogTitle className="text-xl flex items-center gap-2 font-bold">
                   {editingGroup ? (
                      <><Pencil className="w-5 h-5 text-[#2b7fff]" /> Editar Equipo</>
                   ) : (
                      <><Sparkles className="w-5 h-5 text-[#2b7fff]" /> Crear Nuevo Equipo</>
                   )}
                 </DialogTitle>
                 <DialogDescription className="text-slate-300">
                   {editingGroup 
                     ? "Modifica los detalles del grupo o gestiona sus miembros." 
                     : "Define el nombre y añade colaboradores para comenzar."}
                 </DialogDescription>
               </DialogHeader>
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#1f64fc] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
           </div>
           
           <div className="p-6 space-y-6 bg-white">
             {/* Formulario */}
             <div className="space-y-2">
               <Label htmlFor="name" className="text-[#0d2457] font-semibold flex items-center gap-2">
                  Nombre del Grupo <span className="text-red-500">*</span>
               </Label>
               <Input 
                 id="name" 
                 placeholder="Ej: Finanzas 2024" 
                 className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1f64fc] focus:ring-[#1f64fc]/20 text-base rounded-lg"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>

             <div className="space-y-2">
               <Label htmlFor="desc" className="text-slate-700 font-semibold">Descripción</Label>
               <Textarea 
                 id="desc" 
                 placeholder="Propósito del grupo..." 
                 className="bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1f64fc] focus:ring-[#1f64fc]/20 resize-none min-h-[80px] rounded-lg"
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
               />
             </div>

             {/* Selector Miembros */}
             <div className="space-y-3 relative" ref={dropdownRef}>
               <Label className="text-[#0d2457] font-semibold flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <UserPlus className="w-4 h-4 text-slate-500" />
                   Integrantes
                 </div>
                 <span className="text-[10px] font-bold text-[#1f64fc] bg-[#1f64fc]/10 px-2 py-0.5 rounded uppercase">
                   {selectedUsers.length} SELECCIONADOS
                 </span>
               </Label>
               
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                   placeholder="Buscar personas..." 
                   className="pl-9 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1f64fc] focus:ring-[#1f64fc]/20 transition-all rounded-lg"
                   value={userQuery}
                   onChange={(e) => setUserQuery(e.target.value)}
                   onFocus={() => userQuery.length >= 2 && setShowDropdown(true)}
                 />
                 {isSearching && (
                   <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1f64fc] animate-spin" />
                 )}
               </div>

               {/* Dropdown Resultados */}
               <AnimatePresence>
                 {showDropdown && searchResults.length > 0 && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-[220px] overflow-y-auto"
                   >
                     {searchResults.map((user) => (
                       <div 
                         key={user.id}
                         className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 group"
                         onClick={() => handleSelectUser(user)}
                       >
                         <Avatar className="h-9 w-9 border border-slate-200">
                           <AvatarImage src={user.avatar_url || ''} />
                           <AvatarFallback className="bg-[#1f64fc]/10 text-[#1f64fc] text-xs font-bold">
                             {user.email.substring(0,2).toUpperCase()}
                           </AvatarFallback>
                         </Avatar>
                         <div className="flex-1 overflow-hidden">
                           <p className="text-sm font-medium text-slate-700 truncate">
                             {user.full_name || 'Usuario'}
                           </p>
                           <p className="text-xs text-slate-500 truncate">{user.email}</p>
                         </div>
                         <Plus className="h-4 w-4 text-slate-300 group-hover:text-[#1f64fc] transition-colors" />
                       </div>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Chips Seleccionados */}
               <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
                 <AnimatePresence mode="popLayout">
                   {selectedUsers.map((user) => (
                     <motion.div 
                       key={user.email} 
                       layout
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="flex items-center gap-2 pl-1 pr-2 py-1 bg-[#1f64fc]/5 border border-[#1f64fc]/20 rounded-full shadow-sm"
                     >
                       <Avatar className="h-6 w-6">
                         <AvatarImage src={user.avatar_url || ''} />
                         <AvatarFallback className="bg-white text-[10px] text-[#1f64fc] font-bold">
                           {user.email.charAt(0)}
                         </AvatarFallback>
                       </Avatar>
                       <span className="text-xs font-medium text-slate-700 max-w-[140px] truncate">
                         {user.full_name || user.email}
                       </span>
                       <button onClick={() => handleRemoveUser(user.email)} className="p-0.5 rounded-full text-[#1f64fc] hover:text-red-500 hover:bg-red-50 transition-colors">
                         <X className="w-3.5 h-3.5" />
                       </button>
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 {selectedUsers.length === 0 && (
                   <p className="text-sm text-slate-400 italic py-2 flex items-center gap-2">
                      <Users className="w-4 h-4 opacity-50" /> Sin miembros seleccionados.
                   </p>
                 )}
               </div>
             </div>
           </div>

           <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 gap-3">
             <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg">
               Cancelar
             </Button>
             <Button onClick={handleSubmit} disabled={isLoading} className="bg-[#1f64fc] hover:bg-[#155dfc] text-white rounded-lg shadow-md shadow-[#1f64fc]/20">
               {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
               {isLoading ? "Guardando..." : (editingGroup ? "Actualizar Grupo" : "Crear Grupo")}
             </Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* --- ALERTA DE BORRADO --- */}
      <AlertDialog open={!!groupToDelete} onOpenChange={(open: boolean) => !open && setGroupToDelete(null)}>
        <AlertDialogContent className="rounded-xl border-none shadow-2xl max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
               <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-[#0d2457]">
              ¿Eliminar grupo permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500">
              Estás a punto de eliminar el grupo <strong>{groupToDelete?.name}</strong>. 
              <br/>Esta acción no se puede deshacer y eliminará el acceso a todos sus miembros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 pt-2">
            <AlertDialogCancel className="border-slate-200 rounded-lg text-slate-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20"
            >
              {isLoading ? "Eliminando..." : "Sí, eliminar grupo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* GRID DE GRUPOS */}
      <div className="min-h-[300px]">
         {filteredGroups.length > 0 && (
             <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-[11px]">
                {search ? "Resultados de búsqueda" : "Tus Equipos"}
             </h3>
         )}

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <AnimatePresence mode='popLayout'>
             {filteredGroups.length > 0 ? (
               filteredGroups.map((group) => (
                 <motion.div
                    key={group.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                 >
                    {/* PASAMOS LOS HANDLERS A LA CARD */}
                    <GroupCard 
                      group={group} 
                      onEdit={openEditModal}
                      onDelete={openDeleteConfirm}
                    />
                 </motion.div>
               ))
             ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200"
               >
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                   <Users className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-semibold text-[#0d2457]">No se encontraron grupos</h3>
                 <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                   {search ? "Intenta con otro término." : "Crea un grupo para empezar a colaborar."}
                 </p>
                 {!search && (
                    <Button 
                      variant="outline" 
                      onClick={openCreateModal}
                      className="mt-4 border-[#1f64fc] text-[#1f64fc] hover:bg-[#1f64fc]/5"
                    >
                      Crear mi primer grupo
                    </Button>
                 )}
               </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>
    </div>
  )
}