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

// ✅ CORRECCIÓN: Definimos la función auxiliar AQUÍ (fuera del componente)
// Así siempre existe antes de que el componente intente usarla.
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
  const [initials, setInitials] = useState("U")
  const supabase = createClient()
  const router = useRouter()

  // Obtener usuario al cargar
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Extraer iniciales del nombre (metadata) o usar email
        const fullName = user.user_metadata.full_name || user.email || "U"
        
        // Ahora sí funciona porque getInitials ya está definida arriba
        setInitials(getInitials(fullName))
      }
    }
    getUser()
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
            <AvatarImage src={user?.user_metadata.avatar_url} alt="Avatar" />
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
              {user?.user_metadata.full_name || "Usuario"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            Perfil
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