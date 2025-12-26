// Tipos SOLO para UI / cliente

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
  