'use client'

import { Globe, FileText, ArrowUpRight, Link2, FileType } from 'lucide-react'
import { cn } from '@/lib/utils' // Asumo que tienes cn, si no, puedes usar strings normales

interface ResourcePreviewProps {
  title: string
  subtitle: string
  category: string
  color: string
  isFile?: boolean
}

export function ResourcePreview({ title, subtitle, category, color, isFile = false }: ResourcePreviewProps) {
  // Color por defecto si no viene ninguno
  const accentColor = color || "#3b82f6"

  return (
    <div className="w-full perspective-1000">
      <div 
        className="group relative h-full overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-slate-300 transition-all duration-500 ease-out hover:-translate-y-1"
      >
          {/* 1. Fondo decorativo: Gradiente Esquina Superior Derecha */}
          <div 
            className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          {/* 2. Línea de Acento Lateral (ARREGLADO: Ahora sí tiene color) */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
            style={{ backgroundColor: accentColor }}
          />

          <div className="p-5 pl-7 flex items-start gap-4 relative z-10">
              
             {/* 3. Icono Flotante con Fondo Dinámico */}
             <div 
                className="shrink-0 p-3 rounded-xl border border-slate-100 transition-all duration-500 group-hover:scale-105 group-hover:shadow-md"
                style={{ 
                    backgroundColor: `${accentColor}08`, // 8% opacidad del color principal
                    color: accentColor 
                }}
             >
                 {isFile ? (
                     <FileText className="w-6 h-6" />
                 ) : (
                     <Globe className="w-6 h-6" />
                 )}
             </div>
             
             <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                 <div className="space-y-1">
                     {/* Título: Usamos line-clamp-2 para que si es largo no se corte feo, sino en 2 lineas */}
                     <h4 className="font-bold text-slate-800 text-lg leading-tight tracking-tight group-hover:text-black transition-colors line-clamp-2">
                        {title || "Título del recurso"}
                     </h4>
                     
                     {/* Subtítulo / Enlace */}
                     <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
                        {!isFile && <Link2 className="w-3 h-3 shrink-0" />}
                        <p className="text-xs font-medium truncate max-w-full">
                           {subtitle || (isFile ? "archivo_adjunto.pdf" : "https://enlace-web.com")}
                        </p>
                        {/* Flecha animada solo si es Link */}
                        {!isFile && (
                            <ArrowUpRight 
                                className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" 
                            />
                        )}
                     </div>
                 </div>
                 
                 {/* Badge de Categoría */}
                 <div className="pt-4 flex items-center justify-between">
                    {category ? (
                        <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300 shadow-sm"
                            style={{ 
                                backgroundColor: `${accentColor}10`, // Fondo suave
                                color: accentColor,                  // Texto color
                                borderColor: `${accentColor}30`      // Borde sutil
                            }}
                        >
                            {category}
                        </span>
                    ) : (
                        // Skeleton loading mejorado
                        <span className="inline-block h-5 w-24 bg-slate-100 rounded animate-pulse" />
                    )}
                 </div>
             </div>
          </div>
      </div>
    </div>
  )
}