import { UserNav } from './user-nav'

export function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30">
      {/* CAMBIO CLAVE: 
         De: px-8 (fijo)
         A:  px-4 sm:px-6 lg:px-8 (responsivo)
         
         Esto hace que en móvil (px-4) los bordes se alineen con tus cards,
         y en desktop (px-8) recupere el espacio elegante.
      */}
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 justify-between">
        
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