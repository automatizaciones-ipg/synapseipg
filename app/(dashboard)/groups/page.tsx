import { getWorkgroups } from "@/actions/groups"
// ⚠️ VERIFICAR RUTA: Asegúrate que coincida con donde guardaste el archivo anterior.
// Si lo guardaste en 'components/dashboard', usa esta línea:
import GroupsView from "@/components/groups/groups-view" 
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Obligamos a que esta página se renderice en cada petición (datos frescos siempre)
export const dynamic = 'force-dynamic'

export default async function GroupsPage() {
  // Inicializamos cliente
  const supabase = await createClient()
  
  // Verificamos sesión
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    redirect('/login')
  }

  // Obtenemos los grupos de forma segura
  const result = await getWorkgroups()
  
  // Extraemos la data. Si hay error en DB, mostramos array vacío para no romper la UI
  const groups = result.success && result.data ? result.data : []

  return (
    // Añadimos 'flex-1' para asegurar que ocupe el espacio en layouts flex
    <div className="h-full w-full flex-1">
      <GroupsView 
        initialGroups={groups} 
        userEmail={user.email || ''} 
      />
    </div>
  )
}