'use server'

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { WeeklyNewsletterEmail } from '@/app/emails/weekly-newsletter';

// ------------------------------------------------------------------
// CONFIGURACIÓN DE SEGURIDAD
// ------------------------------------------------------------------
const IS_TESTING_MODE = false
const WHITELIST_EMAILS = ['luis.rivera@ipg.cl'];

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000";

if (!process.env.RESEND_API_KEY) {
    throw new Error("ERROR: RESEND_API_KEY requerida.");
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'no-reply@ipg.cl';

// ------------------------------------------------------------------
// NOTICIAS (Mock Profesional)
// ------------------------------------------------------------------
const CORPORATE_NEWS = [
    {
        id: "news-1",
        title: "Optimización del Sistema",
        description: "Se han realizado mejoras en la velocidad de carga y creación de enlaces.",
        icon: "⚡"
    },
    {
        id: "news-2",
        title: "Seguridad de la Información",
        description: "Recordamos no compartir contraseñas personales bajo ninguna circunstancia.",
        icon: "🔒"
    },
];

// ------------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------------

interface ResourceItem {
    id: string;
    title: string;
    category: string;
    created_at: string;
}

export interface NewsletterServiceResult {
    success: boolean;
    total_found: number;
    emails_sent: number;
    logs: string[];
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

// ------------------------------------------------------------------
// SERVICIO
// ------------------------------------------------------------------

export async function sendWeeklyNewsletterBatch(): Promise<NewsletterServiceResult> {
    const supabase = await createClient();
    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); logs.push(msg); };

    log("🚀 Iniciando servicio Newsletter (Recursos Globales)...");

    // 1. OBTENER RECURSOS GLOBALES (Último mes)
    // Basado en tu esquema: is_public = true
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: resources, error: resourceError } = await supabase
        .from('resources')
        .select('id, title, category, created_at')
        .eq('is_public', true) // <--- FILTRO DE BASE DE DATOS PARA GLOBAL
        .gt('created_at', thirtyDaysAgo.toISOString())
        .is('deleted_at', null)
        .limit(5)
        .order('created_at', { ascending: false });

    if (resourceError) {
        log(`❌ Error BD: ${resourceError.message}`);
    }

    const recentResources = (resources as ResourceItem[]) || [];
    const totalNewResources = recentResources.length;

    log(`📄 Se encontraron ${totalNewResources} recursos públicos recientes.`);

    // 2. OBTENER USUARIOS
    const { data: users } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);

    if (!users) return { success: false, total_found: 0, emails_sent: 0, logs };

    // 3. WHITELIST
    let targetEmails = users
        .map(u => u.email?.trim().toLowerCase() || "")
        .filter(e => e.includes('@'));

    if (IS_TESTING_MODE) {
        log(`🔒 TEST MODE: Enviando solo a ${WHITELIST_EMAILS.join(', ')}`);
        targetEmails = targetEmails.filter(email => WHITELIST_EMAILS.includes(email));
    }

    // 4. ENVÍO
    let sentCount = 0;

    for (const email of targetEmails) {
        try {
            const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `Novedades Synapse: Recursos Globales y Noticias`,
                react: WeeklyNewsletterEmail({
                    newResources: recentResources,
                    totalNewResources: totalNewResources,
                    companyNews: CORPORATE_NEWS,
                    dashboardUrl: `${BASE_URL}/dashboard`
                }),
            });

            if (error) {
                log(`❌ Error envío a ${email}: ${error.message}`);
            } else {
                log(`✅ Enviado a ${email}`);
                sentCount++;
            }

            if (targetEmails.length > 1) await new Promise(r => setTimeout(r, 500));

        } catch (error: unknown) {
            const msg = getErrorMessage(error);
            log(`❌ Excepción: ${msg}`);
        }
    }

    return {
        success: true,
        total_found: users.length,
        emails_sent: sentCount,
        logs: logs
    };
}