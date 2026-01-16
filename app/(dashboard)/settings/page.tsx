import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsView } from "./settings-view"
import { Settings } from "lucide-react"

// Importamos el tipo para asegurar que pasamos lo correcto
import { UserProfile } from "@/types/settings"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  // 1. Obtener Usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Obtener Perfil Completo
  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, bio, theme, email_notifications, ai_autotag') 
    .eq('id', user.id)
    .single()

  // Convertimos al tipo UserProfile
  const profile: UserProfile = {
      id: user.id,
      email: user.email || "",
      role: 'auditor', 
      full_name: rawProfile?.full_name || "",
      avatar_url: rawProfile?.avatar_url || "",
      bio: rawProfile?.bio || "",
      
      // --- CAMBIO CRÍTICO AQUÍ ---
      // Si es null, forzamos 'light'. Nunca 'system'.
      theme: rawProfile?.theme || 'light', 
      
      email_notifications: rawProfile?.email_notifications ?? true,
      ai_autotag: rawProfile?.ai_autotag ?? true
  }

  // 3. CALCULAR ALMACENAMIENTO REAL
  const { data: files } = await supabase
    .from('resources')
    .select('file_size')
    .eq('created_by', user.id)
    .gt('file_size', 0)
    .is('deleted_at', null)

  const totalBytesUsed = files?.reduce((acc, curr) => acc + (curr.file_size || 0), 0) || 0

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-100 rounded-xl text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Settings className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración</h1>
            <p className="text-slate-500 dark:text-slate-400">Administra tu cuenta, preferencias y sistema.</p>
        </div>
      </div>

      <SettingsView 
        user={{ email: user.email || "", id: user.id }} 
        profile={profile}
        storageUsed={totalBytesUsed} 
      />
    </div>
  )
}