import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center min-h-[50vh] animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-400 font-medium animate-pulse">Cargando contenido...</p>
      </div>
    </div>
  )
}