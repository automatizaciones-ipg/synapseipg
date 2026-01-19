import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Componentes UI
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { ResourceWithRelations } from "@/components/dashboard/resource-card"
// IMPORTACIÓN NUEVA: El componente visual que acabamos de crear
import { DashboardHero } from "@/app/(dashboard)/dashboard-hero" 

// Tipos
import { Resource } from "@/types"

// Lógica Centralizada
import { 
    transformToAppResource, 
    RESOURCE_DEEP_SELECT, 
    DBResourceRaw, 
    DBShareRow 
} from "@/lib/resource-logic"

export const dynamic = 'force-dynamic'
export const revalidate = 0

// =====================================================================
// 🛠️ FIX QUIRÚRGICO DE TIPOS (INTACTO)
// Definimos un tipo local que extiende el original agregando deleted_at
// =====================================================================
type ExtendedResource = DBResourceRaw & { deleted_at?: string | null }

// Helper Type Guard para filas compartidas que también pueden tener deleted_at
type ExtendedShareRow = Omit<DBShareRow, 'resources'> & { 
    resources: ExtendedResource | null 
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/login')

    // 1. Grupos (LOGICA INTACTA)
    const { data: myGroups } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
    const groupIds = myGroups?.map((g) => g.group_id) || [];

    console.log(`⚡ [SERVER] Cargando Dashboard para: ${user.email}`);

    // 2. Fetching Paralelo (LOGICA INTACTA)
    const [profileRes, ownedRes, directShareRes, groupShareRes, foldersRes, favsRes] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        
        // Mis Archivos (Filtrando eliminados)
        supabase.from('resources')
            .select(RESOURCE_DEEP_SELECT)
            .is('deleted_at', null) 
            .or(`created_by.eq.${user.id},is_public.eq.true`)
            .order('created_at', { ascending: false }),

        // Compartidos Directos (Filtrando eliminados)
        supabase.from('resource_shares')
            .select(`created_at, resources (${RESOURCE_DEEP_SELECT})`)
            .eq('user_id', user.id)
            .is('resources.deleted_at', null),

        // Compartidos por Grupo (Filtrando eliminados)
        groupIds.length > 0 
            ? supabase.from('resource_group_shares')
                .select(`created_at, resources (${RESOURCE_DEEP_SELECT})`)
                .in('group_id', groupIds)
                .is('resources.deleted_at', null)
            : Promise.resolve({ data: [], error: null }),

        // Carpetas
        supabase.from('folders').select('*').order('name'),
        
        // Favoritos
        supabase.from('favorites').select('resource_id').eq('user_id', user.id)
    ]);

    const userRole = (profileRes.data?.role as 'admin' | 'auditor') || 'auditor'

    // --- PROCESAMIENTO DE RECURSOS (LOGICA INTACTA) ---
    const resourceMap = new Map<string, ResourceWithRelations>();

    // Usamos 'unknown' como paso intermedio para aplicar nuestro tipo corregido 'ExtendedResource'
    const safeInsert = (list: unknown[] | null, isShared: boolean) => {
        if (!list) return;

        list.forEach((item) => {
            if (!item) return;
            
            let rawResource: ExtendedResource | null = null;

            // Lógica de extracción segura tipada
            if (typeof item === 'object' && item !== null && 'resources' in item) {
                rawResource = (item as ExtendedShareRow).resources;
            } else {
                rawResource = item as ExtendedResource;
            }

            // Validaciones
            if (!rawResource || !rawResource.id) return;
            
            // TypeScript sabe que 'deleted_at' es una propiedad válida opcional
            if (rawResource.deleted_at) return;

            if (resourceMap.has(rawResource.id)) return;
            
            const appRes = transformToAppResource(rawResource, user.id, isShared);
            resourceMap.set(appRes.id, appRes);
        });
    };

    safeInsert(ownedRes.data as unknown[], false);
    safeInsert(directShareRes.data as unknown[], true);
    safeInsert(groupShareRes.data as unknown[], true);

    const favSet = new Set((favsRes.data || []).map((f) => f.resource_id));
    
    const finalResources = Array.from(resourceMap.values()).map((r) => ({
        ...r,
        is_favorite: favSet.has(r.id)
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // --- FILTRADO DE CARPETAS (LOGICA INTACTA) ---
    const rawFolders = (foldersRes.data || []) as FolderType[];
    
    // 🔥 CORRECCIÓN CRÍTICA DE VISIBILIDAD MANTENIDA 🔥
    const validFolders = rawFolders.filter((f) => {
        // 1. Filtramos SIEMPRE las carpetas de sistema (vistas técnicas)
        if (['shared_view', 'favorites_view'].includes(f.category || '')) return false;

        // 2. MODO WIKI: 
        return true;
    });

    // =================================================================
    // ÚNICO CAMBIO: LA VISUALIZACIÓN
    // Envolvemos el resultado en DashboardHero para la animación de entrada
    // =================================================================
    return (
        <DashboardHero userEmail={user.email}>
            <ResourceBrowser 
                initialResources={finalResources as unknown as Resource[]} 
                initialFolders={validFolders} 
                userEmail={user.email} 
                userRole={userRole} 
                browserContext="home" 
            />
        </DashboardHero>
    )
}