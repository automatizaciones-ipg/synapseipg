'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Button,
} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@supabase/supabase-js'

// ✅ UTILIDAD ROBUSTA: Extrae iniciales reales (Ej: "Juan Perez" -> "JP")
function getInitials(name: string) {
  return name
    .match(/(\b\S)?/g)
    ?.join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toUpperCase() || "U"
}

export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  // Estado local para datos de perfil (más actualizado que la sesión)
  const [profileData, setProfileData] = useState<{ full_name: string | null, avatar_url: string | null }>({
     full_name: null,
     avatar_url: null
  })
  const [initials, setInitials] = useState("U")
  
  const supabase = createClient()
  const router = useRouter()

  // Obtener usuario y perfil real al cargar
  useEffect(() => {
    async function getUserAndProfile() {
      // 1. Obtener sesión auth
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)

        // 2. Obtener datos frescos de la tabla profiles (Fuente de la Verdad)
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single()

        // Prioridad: Perfil DB > Metadata Auth > Email > "U"
        const finalName = profile?.full_name || user.user_metadata.full_name || user.email || "Usuario"
        const finalAvatar = profile?.avatar_url || user.user_metadata.avatar_url

        setProfileData({ full_name: finalName, avatar_url: finalAvatar })
        setInitials(getInitials(finalName))
      }
    }
    getUserAndProfile()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-slate-200">
            {/* Usamos el avatar de la base de datos */}
            <AvatarImage src={profileData.avatar_url || undefined} alt="Avatar" className="object-cover" />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profileData.full_name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            Configuración
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}