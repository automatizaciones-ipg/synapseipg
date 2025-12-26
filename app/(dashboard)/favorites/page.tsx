import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResourceBrowser } from "@/components/dashboard/resource-browser"
import { Resource } from "@/types"
import { Star } from "lucide-react"

export const dynamic = 'force-dynamic'

// -----------------------------------------------------------------------------
// DEFINICIONES DE TIPOS LOCALES (Para evitar importar desde 'use client')
// -----------------------------------------------------------------------------

// 1. Tipo para las Carpetas que vienen de la DB
interface FolderRow {
  id: string
  name: string
  parent_id: string | null
  user_id: string
  is_global: boolean | number // Supabase puede devolver 0/1 o false/true
  category?: string | null
  created_at: string
}

// 2. Tipo para la respuesta del Join de Favoritos
interface FavoriteRow {
  resource_id: string
  resources: Resource // Tu tipo base de recursos
}

// -----------------------------------------------------------------------------
// PÁGINA
// -----------------------------------------------------------------------------

export default async function FavoritesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ✅ Ejecución en paralelo de todas las consultas
  const [profileResult, foldersResult, favoritesResult] = await Promise.all([
    // A. Obtener Perfil (Rol)
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    
    // B. Obtener Carpetas (Silo Favorites)
    supabase.from('folders')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', 'favorites_view')
      .order('name'),

    // C. Obtener Favoritos (Con filtro de no nulos)
    supabase.from('favorites')
      .select(`
        resource_id,
        resources (
          *,
          profiles (full_name, email, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      .not('resources', 'is', null)
  ])

  // --- Procesamiento ---

  const userRole = (profileResult.data?.role as 'admin' | 'auditor') || 'auditor'
  
  // Casting seguro a nuestra interfaz local (FolderRow)
  // Esto satisface el prop 'initialFolders' de ResourceBrowser sin importar su tipo
  const favFolders = (foldersResult.data || []) as unknown as FolderRow[]
  
  // Casting seguro para favoritos
  const rawFavorites = (favoritesResult.data || []) as unknown as FavoriteRow[]

  const resources = rawFavorites.map((row) => ({
    ...row.resources,
    is_favorite: true
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
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