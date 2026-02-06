import React from "react"
import Link from "next/link"
import { 
  Zap, 
  Clock, 
  Mail, 
  Share2, 
  ShieldAlert, 
  ArrowRight,
  Server,
  Database,
  Terminal,
  LayoutGrid,
  Settings,
  User,
  LogOut,
  FileText,
  Bell
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

// --- CONSTANTES SEGURAS ---
const VERCEL_JSON_CODE = `{
  "crons": [
    {
      "path": "/api/cron/weekly-digest",
      "schedule": "0 9 * * 5" 
    }
  ]
}`;

const PAYLOAD_RESET_CODE = `{ "email": "usuario@synapse-ipg.cl" }`;
const SERVER_ACTION_CODE = `await createResource(formData)`;

export default function AutomationDocsPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-24">
      
      {/* --- HEADER --- */}
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-white">
          Automatizaciones <span className="text-blue-600">Synapse IPG</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Documentación técnica de los flujos reactivos y tareas programadas que mantienen vivo el ecosistema.
        </p>
      </div>

      <Separator className="my-8" />

      {/* --- SECCIÓN 1: EVENTOS REACTIVOS (TRIGGERS) --- */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Triggers del Sistema</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Acciones disparadas por interacción directa en la interfaz.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- REPLICA 1: RECUPERACIÓN DE CONTRASEÑA (Estilo Login) --- */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-xl">
            
            {/* Cabecera Técnica */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-sm">Flow de Recuperación</span>
                </div>
                <Badge variant="destructive" className="text-[10px] uppercase">Crítico</Badge>
            </div>

            {/* CUERPO: SIMULACIÓN DE UI */}
            <div className="p-6 bg-slate-100/50 dark:bg-slate-950/50 relative">
                {/* Mini UI: Formulario de Login */}
                <div className="bg-white dark:bg-[#0B1120] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 max-w-xs mx-auto">
                    <div className="text-center mb-6">
                        <div className="h-10 w-10 bg-blue-600 rounded-lg mx-auto flex items-center justify-center mb-3">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">¿Olvidaste tu acceso?</h4>
                        <p className="text-[10px] text-muted-foreground mt-1">Ingresa tu correo institucional</p>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="h-9 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 px-3 flex items-center text-xs text-muted-foreground">
                            usuario@synapse-ipg.cl
                        </div>
                        <div className="h-9 bg-blue-600 rounded flex items-center justify-center text-xs font-medium text-white shadow-md shadow-blue-600/20 cursor-default">
                            Enviar Enlace Mágico
                        </div>
                    </div>
                </div>

                {/* Flecha de Flujo */}
                <div className="absolute top-1/2 right-4 md:right-10 transform -translate-y-1/2 translate-x-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            {/* Footer Técnico */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 text-xs font-mono border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="h-5 text-[10px]">API Route</Badge>
                    <span className="text-muted-foreground">POST /api/auth/reset</span>
                </div>
                <div className="p-2 bg-slate-200 dark:bg-slate-950 rounded text-slate-600 dark:text-slate-400">
                    {PAYLOAD_RESET_CODE}
                </div>
            </div>
          </div>

          {/* --- REPLICA 2: RECURSOS COMPARTIDOS (Estilo Dashboard) --- */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-all hover:shadow-xl">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold text-sm">Publicación de Recurso</span>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 text-[10px] uppercase border-0">Social</Badge>
            </div>

            {/* CUERPO: SIMULACIÓN DE UI (Sidebar + Content) */}
            <div className="flex h-64 bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                
                {/* Mini Sidebar (Réplica de tu imagen) */}
                <div className="w-16 bg-[#0B1120] flex flex-col items-center py-4 gap-6 shrink-0 z-10">
                    <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
                        <span className="text-lg font-bold">+</span>
                    </div>
                    <div className="flex flex-col gap-5 opacity-60">
                        <LayoutGrid className="w-4 h-4 text-white" />
                        <User className="w-4 h-4 text-white" />
                        <Settings className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Mini Content Area */}
                <div className="flex-1 p-5 bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">Recientes</h4>
                        <Bell className="w-3 h-3 text-blue-600" />
                    </div>
                    
                    {/* Item de Recurso */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900/50 mb-2">
                        <div className="p-2 bg-white dark:bg-indigo-900 rounded-md">
                            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-24 bg-indigo-200 dark:bg-indigo-800 rounded mb-1.5"></div>
                            <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                        <Badge className="bg-blue-600 text-[8px] h-4">Nuevo</Badge>
                    </div>

                     <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 opacity-50">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                            <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-1.5"></div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Footer Técnico */}
             <div className="bg-slate-50 dark:bg-slate-900 p-4 text-xs font-mono border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="h-5 text-[10px]">Action</Badge>
                    <span className="text-muted-foreground">revalidatePath(&apos;/resources&apos;)</span>
                </div>
                <div className="p-2 bg-slate-200 dark:bg-slate-950 rounded text-indigo-600 dark:text-indigo-400">
                    {SERVER_ACTION_CODE}
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECCIÓN 2: TAREAS PROGRAMADAS (CRON) --- */}
      <section className="space-y-8 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cron Jobs (Automatización)</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ejecución periódica gestionada por Vercel Cron.
            </p>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <Server className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">Configuración Requerida</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-500 text-sm">
            Para producción, asegúrate de que el archivo <code>vercel.json</code> esté en la raíz del proyecto.
          </AlertDescription>
        </Alert>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Boletín Semanal</CardTitle>
                    <CardDescription>Digest automático de actividad</CardDescription>
                </div>
                <div className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                    0 9 * * 5
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             {/* Visualización de Timeline estilo GitHub Actions */}
             <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                
                {/* Paso 1 */}
                <div className="p-6 relative group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="absolute top-6 right-6 text-slate-200 dark:text-slate-800 text-4xl font-black z-0 opacity-50">01</div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold mb-4">GET</div>
                        <h4 className="font-semibold text-sm">Trigger Vercel</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            Vercel invoca el endpoint seguro.
                        </p>
                    </div>
                </div>

                {/* Paso 2 */}
                <div className="p-6 relative group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="absolute top-6 right-6 text-slate-200 dark:text-slate-800 text-4xl font-black z-0 opacity-50">02</div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mb-4">
                            <Database className="w-4 h-4"/>
                        </div>
                        <h4 className="font-semibold text-sm">Query + Filtro</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            Supabase selecciona recursos top de los últimos 7 días.
                        </p>
                    </div>
                </div>

                {/* Paso 3 */}
                <div className="p-6 relative group hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors">
                    <div className="absolute top-6 right-6 text-green-100 dark:text-green-900/50 text-4xl font-black z-0 opacity-50">03</div>
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold mb-4">
                            <Mail className="w-4 h-4"/>
                        </div>
                        <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">Envío React Email</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            Distribución masiva vía Resend con template HTML.
                        </p>
                    </div>
                </div>

             </div>
          </CardContent>
        </Card>
      </section>

      {/* --- SECCIÓN 3: CONFIG JSON --- */}
      <section className="bg-[#0B1120] p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-white">vercel.json</h3>
        </div>
        <div className="font-mono text-xs md:text-sm text-slate-300 overflow-x-auto">
            <pre>{VERCEL_JSON_CODE}</pre>
        </div>
      </section>

      <div className="flex justify-end pt-4">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/docs/api">
                Explorar Referencia API <ArrowRight className="w-4 h-4"/>
            </Link>
          </Button>
      </div>

    </div>
  )
}