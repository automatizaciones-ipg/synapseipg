import { Dispatch, SetStateAction } from 'react'

export const CATEGORIES = [
  'Globales', 
  'Comunicaciones', 
  'Admisión', 
  'Secretaría General', 
  'Gestión de Personas', 
  'Asuntos Académicos', 
  'Asuntos Económicos', 
  'Desarrollo'
] as const

export type CategoryType = typeof CATEGORIES[number] | string

export interface ShareEntity {
  id: string
  label?: string
  name?: string
  image?: string
  // Usamos 'unknown' para satisfacer la regla 'no-explicit-any'
  [key: string]: unknown 
}

export interface ResourceFormData {
  title: string           
  description: string     
  category: string        
  tags: string            
  folder_id: string | null
  
  is_public?: boolean
  color?: string
  
  file_url?: string | null
  file_path?: string | null
  file_type?: string | null
  file_size?: number
  image_url?: string | null
  ai_summary?: string | null
  dominant_color?: string
  link?: string           
}

export interface ResourceFormProps {
  formData: ResourceFormData
  setFormData: Dispatch<SetStateAction<ResourceFormData>>
  
  selectedUsers: ShareEntity[]
  setSelectedUsers: (users: ShareEntity[]) => void 
  selectedGroups: ShareEntity[]
  setSelectedGroups: (groups: ShareEntity[]) => void 
  
  onSave: () => void
  onAI: () => void
  loading: boolean
  aiLoading: boolean
  isFile?: boolean
  isAdmin: boolean
  
  selectedFolderId: string | null
  setSelectedFolderId: (id: string | null) => void
  selectedFolderName: string
  setSelectedFolderName: (name: string) => void
}