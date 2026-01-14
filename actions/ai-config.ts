'use server'

import { createClient } from "@/lib/supabase/server"

export async function getAiAutoTagStatus(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('profiles')
    .select('ai_autotag')
    .eq('id', user.id)
    .single()

  // Retornamos el valor. Si es null (no existe), asumimos true por defecto o false según prefieras.
  // Dado que migramos la DB, debería existir.
  return data?.ai_autotag ?? true
}