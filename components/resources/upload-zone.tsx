'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, CheckCircle2, RefreshCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFileSelect: (file: File | null) => void // Acepta null para limpiar
  selectedFile?: File | null // Recibe el estado actual
}

export function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    noClick: !!selectedFile, // Deshabilita click si ya hay archivo (usamos botones)
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  })

  // Utilidad para mostrar peso legible
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // --- VISTA 1: ARCHIVO YA SELECCIONADO ---
  if (selectedFile) {
    return (
      <div className="relative group animate-in fade-in zoom-in-95 duration-300">
        <div className="border-2 border-solid border-blue-200 bg-blue-50/50 rounded-xl p-8 text-center relative overflow-hidden">
          
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText className="w-32 h-32 text-blue-600" />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 relative z-10">
            <div className="p-3 bg-white shadow-sm rounded-full text-green-600 mb-2">
                <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-800 break-all px-4">
                {selectedFile.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 bg-white/60 py-1 px-3 rounded-full inline-block">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
               {/* Botón para cambiar archivo */}
               <button 
                 type="button"
                 onClick={open} 
                 className="flex items-center text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
               >
                 <RefreshCw className="w-3.5 h-3.5 mr-2" /> Reemplazar
               </button>

               {/* Botón para quitar archivo */}
               <button 
                 type="button"
                 onClick={(e) => {
                    e.stopPropagation()
                    onFileSelect(null) // Enviamos null al padre
                 }}
                 className="flex items-center text-xs font-semibold bg-white border border-slate-200 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm"
               >
                 <X className="w-3.5 h-3.5 mr-2" /> Quitar
               </button>
            </div>
          </div>
        </div>
        {/* Input invisible necesario para que funcione el botón Reemplazar */}
        <input {...getInputProps()} className="sr-only" /> 
      </div>
    )
  }

  // --- VISTA 2: DEFAULT (DROPZONE VACÍO) ---
  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-50 relative group",
        isDragActive ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-300",
      )}
    >
      <input {...getInputProps()} className="sr-only" /> 
      
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`p-4 rounded-full transition-transform duration-300 ${isDragActive ? 'scale-110 bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-100'}`}>
            <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className={cn("font-semibold text-lg transition-colors", isDragActive ? "text-blue-700" : "text-slate-700")}>
            {isDragActive ? "¡Suéltalo!" : "Haz clic o arrastra un archivo"}
          </h3>
          <p className="text-sm text-slate-500">
            PDF, Word, Excel, Imágenes (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  )
}