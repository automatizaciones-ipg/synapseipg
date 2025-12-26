import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser" 
import { Resource } from "@/types"
import { FolderOpen } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function MyResourcesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const userRole = (profile?.role as 'admin' | 'auditor') || 'auditor'

  // 1. Recursos
  const { data: resourcesRaw, error } = await supabase
    .from('resources')
    .select(`*, profiles (full_name, email, avatar_url), resource_shares (user_id, profiles (email, full_name, avatar_url))`)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) console.error("Error cargando mis recursos:", error)

  // 2. ✅ OBTENER MIS CARPETAS PERSONALES (SILO ESTRICTO)
  // Solo carpetas donde category sea NULL. 
  // Si category tiene valor (ej: 'shared_view'), pertenece a otro silo.
  const { data: foldersRaw } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)     
    .eq('is_global', false)
    .is('category', null) // 👈 ESTO ES CRUCIAL PARA EL SILO
    .order('name', { ascending: true })

  // 3. Favoritos
  const favoriteIds = new Set<string>()
  const { data: myFavorites } = await supabase.from('favorites').select('resource_id').eq('user_id', user.id)
  if (myFavorites) myFavorites.forEach(fav => favoriteIds.add(fav.resource_id))

  const resources = (resourcesRaw || []).map((res) => ({
    ...res,
    is_favorite: favoriteIds.has(res.id)
  })) as unknown as Resource[]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <FolderOpen className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Recursos</h1>
            <p className="text-slate-500">Gestión de archivos y enlaces creados por ti.</p>
        </div>
      </div>

      <ResourceBrowser 
        initialResources={resources}
        initialFolders={(foldersRaw || []) as FolderType[]}
        userEmail={user.email} 
        userRole={userRole} 
        browserContext="mine" 
      />
    </div>
  )
}