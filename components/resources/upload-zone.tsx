'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileType, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      onFileSelect(file) // Solo notificamos al padre, no hacemos nada más
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  })

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
        <div className="p-4 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
           <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-slate-700">
            {isDragActive ? "Suelta el archivo aquí" : "Haz clic o arrastra un archivo"}
          </h3>
          <p className="text-sm text-slate-500">
            PDF, Word, Excel, Imágenes (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  )
}