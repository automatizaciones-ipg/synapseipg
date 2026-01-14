import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResourceBrowser } from "@/components/dashboard/resource-browser"
import { Resource } from "@/types"
import { Star } from "lucide-react"

export const dynamic = 'force-dynamic'

// -----------------------------------------------------------------------------
// DEFINICIONES DE TIPOS LOCALES (Ajustados para Robustez de Datos)
// -----------------------------------------------------------------------------

// 1. Tipo para las Carpetas
interface FolderRow {
  id: string
  name: string
  parent_id: string | null
  user_id: string
  is_global: boolean | number 
  category?: string | null
  created_at: string
}

// 2. Tipo para la respuesta del Join de Favoritos
// ✅ MEJORA ROBUSTA: Extendemos Resource para incluir deleted_at y evitar errores de TS
interface FavoriteRow {
  resource_id: string
  resources: Resource & {
      deleted_at?: string | null // <--- CLAVE PARA EVITAR ERRORES DE TIPO
      profiles: { full_name: string | null, email: string | null, avatar_url: string | null } | null
      resource_shares: Array<{
          user_id: string
          profiles: { full_name: string | null, email: string | null, avatar_url: string | null } | null
      }>
  }
}

// -----------------------------------------------------------------------------
// PÁGINA
// -----------------------------------------------------------------------------

export default async function FavoritesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ✅ Ejecución en paralelo
  const [profileResult, foldersResult, favoritesResult] = await Promise.all([
    // A. Obtener Perfil
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    
    // B. Obtener Carpetas (Silo Favorites)
    supabase.from('folders')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', 'favorites_view')
      .order('name'),

    // C. Obtener Favoritos (Query Mejorada con Filtro de Eliminados)
    supabase.from('favorites')
      .select(`
        resource_id,
        resources!inner (  
          *,
          profiles (full_name, email, avatar_url),
          resource_shares (
             user_id,
             profiles (full_name, email, avatar_url)
          )
        )
      `)
      .eq('user_id', user.id)
      .not('resources', 'is', null)     // Seguridad extra
      .is('resources.deleted_at', null) // 👈 FILTRO OBLIGATORIO: No traer eliminados
  ])

  // --- Procesamiento ---

  const userRole = (profileResult.data?.role as 'admin' | 'auditor') || 'auditor'
  
  // Casting seguro a nuestra interfaz local
  const favFolders = (foldersResult.data || []) as unknown as FolderRow[]
  
  // Casting seguro para favoritos usando la interfaz robusta
  const rawFavorites = (favoritesResult.data || []) as unknown as FavoriteRow[]

  // Mapeo para aplanar la estructura y garantizar is_favorite = true
  const resources = rawFavorites.map((row) => ({
    ...row.resources,
    is_favorite: true // ✅ Forzamos true
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
            <Star className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Favoritos</h1>
            <p className="text-slate-500">Tus recursos destacados y carpetas de organización rápida.</p>
        </div>
      </div>

      <ResourceBrowser 
        initialResources={resources} 
        initialFolders={favFolders} 
        userEmail={user.email} 
        userRole={userRole} 
        browserContext="favorites" 
      />
    </div>
  )
}