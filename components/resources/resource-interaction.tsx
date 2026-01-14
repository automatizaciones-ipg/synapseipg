'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Heart, Download, Loader2 } from "lucide-react"
import { toast } from "sonner" // Asumo que usas Sonner o Toaster similar
// IMPORTANTE: Importamos DESDE TU RUTA EXACTA
import { toggleFavorite, incrementView } from '@/app/resources/actions'

interface ResourceInteractionProps {
  resourceId: string
  fileUrl: string
  initialIsFavorite: boolean
  downloadsCount: number
}

export function ResourceInteraction({ 
  resourceId, 
  fileUrl, 
  initialIsFavorite,
  downloadsCount 
}: ResourceInteractionProps) {
  
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isFavLoading, setIsFavLoading] = useState(false)
  const [localDownloads, setLocalDownloads] = useState(downloadsCount)

  // --- MANEJAR FAVORITO ---
  const handleToggleFavorite = async () => {
    if (isFavLoading) return

    setIsFavLoading(true)
    // Optimistic UI: Cambiamos visualmente antes de esperar al servidor
    const previousState = isFavorite
    setIsFavorite(!isFavorite)

    try {
      await toggleFavorite(resourceId)
      toast.success(previousState ? "Eliminado de favoritos" : "Guardado en favoritos")
    } catch (error) {
      // Si falla, revertimos el cambio visual
      setIsFavorite(previousState)
      toast.error("Error al actualizar favoritos")
      console.error(error)
    } finally {
      setIsFavLoading(false)
    }
  }

  // --- MANEJAR DESCARGA ---
  const handleDownload = async () => {
    // 1. Abrir archivo
    window.open(fileUrl, '_blank')
    
    // 2. Actualizar contador visualmente
    setLocalDownloads((prev) => prev + 1)

    // 3. Llamar al action para registrar en BD (sin await bloqueante)
    try {
        await incrementView(resourceId)
    } catch (error) {
        console.error("Error registrando vista:", error)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
      {/* BOTÓN DESCARGAR */}
      <Button 
        size="lg" 
        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
        onClick={handleDownload}
      >
        <Download className="w-5 h-5" />
        Descargar Archivo
        <span className="ml-1 text-blue-100 text-xs font-normal opacity-80">
          ({localDownloads})
        </span>
      </Button>

      {/* BOTÓN FAVORITO */}
      <Button
        variant="outline"
        size="lg"
        className={`gap-2 transition-colors border-slate-200 ${
          isFavorite 
            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300" 
            : "hover:bg-slate-50 text-slate-600"
        }`}
        onClick={handleToggleFavorite}
        disabled={isFavLoading}
      >
        {isFavLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        )}
        {isFavorite ? "Guardado" : "Guardar"}
      </Button>
    </div>
  )
}