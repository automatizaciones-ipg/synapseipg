'use client'

import { Sidebar, MobileSidebar } from '@/components/layout/sidebar'
import { UserNav } from '@/components/layout/user-nav' 
import { useSidebarStore } from '@/hooks/use-sidebar-store'
import { cn } from '@/lib/utils'
import { IntroAnimation } from '@/components/ui/intro-animation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebarStore()

  return (
    <IntroAnimation>
      {/* 1. FONDO BASE:
         - bg-slate-50: Color suave para modo claro.
         - dark:bg-slate-950: Color profundo para modo oscuro (evitamos negro absoluto #000 para elegancia).
         - transition-colors: Suaviza el cambio de tema.
      */}
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* Sidebar (Asumo que ya maneja sus estilos dark internamente o usa clases globales) */}
        <Sidebar />
        
        {/* Área Principal */}
        <div 
          className={cn(
              "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
              isCollapsed ? "md:ml-[80px]" : "md:ml-72" 
          )}
        >
          {/* 2. HEADER STICKY:
             - dark:bg-slate-950/80: Fondo oscuro translúcido.
             - dark:border-slate-800: Borde sutil para separar del contenido oscuro.
          */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 backdrop-blur-md md:px-8 transition-colors duration-300">
              
              {/* IZQUIERDA */}
              <div className="flex items-center gap-4">
                  <MobileSidebar />
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 transition-colors">
                      Panel General
                  </h2>
              </div>
              
              {/* DERECHA */}
              <div className="flex items-center gap-4">
                  <UserNav />
              </div>

          </header>

          {/* 3. MAIN CONTENT */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </IntroAnimation>
  )
}