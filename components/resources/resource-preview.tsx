'use client'

import { Globe, FileText, ArrowUpRight } from 'lucide-react'

interface ResourcePreviewProps {
  title: string
  subtitle: string
  category: string
  color: string
  isFile?: boolean
}

export function ResourcePreview({ title, subtitle, category, color, isFile = false }: ResourcePreviewProps) {
  // Color por defecto y manejo de opacidad para el "brillo"
  const accentColor = color || "#3b82f6"

  return (
    <div className="w-full perspective-1000">
      <div 
        className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-1"
      >
          {/* Fondo decorativo con gradiente sutil basado en el color elegido */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-20 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-40"
            style={{ backgroundColor: accentColor }}
          />
          
          {/* Línea de acento lateral suave */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300"
          />

          <div className="p-5 pl-7 flex items-start gap-5 relative z-10">
             {/* Icono Flotante */}
             <div 
                className="p-3.5 rounded-2xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform duration-500 ease-out flex items-center justify-center shrink-0 bg-white"
             >
                 {isFile ? (
                     <FileText className="w-6 h-6 text-slate-500" />
                 ) : (
                     <Globe className="w-6 h-6" style={{ color: accentColor }} />
                 )}
             </div>
             
             <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                 {/* Título con efecto hover */}
                 <h4 className="font-bold text-slate-800 truncate text-lg tracking-tight group-hover:text-slate-900 transition-colors">
                    {title || "Título del recurso..."}
                 </h4>
                 
                 {/* Subtítulo / Link */}
                 <p className="text-sm text-slate-400 truncate font-medium flex items-center gap-1">
                    {subtitle || (isFile ? "documento.pdf" : "https://...")}
                    {!isFile && <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                 </p>
                 
                 {/* Badge de Categoría con estilo Soft */}
                 <div className="pt-2 flex items-center">
                    {category ? (
                        <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors duration-300"
                            style={{ 
                                backgroundColor: `${accentColor}10`, // 10% opacidad
                                color: accentColor,
                                borderColor: `${accentColor}20` 
                            }}
                        >
                            {category}
                        </span>
                    ) : (
                        <span className="inline-block h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                    )}
                 </div>
             </div>
          </div>
      </div>
    </div>
  )
}