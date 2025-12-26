import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ResourceBrowser, FolderType } from "@/components/dashboard/resource-browser"
import { FolderOpen } from "lucide-react"
import { Resource } from "@/types"
import { ResourceWithRelations, ResourceProfile, ResourceShareRelation } from "@/components/dashboard/resource-card"

export const dynamic = 'force-dynamic'
export const revalidate = 0

// =====================================================================
// 1. DEFINICIONES DE TIPOS (DB -> APP ADAPTERS)
// =====================================================================

// Representación cruda de la respuesta de Supabase
interface DBResourceRaw {
    id: string
    title: string
    description: string | null
    url: string | null     
    file_url?: string | null
    file_type: string | null
    file_path: string | null
    file_size: number | null
    category: string | null
    tags: string[] | null
    created_at: string
    updated_at: string      
    is_public: boolean
    folder_id: string | null
    created_by: string 
    // Relaciones
    profiles: ResourceProfile | ResourceProfile[] | null 
    resource_shares: { 
        user_id: string
        profiles: ResourceProfile | ResourceProfile[] | null
    }[] | null 
}

interface DBShareRow {
    created_at: string
    resources: DBResourceRaw | null
}

// =====================================================================
// 2. HELPERS DE TRANSFORMACIÓN (SINGLE RESPONSIBILITY)
// =====================================================================

/**
 * Normaliza el perfil ya que Supabase puede devolver un array o un objeto
 */
const normalizeProfile = (p: ResourceProfile | ResourceProfile[] | null): ResourceProfile | null => {
    if (Array.isArray(p)) return p[0] || null;
    return p || null;
};

/**
 * Transforma los datos crudos de DB a la estructura limpia que necesita la UI.
 * Calcula banderas booleanas (is_shared_with_me) aquí para no ensuciar el cliente.
 */
const transformToAppResource = (
    r: DBResourceRaw, 
    currentUserId: string,
    isSharedContext: boolean // True si viene de la tabla resource_shares
): ResourceWithRelations => {
    
    // 1. Limpieza de Shares (Para mostrar caritas)
    const rawShares = r.resource_shares || [];
    const mappedShares: ResourceShareRelation[] = rawShares.map(s => ({
        user_id: s.user_id,
        profiles: normalizeProfile(s.profiles)
    })).filter(s => s.profiles !== null); // Filtramos nulos para seguridad UI

    // 2. Lógica de Negocio
    const isOwner = r.created_by === currentUserId;
    
    // Es compartido conmigo SI: Viene del contexto de shares Y NO soy el dueño
    const isSharedWithMe = isSharedContext && !isOwner;

    return {
        id: r.id,
        title: r.title,
        description: r.description,
        folder_id: r.folder_id,
        file_url: r.url || r.file_url || '#',
        file_type: r.file_type || (r.url ? 'link' : 'file'),
        file_path: r.file_path || null,
        file_size: r.file_size || 0,
        category: r.category || 'General',
        tags: r.tags || [],
        created_at: r.created_at,
        updated_at: r.updated_at || r.created_at,
        created_by: r.created_by, // ✅ AGREGADO: Soluciona el error TS(2741)
        is_public: Boolean(r.is_public),
        is_favorite: false, // Se rellena después
        is_shared_with_me: isSharedWithMe,
        profiles: normalizeProfile(r.profiles),
        resource_shares: mappedShares // ARRAY CRUCIAL PARA LAS CARITAS
    };
};

// =====================================================================
// 3. PAGE COMPONENT
// =====================================================================

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // --- QUERY SELECTOR REUTILIZABLE ---
    // Traemos resource_shares y sus perfiles anidados
    const resourceSelect = `
        *,
        profiles:created_by (full_name, email, avatar_url),
        resource_shares (
            user_id,
            profiles (full_name, email, avatar_url)
        )
    `;

    // 1. Obtener Grupos
    const { data: myGroups } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
    const groupIds = myGroups?.map(g => g.group_id) || [];

    // 2. Fetching Paralelo Optimizado
    console.log(`⚡ [SERVER] Iniciando carga de datos para: ${user.email}`);

    const [profileRes, ownedRes, directShareRes, groupShareRes, foldersRes, favsRes] = await Promise.all([
        // Perfil
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        
        // Mis Recursos (O públicos míos)
        supabase.from('resources')
            .select(resourceSelect)
            .or(`created_by.eq.${user.id},is_public.eq.true`)
            .order('created_at', { ascending: false }),

        // Compartidos Directamente conmigo
        supabase.from('resource_shares')
            .select(`created_at, resources (${resourceSelect})`)
            .eq('user_id', user.id),

        // Compartidos vía Grupo
        groupIds.length > 0 
            ? supabase.from('resource_group_shares')
                .select(`created_at, resources (${resourceSelect})`)
                .in('group_id', groupIds)
            : Promise.resolve({ data: [] as DBShareRow[], error: null }),

        // Carpetas y Favoritos
        supabase.from('folders').select('*').order('name'),
        supabase.from('favorites').select('resource_id').eq('user_id', user.id)
    ]);

    const userRole = (profileRes.data?.role as 'admin' | 'auditor') || 'auditor'

    // --- LOGS DE DIAGNÓSTICO (Server Side) ---
    if (directShareRes.error) console.error("❌ Error DirectShares:", directShareRes.error);
    
    const directSharesCount = directShareRes.data?.length || 0;
    const ownedCount = ownedRes.data?.length || 0;
    
    console.log(`📊 [STATS] Propios: ${ownedCount} | Compartidos Directos: ${directSharesCount}`);

    // --- PROCESAMIENTO Y UNIFICACIÓN ---
    const resourceMap = new Map<string, ResourceWithRelations>();

    // A. Procesar Propios (Owned)
    const ownedList = (ownedRes.data || []) as unknown as DBResourceRaw[];
    ownedList.forEach(r => {
        const appRes = transformToAppResource(r, user.id, false);
        resourceMap.set(appRes.id, appRes);
    });

    // B. Procesar Compartidos (Directos + Grupos)
    const directList = (directShareRes.data || []) as unknown as DBShareRow[];
    const groupList = (groupShareRes.data || []) as unknown as DBShareRow[];
    
    [...directList, ...groupList].forEach(row => {
        if (row.resources) {
            const appRes = transformToAppResource(row.resources, user.id, true);
            // Prioridad: Si ya existe (ej. soy dueño pero me compartieron), mantenemos la versión "Dueño"
            // pero si no existe, añadimos la versión "Compartido conmigo".
            if (!resourceMap.has(appRes.id)) {
                resourceMap.set(appRes.id, appRes);
            }
        }
    });

    // C. Aplicar Favoritos
    const favSet = new Set((favsRes.data || []).map(f => f.resource_id));
    
    const finalResources = Array.from(resourceMap.values()).map(r => ({
        ...r,
        is_favorite: favSet.has(r.id)
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // D. Filtrar Carpetas
    const rawFolders = (foldersRes.data || []) as FolderType[];
    const validFolders = rawFolders.filter((f) => {
        // Lógica de filtrado de carpetas sistema/globales
        if (['shared_view', 'favorites_view'].includes(f.category || '')) return false;
        if (f.category === 'Globales' || f.is_global) return true;
        return f.user_id === user.id;
    });

    return (
        <div className="h-full w-full space-y-6">
            <div className="flex items-center gap-3 mb-6">
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