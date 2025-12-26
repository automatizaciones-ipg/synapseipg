'use server'

import { createClient } from "@/lib/supabase/server"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  // Busca por email O nombre completo, limita a 5 resultados para velocidad
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url')
    .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(5)

  if (error) {
    console.error("Error searching users:", error)
    return []
  }

  return data as UserProfile[]
}