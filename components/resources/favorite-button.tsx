'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
// Importamos la acción de guardar y la DE VERIFICACIÓN
import { toggleFavorite } from "@/actions/resources"
import { getIsFavoriteRealtime } from "@/actions/check-status"

interface FavoriteButtonProps {
  resourceId: string
  initialIsFavorite: boolean // Recibe el dato inicial del servidor
}

export function FavoriteButton({ resourceId, initialIsFavorite }: FavoriteButtonProps) {
  // Estado local
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)

  // 🔥 EFECTO DE SINCRONIZACIÓN (LA SOLUCIÓN) 🔥
  // Apenas el botón aparece, verifica en la BD si es favorito de verdad.
  // Esto arregla el problema de la caché vieja del Single Page.
  useEffect(() => {
    let mounted = true
    const checkRealStatus = async () => {
      try {
        const realStatus = await getIsFavoriteRealtime(resourceId)
        if (mounted) {
          setIsFavorite(realStatus)
        }
      } catch (error) {
        console.error("Error sincronizando favorito:", error)
      }
    }
    
    checkRealStatus()
    
    return () => { mounted = false }
  }, [resourceId])

  // Manejador del Click
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    setLoading(true)

    // Cambio optimista (visual inmediato)
    const previousState = isFavorite
    const newState = !isFavorite
    setIsFavorite(newState)

    if (newState) toast.success("Guardado en favoritos")
    else toast.info("Eliminado de favoritos")

    try {
      await toggleFavorite(resourceId)
    } catch (error) {
      // Si falla, volvemos atrás
      setIsFavorite(previousState)
      toast.error("Error al actualizar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={cn(
        "gap-2 transition-all duration-300 border shadow-sm group",
        isFavorite 
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" 
          : "border-slate-200 text-slate-500 hover:text-red-500 hover:bg-slate-50"
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : (
        <Heart className={cn("w-4 h-4 transition-transform group-active:scale-90", isFavorite && "fill-current")} />
      )}
      <span>{isFavorite ? "Guardado" : "Guardar"}</span>
    </Button>
  )
}