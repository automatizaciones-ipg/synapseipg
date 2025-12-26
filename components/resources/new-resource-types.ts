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
    color: string // Para el borde de color de la tarjeta
    is_public: boolean
  }
  
  // Props completas para el formulario, asegurando que no falte nada (Folder, Admin, AI)
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
    // Pasamos las listas de usuarios/grupos si las cargara el padre, 
    // pero como son selectores autónomos, ellos se encargan de su data.
  }
  
  export const CATEGORIES = [
    "Comunicaciones", 
    "Admisión", 
    "Inducción", 
    "Secretaría General",
    "RRHH",
    "Finanzas", 
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