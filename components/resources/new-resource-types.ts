// components/resources/new-resource-types.ts

// =====================================================================
// 1. TIPOS UI EXISTENTES (Para tu Formulario y Componentes)
// =====================================================================

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface GroupProfile {
  id: string
  name: string
  description?: string
  member_count?: number
}

export interface ResourceFormData {
  title: string
  description: string
  category: string
  tags: string
  color: string 
  iconType: string // Incluido para compatibilidad
  is_public: boolean
}

// Props para el formulario ResourceForm
export interface ResourceFormProps {
  formData: ResourceFormData
  setFormData: (data: ResourceFormData) => void
  selectedUsers: string[]
  setSelectedUsers: (users: string[]) => void
  selectedGroups: string[]
  setSelectedGroups: (groups: string[]) => void
  onSave: () => void
  onAI: () => void
  loading: boolean
  aiLoading: boolean
  isFile?: boolean
  selectedFolderId: string | null
  setSelectedFolderId: (id: string | null) => void
  selectedFolderName: string | null
  setSelectedFolderName: (name: string | null) => void
  isAdmin: boolean
}

// Constantes globales
export const CATEGORIES = [
  "Comunicaciones", 
  "Admisión", 
  "Secretaría General",
  "Gestión de Personas",
  "Asuntos Académicos", 
  "Asuntos Económicos & Administrativos",
  "Desarrollo",
  "Otros"
]

export const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
  'text/plain': ['.txt']
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// =====================================================================
// 2. NUEVOS TIPOS PARA LA ARQUITECTURA (CQRS & VISTAS SQL)
// =====================================================================

// Payload para guardar (Usado en actions/resources.ts -> saveResource)
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
  shared_with?: string[]   
  shared_groups?: string[] 
  folder_id?: string | null 
  folderId?: string | null // Retrocompatibilidad
  is_public?: boolean 
}

// ✅ ESTA ES LA INTERFAZ CRÍTICA QUE FALTABA
// Asegúrate de copiar hasta el final del archivo
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
  
  // Campos enriquecidos por SQL View
  author_name: string | null
  author_avatar: string | null
  author_email: string | null
  
  // Razón de acceso
  access_reason: 'OWNER' | 'PUBLIC' | 'SHARED_USER' | 'SHARED_GROUP'
}