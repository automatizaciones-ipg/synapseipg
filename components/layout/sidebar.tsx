// ARCHIVO: components/layout/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/hooks/use-sidebar-store'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  PlusCircle,
  ChevronLeft,
  Menu,
  Zap,
  Heart,
  Briefcase,
  Trash2,
  Activity,
  BookOpen
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// --- 1. DEFINICIÓN DE TIPOS ---
type NodeType = {
  id: number;
  x: number;
  y: number;
  r: number;
  delay: number;
  duration: number;
}

type ParticleType = {
  id: number;
  initialX: number;
  targetX: number;
  initialY: number;
  delay: number;
  duration: number;
}

type ConnectionType = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number;
}

type NeuralDataType = {
  nodes: NodeType[];
  particles: ParticleType[];
  connections: ConnectionType[];
}

// --- 2. GENERADOR DE DATOS ---
const generateNeuralData = (): NeuralDataType => {
  const nodes: NodeType[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: (i / 15) * 100 + (Math.random() * 10 - 5),
    r: Math.random() * 2 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2
  }));

  const particles: ParticleType[] = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    targetX: Math.random() * 100,
    initialY: 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  const connections: ConnectionType[] = [];
  nodes.forEach((node, i) => {
    const targets = nodes.slice(i + 1, i + 3);
    targets.forEach((target, ti) => {
      connections.push({
        id: `link-${i}-${ti}`,
        x1: node.x,
        y1: node.y,
        x2: target.x,
        y2: target.y,
        duration: Math.random() * 5 + 3
      });
    });
  });

  return { nodes, particles, connections };
};

