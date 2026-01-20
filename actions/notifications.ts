'use server'

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';
// Asegúrate de importar el nuevo componente correctamente
import SharedResourceEmail from '@/app/emails/shared-resource-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface NotifyProps {
    resourceId: string;
    resourceTitle: string;
    senderName: string;
    senderId: string;
    targetUserIds: string[];
    targetGroupIds: string[];
}

interface ProfileData {
    email: string | null;
}

interface GroupMemberData {
    user_id: string;
}

export async function sendSharingNotification({
    resourceId,
    resourceTitle,
    senderName,
    senderId,
    targetUserIds,
    targetGroupIds
}: NotifyProps) {

    const supabase = await createClient();
    const allRecipientUserIds = new Set<string>(targetUserIds);

    try {
        // 1. Resolver Miembros de Grupos
        if (targetGroupIds.length > 0) {
            const { data: groupMembers, error } = await supabase
                .from('group_members')
                .select('user_id')
                .in('group_id', targetGroupIds)
                .returns<GroupMemberData[]>();

            if (!error && groupMembers) {
                groupMembers.forEach((member) => allRecipientUserIds.add(member.user_id));
            }
        }

        // 2. Eliminar al remitente
        allRecipientUserIds.delete(senderId);
        if (allRecipientUserIds.size === 0) return;

        // 3. Obtener Emails
        const idsArray = Array.from(allRecipientUserIds);
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .in('id', idsArray)
            .returns<ProfileData[]>();

        if (profileError || !profiles) return;

        const validEmails: string[] = profiles
            .map((p) => p.email || '')
            .filter((email): email is string => email !== '' && email.includes('@'));

        if (validEmails.length === 0) return;

        // 4. PREPARAR LINK (URL ACTUALIZADA)
        // Priorizamos la variable de entorno, si no existe, usamos la de Vercel fija
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://synapseipg.vercel.app';
        // Limpieza por si la URL trae slash al final
        const origin = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
        const link = `${origin}/resources/${resourceId}`;

        // 5. Enviar Correos
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@ipg.cl'; // Fallback por seguridad

        const emailPromises = validEmails.map((email) => {
            return resend.emails.send({
                from: fromEmail,
                to: email,
                // Usamos un asunto claro y profesional
                subject: `Nuevo recurso compartido: ${resourceTitle}`,
                react: SharedResourceEmail({
                    senderName,
                    resourceTitle,
                    resourceLink: link,
                }),
            });
        });

        await Promise.all(emailPromises);
        console.log(`📧 Notificaciones enviadas a ${validEmails.length} usuarios.`);

    } catch (error) {
        console.error("❌ Error en notificaciones:", error);
    }
}