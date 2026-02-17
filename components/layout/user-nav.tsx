// ARCHIVO: components/navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
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
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

// --- 1. VISUAL: RED NEURONAL (Adaptada para Navbar Horizontal) ---
interface NeuralNode {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const NeuralNetworkNav = () => {
  const [nodes, setNodes] = useState<NeuralNode[]>([])

  useEffect(() => {
    // Menos nodos (15) para no saturar la barra horizontal
    const generateNodes = () => Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1, // Puntos ligeramente más pequeños
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 2
    }));

    const animationFrameId = requestAnimationFrame(() => {
      setNodes(generateNodes());
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (nodes.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="gradient-line-nav" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>

        {/* Conexiones */}
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map((target) => {
            // Distancia ajustada para formato apaisado (horizontal)
            const dx = node.x - target.x;
            const dy = (node.y - target.y) * 4; // Penalizamos la distancia Y para priorizar conexiones horizontales
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 15) return null;

            return (
              <motion.line
                key={`line-${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="url(#gradient-line-nav)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0.2, 1, 0.2],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{
                  duration: Math.max(node.duration, target.duration),
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )
          })
        ))}

        {/* Nodos */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="#60A5FA"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// --- 2. LOGICA: UTILIDADES ---
function getInitials(name: string) {
  return name
    .match(/(\b\S)?/g)
    ?.join("")
    .match(/(^\S|\S$)?/g)
    ?.join("")
    .toUpperCase() || "U"
}

// --- 3. COMPONENTE: UserNav (TU LÓGICA INTACTA) ---
export function UserNav() {
  const [user, setUser] = useState<User | null>(null)
  const [profileData, setProfileData] = useState<{ full_name: string | null, avatar_url: string | null }>({
    full_name: null,
    avatar_url: null
  })
  const [initials, setInitials] = useState("U")

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()

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
        {/* Botón con z-index para estar sobre la red neuronal */}
        <Button variant="ghost" className="relative h-10 w-10 rounded-full z-20 hover:bg-white/10 transition-colors">
          <Avatar className="h-10 w-10 border border-white/20 shadow-md">
            <AvatarImage src={profileData.avatar_url || undefined} alt="Avatar" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs">
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
          <DropdownMenuItem onClick={() => router.push('/settings')}>
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

// --- 4. COMPONENTE PRINCIPAL: SynapseNavBar ---
export default function SynapseNavBar() {
  return (
    <header className="relative w-full h-16 bg-slate-950 border-b border-white/10 flex items-center justify-between px-6 shadow-xl overflow-hidden">

      {/* FONDO: Red Neuronal & Ambient Glows */}
      <NeuralNetworkNav />

      {/* Glow Azul Central Sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full bg-blue-500/10 blur-[40px] pointer-events-none" />

      {/* IZQUIERDA: Logo Synapse Animado */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="relative group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10 backdrop-blur-sm"
          >
            <Zap className="w-5 h-5 text-white fill-white/20" />
          </motion.div>
          {/* Glow detrás del logo */}
          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-300" />
        </div>

        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Synapse
            {/* Dot pulsante verde */}
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
          </span>
          <span className="text-[9px] text-blue-200/60 font-medium tracking-[0.2em] uppercase leading-none">
            IPG System
          </span>
        </div>
      </div>

      {/* DERECHA: Tu UserNav Intacto */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Puedes agregar notificaciones u otros iconos aquí si quieres */}
        <UserNav />
      </div>
    </header>
  )
}