import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsView } from "./settings-view"
import { Settings } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Obtener Usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Obtener Perfil Completo (Incluyendo Bio)
  // Asegúrate de que tu tabla 'profiles' tenga la columna 'bio'.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, bio') 
    .eq('id', user.id)
    .single()

  // 3. CALCULAR ALMACENAMIENTO REAL
  // Sumamos la columna 'file_size' de todos los recursos que no sean links (file_size > 0)
  // Nota: Esto calcula el uso GENERAL del proyecto basado en los registros de recursos.
  const { data: files } = await supabase
    .from('resources')
    .select('file_size')
    .gt('file_size', 0) // Solo archivos reales

  // Sumar bytes
  const totalBytesUsed = files?.reduce((acc, curr) => acc + (curr.file_size || 0), 0) || 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <Settings className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h1>
            <p className="text-slate-500">Administra tu cuenta, preferencias y sistema.</p>
        </div>
      </div>

      <SettingsView 
        user={{ email: user.email || "", id: user.id }} 
        profile={profile || { full_name: "", avatar_url: "", bio: "" }}
        storageUsed={totalBytesUsed} // Pasamos el dato real
      />
    </div>
  )
}