import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Share2 } from "lucide-react"

// Componentes UI
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { Resource } from "@/types"

// ✅ IMPORTAMOS LA LÓGICA CENTRALIZADA (Para mantener coherencia con Home)
import { 
    transformToAppResource, 
    RESOURCE_DEEP_SELECT, 
    DBShareRow 
} from "@/lib/resource-logic"

export const dynamic = 'force-dynamic'

// =====================================================================
// DEFINICIONES DE TIPOS LOCALES (Para evitar el 'any' y errores de TS)
// =====================================================================

// Interfaz para extender la lógica y evitar errores de 'deleted_at'
interface ExtendedShareRow extends Omit<DBShareRow, 'resources'> {
    resources: (DBShareRow['resources'] & { deleted_at?: string | null }) | null
}

// =====================================================================
// PAGE COMPONENT
// =====================================================================

export default async function SharedPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Obtener Grupos del usuario (Para traer también lo compartido a mis grupos)
  const { data: myGroups } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
  const groupIds = myGroups?.map((g) => g.group_id) || [];

  // 2. Fetching Paralelo (Directo a Tablas = Cero Errores de Vistas)
  const [directShareRes, groupShareRes, sharedFoldersRes, profileRes, favsRes] = await Promise.all([
      
      // A. Compartidos Directamente conmigo
      supabase.from('resource_shares')
          .select(`created_at, resources!inner (${RESOURCE_DEEP_SELECT})`) // !inner asegura que exista el recurso
          .eq('user_id', user.id)
          .is('resources.deleted_at', null), // ✅ FILTRO NATIVO QUE FUNCIONA

      // B. Compartidos a mis Grupos
      groupIds.length > 0 
          ? supabase.from('resource_group_shares')
              .select(`created_at, resources!inner (${RESOURCE_DEEP_SELECT})`)
              .in('group_id', groupIds)
              .is('resources.deleted_at', null) // ✅ FILTRO NATIVO QUE FUNCIONA
          : Promise.resolve({ data: [], error: null }),

      // C. Carpetas de la vista "Shared"
      supabase.from('folders')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', 'shared_view')
        .order('name'),

      // D. Datos auxiliares
      supabase.from('profiles').select('role').eq('id', user.id).single(),
      supabase.from('favorites').select('resource_id').eq('user_id', user.id)
  ])

  // 3. Procesamiento y Unificación
  const userRole = (profileRes.data?.role as 'admin' | 'auditor') || 'auditor'
  const favSet = new Set((favsRes.data || []).map(f => f.resource_id))
  
  // Mapa para deduplicar (por si algo se compartió directo Y por grupo a la vez)
  const resourceMap = new Map<string, Resource>();

  const processList = (list: unknown[]) => {
      if (!list) return;
      list.forEach((item) => {
          // Casting seguro con nuestra interfaz extendida
          const row = item as ExtendedShareRow;
          
          if (!row.resources || !row.resources.id) return;
          // Doble chequeo de seguridad
          if (row.resources.deleted_at) return;

          // Transformamos usando tu lógica central
          const appRes = transformToAppResource(row.resources, user.id, true); // true = isShared
          
          // Agregamos estado de favorito
          appRes.is_favorite = favSet.has(appRes.id);

          // Guardamos en el mapa (el último gana o se mantiene, evita duplicados)
          if (!resourceMap.has(appRes.id)) {
              resourceMap.set(appRes.id, appRes);
          }
      });
  };

  processList(directShareRes.data || []);
  processList(groupShareRes.data || []);

  // Convertimos a array y ordenamos por fecha (del recurso o del share, aquí usamos created_at del recurso)
  const finalResources = Array.from(resourceMap.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


  // 4. Renderizado
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
            <Share2 className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compartidos conmigo</h1>
            <p className="text-slate-500">Recursos compartidos contigo y carpetas de organización personal.</p>
        </div>
      </div>

      <ResourceBrowser 
        initialResources={finalResources} 
        initialFolders={(sharedFoldersRes.data || []) as FolderType[]} 
        userEmail={user.email} 
        userRole={userRole} 
        browserContext="shared" 
      />
    </div>
  )
}