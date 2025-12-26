'use server'

import { createClient } from "@/lib/supabase/server"

export async function getIsFavoriteRealtime(resourceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  // Consultamos directo a la base de datos sin caché
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .maybeSingle()

  return !!data // Devuelve true si existe
}