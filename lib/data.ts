import { SupabaseClient } from "@supabase/supabase-js"
import { ResourceWithRelations, ResourceProfile, ResourceShareRelation } from "@/components/dashboard/resource-card"

// --- 1. DEFINICIONES DE TIPOS DE LA BASE DE DATOS (RAW) ---
// Estos tipos representan exactamente cómo viene la data de Supabase antes de procesarla.

interface DBProfile {
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface DBShare {
  user_id: string
  profiles: DBProfile | DBProfile[] | null // Supabase puede devolver array o single en joins
}

// Estructura cruda del Recurso en DB
interface DBResource {
  id: string
  title: string
  description: string | null
  url: string
  type: 'link' | 'file' // Ajusta según tus valores reales en DB
  file_type?: string | null
  file_url?: string | null
  file_path?: string | null
  file_size?: number | null
  category: string | null
  tags: string[] | null
  created_at: string
  user_id: string        // O created_by, revisa tu columna real
  created_by?: string    // A veces se llama así
  folder_id: string | null
  is_public: boolean
  
  // Relaciones
  profiles: DBProfile | DBProfile[] | null
  resource_shares: DBShare[] | null
}

// Estructura cruda de la Carpeta en DB
interface DBFolder {
  id: string
  name: string
  parent_id: string | null
  user_id: string
  is_global: boolean
  category: string | null
  created_at: string
}

interface DBFavorite {
  resource_id: string
}

// --- 2. FUNCIÓN DE DATOS ---

export async function getDashboardData(supabase: SupabaseClient, userId: string) {
  
  const [resourcesRes, foldersRes, favsRes] = await Promise.all([
    supabase
      .from('resources')
      .select(`
        *,
        profiles:created_by (full_name, email, avatar_url),
        resource_shares (
            user_id,
            profiles (full_name, email, avatar_url)
        )
      `)
      .order('created_at', { ascending: false }),

    supabase.from('folders').select('*').order('name'),
    supabase.from('favorites').select('resource_id').eq('user_id', userId)
  ])

  if (resourcesRes.error) throw new Error(resourcesRes.error.message)

  // CASTING SEGURO: Usamos 'unknown' como paso intermedio para evitar el error de linter.
  // Esto le dice a TS: "Confía en mí, la data tiene esta forma".
  const rawResources = (resourcesRes.data || []) as unknown as DBResource[]
  const rawFolders = (foldersRes.data || []) as unknown as DBFolder[]
  const favRaw = (favsRes.data || []) as unknown as DBFavorite[]
  
  const favSet = new Set(favRaw.map(f => f.resource_id))

  // --- FILTRADO DE RECURSOS ---
  // Aquí es donde tenías el error. Ahora 'res' está tipado explícitamente.
  const validResources = rawResources.filter((res: DBResource) => {
    // Normalizamos el ID del creador (maneja user_id o created_by)
    const creatorId = res.created_by || res.user_id;

    // A. Es mío
    if (creatorId === userId) return true;
    
    // B. Es Público
    if (res.is_public) return true;

    // C. Compartido Conmigo
    const shares = res.resource_shares || [];
    // 's' ahora es DBShare, no any
    const isSharedWithMe = shares.some((s: DBShare) => s.user_id === userId);
    
    return isSharedWithMe;
  })

  // --- MAPEO A FRONTEND ---
  const finalResources: ResourceWithRelations[] = validResources.map((res: DBResource) => {
    // Helper para normalizar perfil (array o objeto)
    const normalizeProfile = (p: DBProfile | DBProfile[] | null): ResourceProfile | null => {
        if (Array.isArray(p)) return p[0] || null;
        return p;
    };

    const rawShares = res.resource_shares || [];
    const mappedShares: ResourceShareRelation[] = rawShares.map((s: DBShare) => ({
      user_id: s.user_id,
      profiles: normalizeProfile(s.profiles)
    }));

    // Determinar URL final (prioridad link o file_url)
    const finalUrl = res.url || res.file_url || '#';
    const finalType = res.type === 'link' ? 'link' : (res.file_type || 'file');

    return {
      id: res.id,
      title: res.title,
      description: res.description,
      file_url: finalUrl, 
      file_type: finalType,
      file_path: res.file_path || null, 
      file_size: res.file_size || 0, 
      category: res.category || 'General',
      tags: res.tags,
      created_at: res.created_at,
      folder_id: res.folder_id,
      is_public: res.is_public,
      is_favorite: favSet.has(res.id),
      profiles: normalizeProfile(res.profiles),
      resource_shares: mappedShares
    }
  })

  // --- FILTRADO DE CARPETAS ---
  // Ahora 'f' es DBFolder, no any
  const finalFolders = rawFolders.filter((f: DBFolder) => {
    if (f.category === 'Globales' || f.is_global) return true
    if (f.user_id === userId) return true
    return false
  })

  return { resources: finalResources, folders: finalFolders }
}