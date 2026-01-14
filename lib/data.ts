import { SupabaseClient } from "@supabase/supabase-js"
import { ResourceWithRelations, ResourceProfile, ResourceShareRelation } from "@/components/dashboard/resource-card"

// --- 1. DEFINICIONES DE TIPOS DE LA BASE DE DATOS (RAW) ---
// Representación exacta de lo que devuelve Supabase

interface DBProfile {
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface DBShare {
  user_id: string
  profiles: DBProfile | DBProfile[] | null
}

// Estructura cruda del Recurso en DB
interface DBResource {
  id: string
  title: string
  description: string | null
  url: string
  type: 'link' | 'file'
  file_type?: string | null
  file_url?: string | null
  file_path?: string | null
  file_size?: number | null
  category: string | null
  tags: string[] | null
  created_at: string
  updated_at: string | null // Puede ser null en DB, lo manejamos en el map
  user_id: string        
  created_by?: string    
  folder_id: string | null
  is_public: boolean
  
  // Relaciones (Joins de Supabase)
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
  
  // Ejecutamos las 3 consultas en paralelo para mayor velocidad
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

  // Manejo de error temprano
  if (resourcesRes.error) throw new Error(resourcesRes.error.message)

  // CASTING SEGURO: Convertimos la respuesta genérica a nuestros tipos estrictos
  const rawResources = (resourcesRes.data || []) as unknown as DBResource[]
  const rawFolders = (foldersRes.data || []) as unknown as DBFolder[]
  const favRaw = (favsRes.data || []) as unknown as DBFavorite[]
  
  // Creamos un Set para búsqueda O(1) de favoritos
  const favSet = new Set(favRaw.map(f => f.resource_id))

  // --- FILTRADO DE RECURSOS (Lógica de Negocio) ---
  const validResources = rawResources.filter((res: DBResource) => {
    // Normalizamos el ID del creador
    const creatorId = res.created_by || res.user_id;

    // 1. Es mío
    if (creatorId === userId) return true;
    
    // 2. Es Público
    if (res.is_public) return true;

    // 3. Compartido Conmigo
    const shares = res.resource_shares || [];
    const isSharedWithMe = shares.some((s: DBShare) => s.user_id === userId);
    
    return isSharedWithMe;
  })

  // --- MAPEO A FRONTEND (Transformación de Datos) ---
  const finalResources: ResourceWithRelations[] = validResources.map((res: DBResource) => {
    
    // Helper para evitar errores si profiles viene como array o null
    const normalizeProfile = (p: DBProfile | DBProfile[] | null): ResourceProfile | null => {
        if (Array.isArray(p)) return p[0] || null;
        return p;
    };

    const rawShares = res.resource_shares || [];
    const mappedShares: ResourceShareRelation[] = rawShares.map((s: DBShare) => ({
      user_id: s.user_id,
      profiles: normalizeProfile(s.profiles)
    }));

    // Determinar URL y Tipo final
    const finalUrl = res.url || res.file_url || '#';
    const finalType = res.type === 'link' ? 'link' : (res.file_type || 'file');
    
    // ID del creador seguro
    const creatorId = res.created_by || res.user_id;

    // Construcción del objeto final compatible con ResourceWithRelations
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
      
      // SOLUCIÓN CRÍTICA APLICADA:
      updated_at: res.updated_at || res.created_at, // Si no hay update, usa create
      created_by: creatorId, 
      
      folder_id: res.folder_id,
      is_public: res.is_public,
      is_favorite: favSet.has(res.id),
      profiles: normalizeProfile(res.profiles),
      resource_shares: mappedShares
    }
  })

  // --- FILTRADO DE CARPETAS ---
  const finalFolders = rawFolders.filter((f: DBFolder) => {
    if (f.category === 'Globales' || f.is_global) return true
    if (f.user_id === userId) return true
    return false
  })

  return { resources: finalResources, folders: finalFolders }
}