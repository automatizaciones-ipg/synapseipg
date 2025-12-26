import { getWorkgroups } from "@/actions/groups" // <--- CAMBIO 1: Importar la función correcta
import GroupsView from "@/components/groups/groups-view"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function GroupsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  // CAMBIO 2: Usar getWorkgroups y manejar su respuesta
  // La función ahora devuelve { success: boolean, data?: GroupData[], ... }
  const result = await getWorkgroups()
  
  // Extraemos la data de forma segura. Si falla, pasamos array vacío.
  const groups = result.success && result.data ? result.data : []

  return (
    <div className="h-full w-full">
      <GroupsView initialGroups={groups} userEmail={user.email || ''} />
    </div>
  )
}