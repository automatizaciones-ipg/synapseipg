'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebarStore } from '@/hooks/use-sidebar-store'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle,
  ChevronLeft,
  Menu,
  Zap,
  Heart,
  FolderPlus,
  Briefcase

} from 'lucide-react'
import { Share2 } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useState } from 'react'
import { motion } from 'framer-motion' // ✅ Importamos Framer Motion

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Inicio', href: '/' },
  //{ icon: FolderOpen, label: 'Mis Recursos', href: '/my-resources' },
  { icon: Heart, label: 'Favoritos', href: '/favorites' },
  { icon: Users, label: 'Compartidos', href: '/shared' },
  { icon: Briefcase, label: 'Grupos de Trabajo', href: '/groups' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
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

  // CONTENIDO DEL MENÚ (Desktop)
  const menuJsx = (
    <div className="flex flex-col h-full text-white">
      {/* Logo Area - ANIMADO */}
      <div className={cn("p-6 flex items-center h-20 transition-all duration-300", isCollapsed ? "justify-center px-2" : "gap-3")}>
        
        {/* 🔥 EL LOGO QUE RESPIRA 🔥 */}
        <motion.div 
          className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden"
          animate={{ 
            boxShadow: [
              "0px 0px 0px rgba(37, 99, 235, 0)", 
              "0px 0px 20px rgba(37, 99, 235, 0.6)", 
              "0px 0px 0px rgba(37, 99, 235, 0)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Brillo interno sutil */}
          <motion.div 
             className="absolute inset-0 bg-white/20"
             animate={{ opacity: [0, 0.3, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <Zap className="w-5 h-5 text-white fill-current" />
        </motion.div>

        {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight animate-in fade-in duration-300">
              Synapse
            </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
      <div className="mb-6 px-1">
          <Link href="/resources/new">
             <Button 
              className={cn(
                  "w-full bg-blue-600 hover:bg-blue-500 transition-all shadow-md group cursor-pointer", 
                  isCollapsed ? "px-0 justify-center" : "justify-start gap-2"
              )} 
              size={isCollapsed ? "icon" : "default"}
            >
              <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span>Nuevo Recurso</span>}
            </Button>
        </Link>
    </div>

        <div className="space-y-1">
          {!isCollapsed && (
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 animate-in fade-in slide-in-from-left-2">
                Menu Principal
              </p>
          )}
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href} className="block group">
                <div className={cn(
                  "flex items-center rounded-lg transition-all duration-200 relative overflow-hidden",
                  isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3",
                  isActive 
                    ? "bg-gradient-to-r from-blue-900/50 to-blue-800/20 text-blue-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}>
                  <Icon className={cn("w-5 h-5 transition-colors", isActive && "text-blue-400")} />
                  {!isCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-slate-700 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer (Logout + Credits) */}
      <div className="p-3 border-t border-slate-800 space-y-4">
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer",
            isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>

        {/* --- CRÉDITOS AÑADIDOS AQUÍ --- */}
        {!isCollapsed && (
           <div className="px-4 pb-2 text-[10px] text-slate-600 text-center animate-in fade-in">
                 <p>Synapse v0.18</p>
                 <p>Designed and developed by Luis Rivera Araya IPG</p>
           </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside 
        className={cn(
            "hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 bg-[#0B1120] z-40 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[80px]" : "w-72"
        )}
      >
        {menuJsx}
        
        <button 
          onClick={toggle}
          className="absolute -right-3 top-9 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:bg-blue-500 transition-colors border-2 border-[#0B1120]"
        >
          <ChevronLeft className={cn("w-3 h-3 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()
  
    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#0B1120] border-r-slate-800 w-72 text-white">
                <SheetHeader className="p-6 text-left border-b border-slate-800">
                    <SheetTitle className="text-white flex items-center gap-2">
                        {/* 🔥 LOGO ANIMADO TAMBIÉN EN MOBILE 🔥 */}
                        <motion.div 
                          className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden"
                          animate={{ 
                            boxShadow: [
                              "0px 0px 0px rgba(37, 99, 235, 0)", 
                              "0px 0px 15px rgba(37, 99, 235, 0.6)", 
                              "0px 0px 0px rgba(37, 99, 235, 0)"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                             <Zap className="w-5 h-5 text-white fill-current" />
                        </motion.div>
                        Synapse Mobile
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full pb-6">
                      <nav className="flex-1 px-3 py-4 space-y-2">
                        {sidebarItems.map((item) => (
                             <Link 
                                key={item.href} 
                                href={item.href} 
                                onClick={() => setOpen(false)}
                                className="block"
                             >
                                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50">
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                             </Link>
                        ))}
                      </nav>
                      <div className="p-4 border-t border-slate-800 mt-auto space-y-4">
                         <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 text-slate-400 hover:text-red-400 cursor-pointer">
                             <LogOut className="w-5 h-5" /> Cerrar Sesión
                         </button>
                         
                         {/* CRÉDITOS EN MOBILE TAMBIÉN */}
                         <div className="px-4 text-[10px] text-slate-600 text-center">
                            <p>Synapse v0.18</p>
                            <p>Designed and developed by Luis Rivera Araya IPG</p>
                         </div>
                      </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}