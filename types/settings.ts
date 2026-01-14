// Definición de la estructura completa del Perfil en Base de Datos (incluyendo lo nuevo)
export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    role: 'admin' | 'auditor'
    // Nuevos campos (v2.0)
    theme: 'light' | 'dark' | 'system'
    email_notifications: boolean
    ai_autotag: boolean
  }
  
  // Esquema para la actualización (Lo que el frontend envía al action)
  // Todo es opcional (?) para permitir actualizaciones parciales (solo tema, o solo bio)
  export interface UpdateProfileSchema {
    fullName?: string
    bio?: string
    avatarUrl?: string
    theme?: 'light' | 'dark' | 'system'
    emailNotifs?: boolean
    aiAutoTag?: boolean
  }
  
  // Respuesta estandarizada del Server Action
  export interface ActionResponse {
    success: boolean
    message: string
  }