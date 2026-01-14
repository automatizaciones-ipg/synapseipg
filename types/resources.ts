// Tipos para UI / Cliente (Tus existentes)
export interface ResourceFormData {
  title: string
  description: string
  category: string
  tags: string
  color: string
  iconType: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface GroupProfile {
  id: string
  name: string
  description?: string
  member_count?: number
  preview_emails?: string[]
}

// --- NUEVOS TIPOS PARA LA ARQUITECTURA ---

// 1. Payload para guardar (Usado en saveResource)
export interface ResourceData {
  title: string
  description: string
  category: string
  tags: string[]
  file_url?: string | null
  file_path?: string | null
  file_type?: string | null
  file_size?: number
  link?: string | null 
  color: string 
  shared_with?: string[]   // IDs de usuarios individuales
  shared_groups?: string[] // IDs de grupos
  folder_id?: string | null 
  folderId?: string | null // Compatibilidad
  is_public?: boolean 
}

// 2. Recurso devuelto por la VISTA SQL (Usado en getFilesForView y UI de Grillas)
export interface LibraryResource {
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
  updated_at: string
  created_by: string
  is_public: boolean
  folder_id: string | null
  dominant_color: string | null
  
  // Campos enriquecidos por la Vista v_library_access
  author_name: string | null
  author_avatar: string | null
  author_email: string | null
  
  // Razón de acceso (Crucial para separar pestañas)
  access_reason: 'OWNER' | 'PUBLIC' | 'SHARED_USER' | 'SHARED_GROUP'
}