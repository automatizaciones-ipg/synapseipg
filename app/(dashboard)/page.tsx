import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Componentes UI
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { ResourceWithRelations } from "@/components/dashboard/resource-card"
import { DashboardHero, GlobalResource } from "@/app/(dashboard)/dashboard-hero" 

// Tipos Globales
import { Resource } from "@/types"

// Actions (Arquitectura Limpia)
import { 
    getPublicFeedForDashboard,  // <--- NUEVO IMPORT
    DashboardPublicResource     // <--- NUEVO TIPO
} from "@/actions/resources"

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
// 1. DEFINICIONES DE TIPO ESTRICTAS (ZERO ANY)
// =====================================================================

// (Nota: Eliminamos interfaces manuales de PublicFeedRow porque ahora las importamos del action)

type ExtendedResource = DBResourceRaw & { deleted_at?: string | null }
type ExtendedShareRow = Omit<DBShareRow, 'resources'> & { resources: ExtendedResource | null }

// =====================================================================
// 2. TYPE GUARDS & HELPERS
// =====================================================================

function isShareRow(item: unknown): item is ExtendedShareRow {
    return (typeof item === 'object' && item !== null && 'resources' in item);
}

function isResourceRow(item: unknown): item is ExtendedResource {
    return (typeof item === 'object' && item !== null && 'id' in item && !('resources' in item));
}

// Ajustado para leer file_type
const getVisualType = (fileType: string | null): GlobalResource['type'] => {
    const t = (fileType || '').toLowerCase();
    if (t === 'link') return 'OTHER'; // O 'LINK' si tienes icono específico
    if (t.includes('pdf')) return 'PDF';
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return 'IMG';
    if (t.includes('doc') || t.includes('word') || t.includes('sheet')) return 'DOC';
    return 'OTHER';
};

const getTimeAgo = (dateStr: string): string => {
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'hace instantes';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return `hace ${Math.floor(diff / 86400)} d`;
};

// =====================================================================
// 3. PAGE COMPONENT
// =====================================================================

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/login')

    // --- A. Obtener Grupos ---
    const { data: myGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);
        
    const groupIds = myGroups?.map((g) => g.group_id) || [];

    // --- B. Ejecución Paralela de Consultas ---
    const [
        profileRes, 
        ownedRes, 
        directShareRes, 
        groupShareRes, 
        foldersRes, 
        favsRes, 
        publicFeedData // <--- Variable limpia, viene directa del Action
    ] = await Promise.all([
        // 1. Rol
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        
        // 2. Mis Archivos
        supabase.from('resources')
            .select(RESOURCE_DEEP_SELECT)
            .is('deleted_at', null) 
            .or(`created_by.eq.${user.id},is_public.eq.true`)
            .order('created_at', { ascending: false })
            .returns<ExtendedResource[]>(),

        // 3. Compartidos Directos
        supabase.from('resource_shares')
            .select(`created_at, resources (${RESOURCE_DEEP_SELECT})`)
            .eq('user_id', user.id)
            .is('resources.deleted_at', null)
            .returns<ExtendedShareRow[]>(),

        // 4. Compartidos por Grupo
        groupIds.length > 0 
            ? supabase.from('resource_group_shares')
                .select(`created_at, resources (${RESOURCE_DEEP_SELECT})`)
                .in('group_id', groupIds)
                .is('resources.deleted_at', null)
                .returns<ExtendedShareRow[]>()
            : Promise.resolve({ data: [] as ExtendedShareRow[], error: null }),

        // 5. Carpetas
        supabase.from('folders').select('*').order('name').returns<FolderType[]>(),
        
        // 6. Favoritos
        supabase.from('favorites').select('resource_id').eq('user_id', user.id),

        // 7. 🔥 Feed Público: Usamos tu nueva arquitectura segura 🔥
        getPublicFeedForDashboard(5)
    ]);

    const userRole = (profileRes.data?.role as 'admin' | 'auditor') || 'auditor';

    // --- C. Unificación de Recursos (Tu lógica original intacta) ---
    const resourceMap = new Map<string, ResourceWithRelations>();

    const processResourceList = (list: (ExtendedResource | ExtendedShareRow)[] | null, isShared: boolean) => {
        if (!list) return;
        for (const item of list) {
            let rawResource: ExtendedResource | null = null;
            if (isShareRow(item)) rawResource = item.resources;
            else if (isResourceRow(item)) rawResource = item;

            if (!rawResource || !rawResource.id) continue;
            if (rawResource.deleted_at) continue;
            if (resourceMap.has(rawResource.id)) continue;
            
            const appRes = transformToAppResource(rawResource, user.id, isShared);
            resourceMap.set(appRes.id, appRes);
        }
    };

    processResourceList(ownedRes.data, false);
    processResourceList(directShareRes.data, true);
    
    // SOLUCIÓN FINAL: Casting explícito. 
    // Le decimos a TS: "Tranquilo, esto es una lista de filas compartidas o null".
    // Esto funciona tanto para la respuesta de Supabase como para nuestro objeto fallback vacío.
    processResourceList((groupShareRes.data as ExtendedShareRow[] | null), true);

    // --- D. Favoritos ---
    const favSet = new Set((favsRes.data || []).map((f) => f.resource_id));
    
    const finalResources: Resource[] = Array.from(resourceMap.values()).map((r) => ({
        ...r,
        is_favorite: favSet.has(r.id)
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as unknown as Resource[]; 

    // --- E. Filtrado de Carpetas ---
    const validFolders = (foldersRes.data || []).filter((f) => {
        return !['shared_view', 'favorites_view'].includes(f.category || '');
    });

    // --- F. Preparación Datos Hero (Ahora 100% Typado y Seguro) ---
    // publicFeedData es DashboardPublicResource[] garantizado
    const heroResources: GlobalResource[] = publicFeedData.map((r) => ({
        id: r.id,
        title: r.title,
        type: getVisualType(r.file_type), // <--- Usamos file_type de la DB
        author: r.profiles?.full_name || 'Sistema',
        timeAgo: getTimeAgo(r.created_at)
    }));

    return (
        <DashboardHero 
            userEmail={user.email}
            recentResources={heroResources}
        >
            <ResourceBrowser 
                initialResources={finalResources} 
                initialFolders={validFolders} 
                userEmail={user.email} 
                userRole={userRole} 
                browserContext="home" 
            />
        </DashboardHero>
    )
}