// --- 3. COMPONENTE NEURONAL ---
const NeuralVertical = () => {
  const [data, setData] = useState<NeuralDataType | null>(null);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setData(generateNeuralData());
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!data) {
    return <div className="absolute inset-0 bg-[#0B1120] z-0" />;
  }

  const { nodes, particles, connections } = data;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg className="w-full h-full opacity-30">
        <defs>
          <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow-node">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((link) => (
          <motion.line
            key={link.id}
            x1={`${link.x1}%`} y1={`${link.y1}%`}
            x2={`${link.x2}%`} y2={`${link.y2}%`}
            stroke="url(#synapse-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0.2, 1, 0.2],
              opacity: [0.1, 0.5, 0.1],
              strokeDashoffset: [0, -20]
            }}
            transition={{
              duration: link.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.r}
            fill="#93c5fd"
            filter="url(#glow-node)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {particles.map((p) => (
          <motion.circle
            key={`particle-${p.id}`}
            r="1"
            fill="#fff"
            initial={{ x: `${p.initialX}%`, y: "100%", opacity: 0 }}
            animate={{
              y: "0%",
              opacity: [0, 1, 0],
              x: `${p.targetX}%`
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-transparent to-[#0B1120] opacity-80" />
      <div className="absolute inset-0 bg-[#0B1120]/60 backdrop-blur-[1px]" />
    </div>
  )
}

// --- CONFIGURACIÓN SIDEBAR ---
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Inicio', href: '/' },
  { icon: Heart, label: 'Favoritos', href: '/favorites' },
  { icon: Users, label: 'Compartidos', href: '/shared' },
  { icon: Briefcase, label: 'Grupos de Trabajo', href: '/groups' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
  { icon: BookOpen, label: 'Tutoriales de Uso', href: '/docs' },
]

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada")
    router.refresh()
    router.push('/login')
  }

  // CONTENIDO DESKTOP
  const menuJsx = (
    <div className="flex flex-col h-full text-white relative z-10">

      {/* HEADER LOGO */}
      <div className={cn("p-6 flex items-center h-24 transition-all duration-500", isCollapsed ? "justify-center px-2" : "gap-4")}>
        <div className="relative group shrink-0">
          <motion.div
            className="absolute inset-0 rounded-xl bg-blue-500/30 blur-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center relative shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/30 z-10 overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Zap className="w-6 h-6 text-white fill-blue-100 drop-shadow-md" />
            <motion.div
              className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-xl tracking-tight text-white leading-none mb-1"
            >
              Synapse
            </motion.span>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="h-0.5 w-4 bg-blue-500 rounded-full" />
              <span className="text-[10px] font-medium text-blue-300 tracking-[0.2em] uppercase">IPG</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto custom-scrollbar">

        {/* === CORRECCIÓN FINAL Y DEFINITIVA === */}
        {/* Eliminamos el div wrapper con lógica de px. Usamos un div simple para margin. */}
        {/* El botón replica EXACTAMENTE las dimensiones (w-10 h-10) y el mx-auto de los items. */}
        <div className="mb-6 px-2">
          <Link href="/resources/new" className="block group relative">
            <Button
              className={cn(
                "bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 border border-blue-400/20 relative overflow-hidden cursor-pointer",
                isCollapsed
                  ? "w-10 h-10 p-0 mx-auto justify-center rounded-xl"
                  : "w-full justify-start gap-2 h-11 px-4 py-3"
              )}
              size={isCollapsed ? "icon" : "default"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              {/* CAMBIO CLAVE: Icono w-5 h-5 (antes w-6) para que coincida EXACTO con los de abajo */}
              <PlusCircle className={cn("transition-transform duration-300", isCollapsed ? "w-5 h-5" : "w-5 h-5 group-hover:rotate-90")} />
              {!isCollapsed && <span className="font-semibold tracking-wide">Nuevo Recurso</span>}
            </Button>
          </Link>
        </div>
        {/* ===================================== */}

        <div className="space-y-1">
          {!isCollapsed && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 select-none"
            >
              Menu Principal
            </motion.p>
          )}

          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href} className="block group relative">
                <div className={cn(
                  "flex items-center rounded-xl transition-all duration-300 relative overflow-hidden",
                  // REFERENCIA: Así es como se alinean los otros. Hemos copiado esta lógica arriba.
                  isCollapsed ? "justify-center p-3 w-10 h-10 mx-auto" : "px-4 py-3 gap-3",
                  isActive
                    ? "text-white bg-blue-900/30 border border-blue-500/30 shadow-[inset_0_0_15px_rgba(37,99,235,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                    />
                  )}
                  <Icon className={cn(
                    "transition-all duration-300",
                    isActive ? "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" : "group-hover:text-blue-200",
                    isCollapsed ? "w-5 h-5" : "w-5 h-5"
                  )} />
                  {!isCollapsed && <span className={cn("text-sm font-medium", isActive ? "text-blue-50" : "")}>{item.label}</span>}

                  {isCollapsed && (
                    <div className="absolute left-14 bg-slate-900/90 backdrop-blur border border-slate-700 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
                      {item.label}
                      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-700 rotate-45 -z-10" />
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-3 mt-auto space-y-2 relative">
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        <Link href="/trash" className="block group relative pt-2">
          <div className={cn(
            "flex items-center rounded-xl transition-all duration-300 relative overflow-hidden",
            isCollapsed ? "justify-center p-3 w-10 h-10 mx-auto" : "px-4 py-3 gap-3",
            pathname === '/trash'
              ? "text-white bg-blue-900/30 border border-blue-500/30 shadow-[inset_0_0_15px_rgba(37,99,235,0.2)]"
              : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
          )}>
            {pathname === '/trash' && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              />
            )}

            <Trash2 className={cn("w-5 h-5 transition-all duration-300",
              pathname === '/trash' ? "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" : "group-hover:text-red-400"
            )} />
            {!isCollapsed && <span className={cn("text-sm font-medium", pathname === '/trash' ? "text-blue-50" : "")}>Papelera</span>}

            {isCollapsed && (
              <div className="absolute left-14 bg-slate-900/90 backdrop-blur border border-slate-700 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                Papelera
              </div>
            )}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 cursor-pointer group",
            isCollapsed ? "justify-center p-3 w-10 h-10 mx-auto" : "px-4 py-3 gap-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 pb-2 pt-2 text-[9px] text-slate-600 text-center leading-relaxed"
          >
            <p className="font-semibold text-slate-500">Synapse IPG v1.0</p>
            <p className="opacity-70">Designed by Luis Rivera Araya IPG</p>
          </motion.div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 bg-[#0B1120] z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-2xl overflow-visible",
          isCollapsed ? "w-[84px]" : "w-72"
        )}
      >
        {/* Wrapper interno para recortar contenido */}
        <div className="flex flex-col h-full w-full relative overflow-hidden">
          <NeuralVertical />
          {menuJsx}
        </div>

        {/* Botón de colapso externo */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-1.5 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all border-4 border-[#0B1120] z-50 group"
        >
          <ChevronLeft className={cn("w-3 h-3 transition-transform duration-500", isCollapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  )
}

// --- MOBILE SIDEBAR ---
export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#0B1120] border-r-slate-800 w-80 text-white overflow-hidden border-r border-white/10">
        <NeuralVertical />
        <div className="relative z-10 flex flex-col h-full bg-[#0B1120]/40 backdrop-blur-sm">
          <SheetHeader className="p-6 text-left border-b border-white/5">
            <SheetTitle className="text-white flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-pulse" />
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center relative shadow-lg border border-white/10">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight">Recursos IPG</span>
                <span className="text-[10px] text-blue-400 tracking-wider font-medium">SYNAPSE MOBILE</span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full pb-6 overflow-y-auto custom-scrollbar">
            <div className="px-4 mt-6 mb-4">
              <Link href="/resources/new" onClick={() => setOpen(false)}>
                <Button
                  className="w-full justify-start gap-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:border-blue-500 transition-all shadow-sm h-12"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-semibold">Nuevo Recurso</span>
                </Button>
              </Link>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Navegación</p>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block"
                  >
                    <div className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all",
                      isActive
                        ? "bg-gradient-to-r from-blue-900/40 to-transparent border-l-2 border-blue-500 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}>
                      <item.icon className={cn("w-5 h-5", isActive && "text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]")} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-white/5 mt-auto space-y-2 bg-slate-900/20">
              <Link href="/trash" onClick={() => setOpen(false)}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all",
                  pathname === '/trash'
                    ? "bg-blue-900/20 text-blue-200 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}>
                  <Trash2 className={cn("w-5 h-5", pathname === '/trash' && "text-blue-400")} />
                  <span className="font-medium">Papelera</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-red-900/30">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
              <div className="px-4 pt-6 text-[10px] text-slate-600 text-center">
                <p className="font-bold opacity-50">Synapse IPG v1.0</p>
                <p className="opacity-40">Designed and Developed by Luis Rivera Araya</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}