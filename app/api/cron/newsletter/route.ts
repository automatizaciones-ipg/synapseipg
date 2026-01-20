// ARCHIVO: app/api/cron/newsletter/route.ts
import { NextResponse } from 'next/server';
import { sendWeeklyNewsletterBatch } from '@/actions/newsletter-service';

export const dynamic = 'force-dynamic';

interface NewsletterServiceResult {
    success: boolean;
    sent?: number;
    total?: number;
    error?: string | unknown;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const key = requestUrl.searchParams.get('key');

    console.log(`🔹 [Cron Newsletter] Procesando solicitud. Time: ${new Date().toISOString()}`);

    const cronSecret = process.env.CRON_SECRET || 'ipg_secret_key_fallback';
    const authHeader = request.headers.get('authorization');

    const isVercelCron = authHeader === `Bearer ${cronSecret}`;
    const isManualTest = key === cronSecret;

    if (!isVercelCron && !isManualTest) {
        console.warn(`❌ [Cron Newsletter] Acceso denegado.`);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("🚀 [Cron Newsletter] Iniciando distribución masiva...");

        const result: NewsletterServiceResult = await sendWeeklyNewsletterBatch();

        if (!result.success) {
            console.error("❌ [Cron Newsletter] Fallo controlado:", result.error);
            const errorDetail = result.error instanceof Error ? result.error.message : String(result.error);
            return NextResponse.json({ error: 'Service execution failed', details: errorDetail }, { status: 500 });
        }

        console.log(`✅ [Cron Newsletter] Enviados: ${result.sent}/${result.total}`);

        return NextResponse.json({
            success: true,
            message: 'Weekly newsletter dispatched',
            stats: { total: result.total ?? 0, sent: result.sent ?? 0 }
        });

    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) errorMessage = error.message;
        else if (typeof error === 'string') errorMessage = error;

        console.error("❌ [Cron Newsletter] Error crítico:", errorMessage);
        return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
    }
}