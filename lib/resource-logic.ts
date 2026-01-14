import { ResourceProfile, ResourceShareRelation, ResourceWithRelations } from "@/components/dashboard/resource-card"

// =====================================================================
// 1. DEFINICIONES DE TIPOS (Contrato Estricto DB)
// =====================================================================

// Representación de la respuesta profunda de Supabase
export interface DBResourceRaw {
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
    
    // Relación 1: Autor
    profiles: ResourceProfile | ResourceProfile[] | null 
    
    // Relación 2: Usuarios Individuales
    resource_shares: { 
        user_id: string
        profiles: ResourceProfile | ResourceProfile[] | null
    }[] | null 

    // Relación 3: Grupos
    resource_group_shares: {
        groups: {
            id: string
            name: string
            group_members: {
                profiles: ResourceProfile | ResourceProfile[] | null
            }[]
        } | null
    }[] | null
}

// Tipo auxiliar para filas de tablas intermedias (shares)
export interface DBShareRow {
    created_at: string
    resources: DBResourceRaw | null
}

// =====================================================================
// 2. LÓGICA DE NEGOCIO CENTRALIZADA
// =====================================================================

export const normalizeProfile = (p: ResourceProfile | ResourceProfile[] | null): ResourceProfile | null => {
    if (Array.isArray(p)) return p[0] || null;
    return p || null;
};

/**
 * Transforma DB -> APP (CEREBRO ÚNICO)
 * Aplica la lógica de "Expansión de Grupos" para pintar las caritas
 * y maneja errores de usuarios corruptos silenciosamente.
 */
export const transformToAppResource = (
    r: DBResourceRaw, 
    currentUserId: string,
    isSharedContext: boolean
): ResourceWithRelations => {
    
    // MAPA PARA DEDUPLICACIÓN VISUAL
    const uniqueSharesMap = new Map<string, ResourceShareRelation>();

    // A. Procesar Usuarios Individuales
    if (r.resource_shares && Array.isArray(r.resource_shares)) {
        r.resource_shares.forEach(s => {
            const profile = normalizeProfile(s.profiles);
            if (profile && profile.email) {
                uniqueSharesMap.set(profile.email, {
                    user_id: s.user_id,
                    profiles: profile
                });
            }
        });
    }

    // B. Procesar Miembros de Grupos (Expansión)
    const authorProfile = normalizeProfile(r.profiles);

    if (r.resource_group_shares && Array.isArray(r.resource_group_shares)) {
        r.resource_group_shares.forEach(gs => {
            if (gs.groups && gs.groups.group_members) {
                gs.groups.group_members.forEach(member => {
                    const profile = normalizeProfile(member.profiles);
                    
                    // REGLAS DE NEGOCIO:
                    // 1. El perfil debe existir y tener email.
                    // 2. No mostramos al dueño en la lista de "compartidos".
                    if (profile && profile.email && profile.email !== authorProfile?.email) {
                        if (!uniqueSharesMap.has(profile.email)) {
                            uniqueSharesMap.set(profile.email, {
                                user_id: profile.email,
                                profiles: profile
                            });
                        }
                    }
                });
            }
        });
    }

    const finalShares = Array.from(uniqueSharesMap.values());

    const isOwner = r.created_by === currentUserId;
    // Un recurso es "Compartido Conmigo" si no soy el dueño
    const isSharedWithMe = isSharedContext && !isOwner;

    return {
        id: r.id,
        title: r.title,
        description: r.description,
        folder_id: r.folder_id, // ✅ LA CARPETA MANDA
        file_url: r.url || r.file_url || '#',
        file_type: r.file_type || (r.url ? 'link' : 'file'),
        file_path: r.file_path || null,
        file_size: r.file_size || 0,
        category: r.category || 'General',
        tags: r.tags || [],
        created_at: r.created_at,
        updated_at: r.updated_at || r.created_at,
        created_by: r.created_by,
        is_public: Boolean(r.is_public),
        is_favorite: false, // Se rellena externamente si es necesario
        is_shared_with_me: isSharedWithMe,
        profiles: authorProfile,
        resource_shares: finalShares // ✅ Lista unificada
    };
};

// =====================================================================
// 3. QUERY STRING REUTILIZABLE
// =====================================================================
// Exportamos también la Query para no escribirla 2 veces
export const RESOURCE_DEEP_SELECT = `
    *,
    profiles:created_by (full_name, email, avatar_url),
    resource_shares (
        user_id,
        profiles (full_name, email, avatar_url)
    ),
    resource_group_shares (
        groups (
            id,
            name,
            group_members (
                profiles (full_name, email, avatar_url)
            )
        )
    )
`;