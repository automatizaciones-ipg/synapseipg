// types/index.ts

export interface Profile {
  full_name: string | null
  email: string | null
  avatar_url?: string | null
}

export interface Resource {
  id: string
  title: string
  description: string | null
  category: string
  tags: string[] | null
  file_url: string | null
  file_path: string | null
  file_type: string | null
  file_size: number | null
  created_at: string 
  updated_at: string // ✅ Agregamos fecha de edición
  profiles: Profile | null,
  folder_id: string | null

  // ✅ NUEVO: Necesario para mostrar la lista de "Miembros con acceso"
  resource_shares?: {
    user_id: string
    profiles: Profile | null
  }[] | null
  
  // ✅ LÓGICA DE FASE 6
  is_favorite?: boolean // ¿Lo tengo guardado?
  is_shared_with_me?: boolean // ¿Me lo compartieron? (Futuro)
}

export interface SearchParamsProps {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}