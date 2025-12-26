'use client'

import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Props {
  resourceId: string
  variant?: "default" | "outline" | "ghost"
  fullWidth?: boolean
}

export function ShareResourceButton({ resourceId, variant = "outline", fullWidth = false }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    // Evita error si window no está definido (SSR)
    if (typeof window === 'undefined') return
    
    const url = `${window.location.origin}/resources/${resourceId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Enlace copiado al portapapeles")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button 
      variant={variant} 
      onClick={handleShare}
      className={cn(
         "gap-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700",
         fullWidth && "w-full justify-start"
      )}
    >
      {copied ? <Check className="w-4 h-4 text-green-600"/> : <Share2 className="w-4 h-4"/>}
      {copied ? "Copiado" : "Copiar Enlace"}
    </Button>
  )
}