'use client'

import { useEffect, useState } from 'react'
import { getAdminUsersList, updateUserRole, UserStat } from '@/actions/admin-users'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ShieldAlert, 
  Database, 
  User, 
  ShieldCheck, 
  Users, 
  HardDrive,
  Search,
  Infinity as InfinityIcon
} from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

// --- DEFINICIONES DE TIPO PARA EL FRONTEND ---
// Definimos exactamente lo que queremos ver en la UI y lo que hay en la BD
type UserRole = 'global_admin' | 'admin' | 'auditor';

// Usamos Omit para "borrar" la definición de rol antigua del servidor
// y la reemplazamos con nuestra definición correcta que incluye 'auditor'
type LocalUserStat = Omit<UserStat, 'role'> & { role: UserRole };

export default function UserManagementPage() {
  // El estado usa nuestro tipo LocalUserStat (con 'auditor')
  const [users, setUsers] = useState<LocalUserStat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // --- 1. LÓGICA DE CARGA ---
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const res = await getAdminUsersList()
        if (isMounted) {
          if (res.success && res.data) {
            // "Rompe" el tipado original con 'unknown' y asigna el nuestro
            // Esto permite que los datos 'auditor' entren al estado sin error
            setUsers(res.data as unknown as LocalUserStat[])
          } else {
            toast.error(res.message || "Error cargando usuarios")
          }
        }
      } catch (error) {
        console.error(error)
        toast.error("Error de conexión con el servidor")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUsers()

    return () => { isMounted = false }
  }, [])

  // --- 2. MANEJO DE CAMBIO DE ROL ---
  async function handleRoleChange(userId: string, newRoleString: string) {
    const newRole = newRoleString as UserRole
    const oldUsers = [...users]
    
    // Optimistic UI Update (Actualización visual inmediata)
    setUsers(currentUsers => 
      currentUsers.map(u => u.id === userId ? { ...u, role: newRole } : u)
    )

    // --- CORRECCIÓN QUIRÚRGICA STRICT ---
    // Usamos 'Double Casting' (as unknown as Type) para evitar el error de 'any'.
    // Convertimos a 'unknown' para borrar el tipo local, y luego al tipo que espera UserStat['role'].
    toast.promise(updateUserRole(userId, newRole as unknown as UserStat['role']), {
      loading: 'Actualizando permisos...',
      success: (data) => {
        if (!data.success) {
          setUsers(oldUsers) // Revertimos si falla
          throw new Error(data.message)
        }
        return "Permisos actualizados correctamente"
      },
      error: (err: Error) => {
        setUsers(oldUsers)
        return err.message
      }
    })
  }

  // --- HELPERS VISUALES ---
  const getUsagePercentage = (bytes: number, role: string) => {
    let limit = 0;

    if (role === 'global_admin') {
       limit = 50 * 1024 * 1024 * 1024; 
    } else if (role === 'admin') {
       limit = 100 * 1024 * 1024; 
    } else {
       limit = 0; // Auditor (0 MB)
    }

    if (limit === 0) return bytes > 0 ? 100 : 0; 
    
    const percent = (bytes / limit) * 100
    return Math.min(percent, 100)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStorage = users.reduce((acc, curr) => acc + curr.storage_used, 0)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Cargando Centro de Mando...</p>
         </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen pb-20">
      
      {/* --- HEADER DASHBOARD --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 text-white shadow-2xl border border-blue-900/30">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-blue-400/30 px-3">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Panel de Control
               </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-blue-200/70 max-w-xl">
              Administra roles, supervisa el almacenamiento y gestiona la seguridad de la organización.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 min-w-[140px]">
              <div className="flex items-center gap-2 text-blue-200 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Usuarios</span>
              </div>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 min-w-[140px]">
              <div className="flex items-center gap-2 text-blue-200 mb-1">
                <HardDrive className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Uso Global</span>
              </div>
              <p className="text-2xl font-bold">{formatBytes(totalStorage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BARRA DE HERRAMIENTAS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre o correo..." 
              className="pl-9 border-none bg-slate-50 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2 px-4 text-sm text-slate-500">
            <span>Mostrando {filteredUsers.length} usuarios</span>
         </div>
      </div>

      {/* --- GRID DE USUARIOS --- */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user, index) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onRoleChange={handleRoleChange} 
            index={index}
            formatBytes={formatBytes}
            getUsagePercentage={getUsagePercentage}
          />
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- SUB-COMPONENTE: TARJETA DE USUARIO ---
function UserCard({ 
  user, 
  onRoleChange, 
  index, 
  formatBytes, 
  getUsagePercentage 
}: { 
  // Usamos LocalUserStat aquí también
  user: LocalUserStat, 
  onRoleChange: (id: string, role: string) => void, 
  index: number,
  formatBytes: (n: number) => string,
  getUsagePercentage: (n: number, r: string) => number
}) {
  
  const usagePercent = getUsagePercentage(user.storage_used, user.role)
  
  // Lógica de etiquetas
  let limitLabel = "0 MB";
  if (user.role === 'global_admin') limitLabel = "Ilimitado";
  if (user.role === 'admin') limitLabel = "100 MB";
  if (user.role === 'auditor') limitLabel = "Solo Lectura";

  let progressColor = "from-emerald-400 to-emerald-600"
  if (usagePercent > 50) progressColor = "from-amber-400 to-orange-500"
  if (usagePercent > 90) progressColor = "from-red-500 to-rose-600"
  if (user.role === 'global_admin') progressColor = "from-blue-500 via-indigo-500 to-purple-600"

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-bl-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        
        <div className="flex items-center gap-4 w-full lg:w-1/3">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-slate-100">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-lg">
              {user.full_name?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-slate-900 truncate text-lg">{user.full_name || 'Usuario Sin Nombre'}</h3>
               {user.role === 'global_admin' && <ShieldCheck className="w-4 h-4 text-indigo-500" />}
            </div>
            <p className="text-sm text-slate-500 truncate font-mono bg-slate-50 inline-block px-1.5 rounded mt-1">
               {user.email}
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col justify-center px-4 lg:border-l lg:border-r border-slate-100">
          <div className="flex justify-between text-xs mb-2 font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Database className="w-3.5 h-3.5" /> Almacenamiento
            </span>
            <span className={usagePercent > 90 && user.role !== 'global_admin' ? "text-red-600 font-bold" : "text-slate-600"}>
              {formatBytes(user.storage_used)} <span className="text-slate-400 font-normal">/ {limitLabel}</span>
            </span>
          </div>
          
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }} 
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${progressColor} relative`}
            >
              <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
          
          <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-medium">
             <span>{user.files_count} Archivos</span>
             {usagePercent > 90 && user.role !== 'global_admin' && (
                <span className="text-red-500 flex items-center gap-1">
                   <ShieldAlert className="w-3 h-3" /> Cuota Crítica
                </span>
             )}
             {user.role === 'global_admin' && (
                <span className="text-indigo-500 flex items-center gap-1">
                   <InfinityIcon className="w-3 h-3" /> Plan Pro
                </span>
             )}
          </div>
        </div>

        <div className="w-full lg:w-auto flex-1 flex flex-col items-end gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 hidden lg:block">Nivel de Acceso</span>
          
          <Select 
            defaultValue={user.role} 
            onValueChange={(val) => onRoleChange(user.id, val)}
          >
            <SelectTrigger className={`w-full lg:w-[180px] h-10 border transition-all ${
               user.role === 'global_admin' ? 'border-indigo-200 bg-indigo-50/50 text-indigo-900' : 
               user.role === 'admin' ? 'border-blue-200 bg-blue-50/50 text-blue-900' :
               'border-slate-200 text-slate-700'
            }`}>
              <SelectValue placeholder="Seleccionar Rol" />
            </SelectTrigger>
            <SelectContent>
              {/* --- ITEMS ALINEADOS (Correctamente marcados como 'auditor') --- */}
              <SelectItem value="auditor">
                <div className="flex items-center gap-2 py-1">
                  <div className="p-1 bg-slate-100 rounded text-slate-500"><User className="w-3 h-3" /></div>
                  <div className="flex flex-col text-left">
                     <span className="font-semibold text-slate-700">Auditor</span>
                     <span className="text-[10px] text-slate-400">Solo lectura (0MB)</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2 py-1">
                  <div className="p-1 bg-blue-100 rounded text-blue-600"><ShieldAlert className="w-3 h-3" /></div>
                  <div className="flex flex-col text-left">
                     <span className="font-semibold text-blue-700">Admin</span>
                     <span className="text-[10px] text-slate-400">Gestión (100MB)</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="global_admin">
                <div className="flex items-center gap-2 py-1">
                  <div className="p-1 bg-indigo-100 rounded text-indigo-600"><ShieldCheck className="w-3 h-3" /></div>
                  <div className="flex flex-col text-left">
                     <span className="font-semibold text-indigo-700">Global Admin</span>
                     <span className="text-[10px] text-slate-400">Acceso Total</span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </motion.div>
  )
}