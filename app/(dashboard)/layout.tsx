'use client'

import { Sidebar, MobileSidebar } from '@/components/layout/sidebar'
import { UserNav } from '@/components/layout/user-nav' 
import { useSidebarStore } from '@/hooks/use-sidebar-store'
import { cn } from '@/lib/utils'
// 👇 Importamos el componente que creamos en el paso anterior
import { IntroAnimation } from '@/components/ui/intro-animation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebarStore()

  return (
    // 👇 Envolvemos TODO el layout en la animación para que el "Splash" cubra toda la pantalla
    <IntroAnimation>
      <div className="flex min-h-screen bg-slate-50">
        {/* 1. Sidebar Desktop (Fijo y animado) */}
        <Sidebar />
        
        {/* 2. Área Principal (Se ajusta según el sidebar) */}
        <div 
          className={cn(
              "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
              isCollapsed ? "md:ml-[80px]" : "md:ml-72" 
          )}
        >
          {/* --- HEADER ÚNICO Y DEFINITIVO --- */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md md:px-8">
              
              {/* IZQUIERDA: Menú Móvil + Título de la Página */}
              <div className="flex items-center gap-4">
                  <MobileSidebar /> {/* Solo visible en celular */}
                  <h2 className="text-lg font-semibold text-slate-800">
                      Panel General
                  </h2>
              </div>
              
              {/* DERECHA: Avatar de Usuario */}
              <div className="flex items-center gap-4">
                  <UserNav />
              </div>

          </header>
          {/* --------------------------------- */}

          {/* Contenido (Dashboard) */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </IntroAnimation>
  )
}