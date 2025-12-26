import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { Resource } from "@/types"
import { Share2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SharedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userRole = (profile?.role as 'admin' | 'auditor') || 'auditor'

  // --- 1. RECURSOS COMPARTIDOS (Lógica existente) ---
  const { data: myGroups } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  const myGroupIds = myGroups?.map(g => g.group_id) || []

  const [directSharesResult, groupSharesResult] = await Promise.all([
    supabase
      .from('resource_shares')
      .select(`created_at, resources (*, profiles (full_name, email, avatar_url))`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    myGroupIds.length > 0 
      ? supabase.from('resource_group_shares')
          .select(`created_at, resources (*, profiles (full_name, email, avatar_url))`)
          .in('group_id', myGroupIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null })
  ])

  // --- 2. CARPETAS DE "COMPARTIDOS" (SILO) ---
  // Solo traemos carpetas creadas por el usuario bajo la etiqueta 'shared_view'
  const { data: sharedFolders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .eq('category', 'shared_view') // 👈 CLAVE DEL SILO
    .order('name')

  // --- 3. UNIFICACIÓN ---
  const resourceMap = new Map<string, Resource>()
  type ShareRow = { created_at: string; resources: Resource | null }

  const processShares = (data: ShareRow[]) => {
    data.forEach((item) => {
      if (item.resources && !resourceMap.has(item.resources.id)) {
        resourceMap.set(item.resources.id, { ...item.resources, is_shared_with_me: true })
      }
    })
  }

  processShares((directSharesResult.data || []) as unknown as ShareRow[])
  processShares((groupSharesResult.data || []) as unknown as ShareRow[])

  const resources = Array.from(resourceMap.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <Share2 className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compartidos conmigo</h1>
            <p className="text-slate-500">Recursos compartidos contigo y carpetas de organización personal.</p>
        </div>
      </div>

      <ResourceBrowser 
        initialResources={resources} 
        initialFolders={(sharedFolders || []) as FolderType[]} 
        userEmail={user.email} 
        userRole={userRole} 
        browserContext="shared" 
      />
    </div>
  )
}