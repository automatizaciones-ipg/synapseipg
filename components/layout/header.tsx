import { UserNav } from './user-nav'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
      <div className="flex h-16 items-center px-8 justify-between">
        
        {/* Título o Breadcrumbs (Izquierda) */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Panel General
          </h2>
        </div>

        {/* Acciones de Usuario (Derecha) */}
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}