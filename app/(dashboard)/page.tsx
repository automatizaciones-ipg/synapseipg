import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FolderOpen } from "lucide-react"

// Componentes UI
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { ResourceWithRelations } from "@/components/dashboard/resource-card"

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
// 🛠️ FIX QUIRÚRGICO DE TIPOS
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

    // 1. Grupos
    const { data: myGroups } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
    const groupIds = myGroups?.map((g) => g.group_id) || [];

    console.log(`⚡ [SERVER] Cargando Dashboard para: ${user.email}`);

    // 2. Fetching Paralelo
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

    // --- PROCESAMIENTO DE RECURSOS ---
    const resourceMap = new Map<string, ResourceWithRelations>();

    // Usamos 'unknown' como paso intermedio para aplicar nuestro tipo corregido 'ExtendedResource'
    const safeInsert = (list: unknown[] | null, isShared: boolean) => {
        if (!list) return;

        list.forEach((item) => {
            if (!item) return;
            
            let rawResource: ExtendedResource | null = null;

            // Lógica de extracción segura tipada
            // Verificamos si es una fila compartida (tiene propiedad 'resources')
            if (typeof item === 'object' && item !== null && 'resources' in item) {
                rawResource = (item as ExtendedShareRow).resources;
            } else {
                // Si no, asumimos que es el recurso directo
                rawResource = item as ExtendedResource;
            }

            // Validaciones
            if (!rawResource || !rawResource.id) return;
            
            // ✅ AHORA SÍ: TypeScript sabe que 'deleted_at' es una propiedad válida opcional
            if (rawResource.deleted_at) return;

            if (resourceMap.has(rawResource.id)) return;
            
            // Transformamos (El transformador aceptará ExtendedResource porque es compatible con DBResourceRaw)
            const appRes = transformToAppResource(rawResource, user.id, isShared);
            resourceMap.set(appRes.id, appRes);
        });
    };

    // Pasamos los datos casteados a unknown primero para que safeInsert aplique la lógica estricta interna
    safeInsert(ownedRes.data as unknown[], false);
    safeInsert(directShareRes.data as unknown[], true);
    safeInsert(groupShareRes.data as unknown[], true);

    const favSet = new Set((favsRes.data || []).map((f) => f.resource_id));
    
    const finalResources = Array.from(resourceMap.values()).map((r) => ({
        ...r,
        is_favorite: favSet.has(r.id)
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // --- FILTRADO DE CARPETAS ---
    const rawFolders = (foldersRes.data || []) as FolderType[];
    
    // 🔥 CORRECCIÓN CRÍTICA DE VISIBILIDAD 🔥
    // Aquí es donde se bloqueaba la vista de carpetas ajenas.
    // Lo hemos simplificado para permitir el modo "WIKI TOTAL".
    const validFolders = rawFolders.filter((f) => {
        // 1. Filtramos SIEMPRE las carpetas de sistema (vistas técnicas)
        if (['shared_view', 'favorites_view'].includes(f.category || '')) return false;

        // 2. MODO WIKI: 
        // Si no es una carpeta de sistema, LA MOSTRAMOS.
        // No importa si es tuya o no, ni si es global o no.
        // Al mostrarse aquí, podrás verla en pantalla y, gracias al script de DB, podrás editarla/borrarla.
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
                    <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inicio</h1>
                    <p className="text-slate-500">Explorador unificado de recursos.</p>
                </div>
            </div>

            <ResourceBrowser 
                initialResources={finalResources as unknown as Resource[]} 
                initialFolders={validFolders} 
                userEmail={user.email} 
                userRole={userRole} 
                browserContext="home" 
            />
        </div>
    )
}