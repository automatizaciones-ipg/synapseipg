import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Trash2 } from "lucide-react"

import { TrashClient, TrashedResource } from "./trash-client"
import { 
    transformToAppResource, 
    RESOURCE_DEEP_SELECT, 
    DBResourceRaw, 
    DBShareRow 
} from "@/lib/resource-logic"

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Tipos base de base de datos
type TrashedDBResource = DBResourceRaw & { 
    deleted_at: string
    deleted_by?: string | null 
}

type TrashedShareRow = { 
    created_at: string; 
    resources: TrashedDBResource | null 
}

type TrashRowItem = TrashedDBResource | TrashedShareRow

// Capturamos el tipo de retorno de tu función transformadora para no perder propiedades
type AppResource = ReturnType<typeof transformToAppResource>

function isShareRow(item: TrashRowItem): item is TrashedShareRow {
    return (item as TrashedShareRow).resources !== undefined;
}

export default async function TrashPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/login')

    const { data: myGroups } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
    const groupIds = myGroups?.map((g) => g.group_id) || [];

    const SELECT_QUERY = `${RESOURCE_DEEP_SELECT}, deleted_by`;

    const [ownedRes, directShareRes, groupShareRes] = await Promise.all([
        supabase.from('resources')
            .select(SELECT_QUERY)
            .not('deleted_at', 'is', null) 
            .or(`created_by.eq.${user.id},is_public.eq.true`)
            .order('deleted_at', { ascending: false }),

        supabase.from('resource_shares')
            .select(`created_at, resources (${SELECT_QUERY})`)
            .eq('user_id', user.id)
            .not('resources.deleted_at', 'is', null), 

        groupIds.length > 0 
            ? supabase.from('resource_group_shares')
                .select(`created_at, resources (${SELECT_QUERY})`)
                .in('group_id', groupIds)
                .not('resources.deleted_at', 'is', null)
            : Promise.resolve({ data: [], error: null }),
    ]);

    // Definimos el mapa con el tipo AppResource para conservar todas las propiedades (is_owner, etc.)
    const tempMap = new Map<string, AppResource & { 
        deleted_at: string
        file_size: number
        raw_deleted_by?: string | null 
    }>();
    
    const deletedByUserIds = new Set<string>();

    const safeProcess = (list: TrashRowItem[] | null, isShared: boolean) => {
        if (!list) return;
        list.forEach((item) => {
            if (!item) return;
            // FIX ESLINT: const en lugar de let
            const raw: TrashedDBResource | null = isShareRow(item) ? item.resources : item;

            if (!raw || !raw.id || !raw.deleted_at) return; 
            if (tempMap.has(raw.id)) return;
            
            if (raw.deleted_by) deletedByUserIds.add(raw.deleted_by);

            const appRes = transformToAppResource(raw, user.id, isShared);
            
            tempMap.set(raw.id, {
                ...appRes, // Aquí guardamos TODO lo que retorna la transformación
                deleted_at: raw.deleted_at,
                file_size: raw.file_size || 0,
                raw_deleted_by: raw.deleted_by
            });
        });
    };

    safeProcess(ownedRes.data as unknown as TrashedDBResource[], false);
    safeProcess(directShareRes.data as unknown as TrashedShareRow[], true);
    safeProcess(groupShareRes.data as unknown as TrashedShareRow[], true);

    // FIX ESLINT: const en lugar de let
    const profilesMap = new Map<string, { name: string, email: string }>();
    
    if (deletedByUserIds.size > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', Array.from(deletedByUserIds));
            
        if (profiles) {
            profiles.forEach(p => {
                profilesMap.set(p.id, { 
                    name: p.full_name || 'Sin nombre', 
                    email: p.email 
                });
            });
        }
    }

    // MAPEO FINAL: Usamos spread operator (...res) para pasar TODAS las propiedades 
    // heredadas (incluyendo tags, description, is_owner, access_type) sin listarlas una por una.
    const finalResources: TrashedResource[] = Array.from(tempMap.values()).map(res => {
        const deleterInfo = res.raw_deleted_by ? profilesMap.get(res.raw_deleted_by) : null;
        
        return {
            ...res, // <--- ESTA ES LA CLAVE: Copia description, tags, is_owner, access_type, etc.
            deleted_by_id: res.raw_deleted_by || null,
            deleted_by_name: deleterInfo ? (deleterInfo.name !== 'Sin nombre' ? deleterInfo.name : deleterInfo.email) : null
        } as TrashedResource; // Forzamos el tipado final ya que estamos seguros de la estructura
    }).sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="p-3.5 bg-red-50 rounded-2xl text-red-600 shadow-sm ring-1 ring-red-100 w-fit">
                    <Trash2 className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Papelera de Reciclaje</h1>
                    <p className="text-slate-500 mt-1 flex items-center gap-2">
                        Gestión de recuperación y eliminación definitiva.
                    </p>
                </div>
            </div>

            <TrashClient initialResources={finalResources} currentUserId={user.id} />
        </div>
    )
}