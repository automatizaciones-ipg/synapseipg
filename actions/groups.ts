'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// --- DEFINICIÓN DE TIPOS ESTRICTOS ---

// 1. Tipo para el objeto Perfil que viene de la BD (Join)
interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

// 2. Tipo para la respuesta cruda de la tabla group_members + profiles
interface GroupMemberRow {
  group_id: string
  user_id: string
  profiles: ProfileRow | null // Supabase puede devolver null si no hay match
}

// 3. Tipos exportados para tu UI (Frontend)
export interface GroupMember {
  id: string 
  email: string
  full_name?: string | null
  avatar_url: string | null
}

export interface GroupData {
  id: string
  name: string
  description: string | null
  created_at: string
  role: 'admin' // Hardcoded para permitir edición global
  member_count: number
  members: GroupMember[]
}

// --- LÓGICA DE NEGOCIO ---

export async function getWorkgroups(): Promise<{ success: boolean; data?: GroupData[]; message?: string }> {
  const supabase = await createClient()
  
  try {
    // 1. Obtener grupos tipo 'workgroup'
    const { data: groups, error: groupsError } = await supabase
      .from('groups')
      .select('id, name, description, created_at')
      .eq('type', 'workgroup')
      .order('created_at', { ascending: false })

    if (groupsError) throw new Error(groupsError.message)
    if (!groups || groups.length === 0) return { success: true, data: [] }

    // 2. Obtener miembros de estos grupos
    const groupIds = groups.map(g => g.id)
    
    // Hacemos el casting manual aquí para evitar 'any' y asegurar a TS qué estructura esperamos
    const { data: rawMembers, error: membersError } = await supabase
      .from('group_members')
      .select(`
        group_id, 
        user_id, 
        profiles ( id, email, full_name, avatar_url )
      `)
      .in('group_id', groupIds)
      
    if (membersError) throw new Error(membersError.message)

    // 3. Transformación de datos (Strict Typing)
    // Forzamos el tipo de retorno de Supabase a nuestra interfaz definida
    const membersData = (rawMembers || []) as unknown as GroupMemberRow[]

    const formattedGroups: GroupData[] = groups.map((group) => {
      // Filtrar miembros de este grupo
      const groupMembersRaw = membersData.filter((m) => m.group_id === group.id)

      // Mapear a estructura limpia
      const membersList: GroupMember[] = groupMembersRaw.map((m) => {
        // Validación estricta: si profiles es null, usamos datos fallback del user_id
        const profile = m.profiles
        
        return {
          id: profile?.id || m.user_id,
          email: profile?.email || 'Usuario desconocido',
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null
        }
      })

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        created_at: group.created_at,
        role: 'admin', // Clave: Todos son admin visualmente
        member_count: membersList.length,
        members: membersList
      }
    })

    return { success: true, data: formattedGroups }

  } catch (error) {
    console.error("Error en getWorkgroups:", error)
    return { success: false, message: "Error al cargar los grupos de trabajo." }
  }
}

export async function createWorkgroup(name: string, description: string, memberEmails: string[]) {
  const supabase = await createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id

    // 1. Crear el grupo primero (Transacción paso 1)
    const { data: group, error: createError } = await supabase
      .from('groups')
      .insert({ 
        name, 
        description, 
        type: 'workgroup', // Diferenciador clave
        created_by: currentUserId 
      })
      .select('id') // Solo necesitamos el ID
      .single()

    if (createError || !group) {
      throw new Error(createError?.message || "Error al crear el registro del grupo.")
    }

    // 2. Resolver emails a IDs
    const userIdsToAdd = new Set<string>()
    if (currentUserId) userIdsToAdd.add(currentUserId) // El creador siempre se une

    if (memberEmails.length > 0) {
       const { data: profiles } = await supabase
         .from('profiles')
         .select('id')
         .in('email', memberEmails)
       
       profiles?.forEach((p) => userIdsToAdd.add(p.id))
    }

    // 3. Insertar relaciones (Transacción paso 2)
    // Ya tenemos group.id, así que no violamos la FK
    const inserts = Array.from(userIdsToAdd).map(uid => ({ 
      group_id: group.id, 
      user_id: uid 
    }))

    if (inserts.length > 0) {
      const { error: memberError } = await supabase.from('group_members').insert(inserts)
      if (memberError) {
        // Logueamos pero no fallamos toda la request, el grupo ya se creó
        console.error("Error insertando miembros:", memberError)
      }
    }

    revalidatePath('/groups')
    return { success: true }

  } catch (error) {
    console.error("Error createWorkgroup:", error)
    return { success: false, message: error instanceof Error ? error.message : "Error desconocido" }
  }
}

export async function updateWorkgroup(groupId: string, name: string, description: string, memberEmails: string[]) {
  const supabase = await createClient()

  try {
    // 1. Update Básico
    const { error: updateError } = await supabase
      .from('groups')
      .update({ name, description })
      .eq('id', groupId)

    if (updateError) throw new Error(updateError.message)

    // 2. Actualizar Miembros (Estrategia: Borrar todo y reinsertar)
    // Gracias a DELETE CASCADE en SQL, esto es seguro, pero aquí solo borramos miembros específicos de este grupo
    await supabase.from('group_members').delete().eq('group_id', groupId)

    const userIdsToAdd = new Set<string>()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Mantener al usuario actual para no perder acceso (opcional, pero recomendado)
    if(user) userIdsToAdd.add(user.id)

    if (memberEmails.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .in('email', memberEmails)
        
      profiles?.forEach((p) => userIdsToAdd.add(p.id))
    }

    const inserts = Array.from(userIdsToAdd).map(uid => ({ 
        group_id: groupId, 
        user_id: uid 
    }))
    
    if (inserts.length > 0) {
      await supabase.from('group_members').insert(inserts)
    }

    revalidatePath('/groups')
    return { success: true }
  } catch (error) {
    console.error("Error updateWorkgroup:", error)
    return { success: false, message: "Error al actualizar el grupo." }
  }
}

export async function deleteWorkgroup(groupId: string) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase.from('groups').delete().eq('id', groupId)
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/groups')
    return { success: true }
  } catch (error) {
    console.error("Error deleteWorkgroup:", error)
    return { success: false, message: "Error al eliminar el grupo." }
  }
}