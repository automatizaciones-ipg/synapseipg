import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Globe, BookOpen, Layers, LayoutDashboard, BarChart3, Settings, PieChart } from "lucide-react"
import Link from "next/link"

export default function DocsLandingPage() {
    return (
        <div className="space-y-12 pb-10">
            {/* INYECCIÓN DE ESTILOS PARA ANIMACIONES PERSONALIZADAS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0% { transform: translateY(0px) rotate(-3deg); }
                    50% { transform: translateY(-15px) rotate(-2deg); }
                    100% { transform: translateY(0px) rotate(-3deg); }
                }
                @keyframes shoot-light {
                    0% { transform: translateX(-100%) translateY(100%); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: translateX(100%) translateY(-100%); opacity: 0; }
                }
                @keyframes pulse-fast {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-shoot-1 {
                    animation: shoot-light 3s linear infinite;
                    animation-delay: 0s;
                }
                .animate-shoot-2 {
                    animation: shoot-light 4s linear infinite;
                    animation-delay: 1.5s;
                }
                .animate-shoot-3 {
                    animation: shoot-light 2.5s linear infinite;
                    animation-delay: 0.8s;
                }
                .animate-pulse-fast {
                    animation: pulse-fast 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}} />

            {/* HERO SECTION - REIMAGINADO: MÁS VELOCIDAD Y ORGANICIDAD */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0b1121] border border-slate-800 p-8 sm:p-16 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700 isolate group/hero">

                {/* 1. FONDO DE SYNAPSIS ORGÁNICA (VIVO Y RÁPIDO) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

                    {/* Glow base atmosférico */}
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse duration-3000"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[80px]"></div>

                    {/* Líneas de conexión rápidas (Neural firing) */}
                    <div className="absolute top-[20%] left-[10%] w-[400px] h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rotate-[-15deg] animate-shoot-1"></div>
                    <div className="absolute bottom-[30%] right-[20%] w-[600px] h-[1px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent rotate-[25deg] animate-shoot-2"></div>
                    <div className="absolute top-[60%] left-[30%] w-[300px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rotate-[-45deg] animate-shoot-3"></div>

                    {/* Nodos/Neuronas aleatorias parpadeando rápido */}
                    <div className="absolute top-[15%] right-[25%] w-1.5 h-1.5 bg-blue-400 rounded-full blur-[1px] animate-pulse-fast"></div>
                    <div className="absolute bottom-[40%] left-[15%] w-2 h-2 bg-indigo-400 rounded-full blur-[2px] animate-pulse-fast delay-75"></div>
                    <div className="absolute top-[80%] right-[10%] w-1 h-1 bg-cyan-300 rounded-full blur-[1px] animate-pulse-fast delay-150"></div>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 justify-between">

                    {/* TEXT CONTENT */}
                    <div className="max-w-2xl space-y-6">
                        <Badge variant="outline" className="bg-blue-950/40 backdrop-blur-md text-blue-200 border-blue-500/30 px-3 py-1 animate-in zoom-in-50 duration-500 delay-150 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 duration-700"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Sistema Centralizado v1.0
                        </Badge>

                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 drop-shadow-lg">
                            Documentación Oficial <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 animate-pulse duration-[3000ms]">
                                Synapse IPG
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
                            La fuente de verdad para la arquitectura, componentes y flujos de trabajo del ecosistema IPG. Potencia tu desarrollo con estándares unificados.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-500">
                            <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.8)] transition-all hover:scale-105 active:scale-95 duration-300">
                                Comenzar Tutorial <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white bg-transparent backdrop-blur-sm transition-colors">
                                Ver Arquitectura
                            </Button>
                        </div>
                    </div>

                    {/* GRAPHIC ELEMENT: DASHBOARD FLOTANTE */}
                    <div className="relative w-full max-w-[500px] aspect-[4/3] lg:h-[420px] lg:w-auto flex-shrink-0 perspective-1000 z-20">

                        {/* Conectores Visuales (Cables hacia el sistema) */}
                        <div className="absolute top-1/2 right-full w-20 h-[2px] bg-gradient-to-r from-transparent to-blue-500/50 hidden lg:block"></div>
                        <div className="absolute bottom-10 left-[-20px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-ping"></div>

                        {/* EL CONTENEDOR PRINCIPAL CON ANIMACIÓN FLOTANTE */}
                        <div className="animate-float hover:[animation-play-state:paused] transition-all duration-700 w-full h-full">

                            {/* Wrapper para efecto 3D al Hover */}
                            <div className="relative h-full w-full transform transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl">

                                {/* INTERFAZ EXACTA (NO CAMBIADA) */}
                                <div className="h-full w-full bg-[#F8FAFC] rounded-xl overflow-hidden border border-slate-700/50 flex shadow-2xl">

                                    {/* SIDEBAR (Dark - Brand Identity) */}
                                    <div className="w-16 sm:w-20 bg-[#0F172A] flex flex-col items-center py-6 gap-6 z-20 shrink-0">
                                        {/* Logo Synapse */}
                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                                            <Zap className="h-5 w-5 text-white fill-white" />
                                        </div>
                                        <div className="w-8 h-[1px] bg-slate-700/50"></div>
                                        {/* Nav Items */}
                                        <div className="flex flex-col gap-4">
                                            <div className="h-9 w-9 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center border border-blue-500/30">
                                                <LayoutDashboard className="h-5 w-5" />
                                            </div>
                                            <div className="h-9 w-9 text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center">
                                                <PieChart className="h-5 w-5" />
                                            </div>
                                            <div className="h-9 w-9 text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="mt-auto mb-2">
                                            <Settings className="h-5 w-5 text-slate-600" />
                                        </div>
                                    </div>

                                    {/* DASHBOARD CONTENT (Light - Clean) */}
                                    <div className="flex-1 p-4 sm:p-6 flex flex-col bg-slate-50/80 backdrop-blur-sm">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Panel General</h3>
                                                <p className="text-[10px] text-slate-500">Bienvenido de nuevo, Admin</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">IPG</div>
                                            </div>
                                        </div>

                                        {/* Widgets Grid */}
                                        <div className="grid grid-cols-2 gap-3 h-full">
                                            {/* Stats Card */}
                                            <div className="col-span-2 bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-between">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="h-6 w-6 rounded bg-green-50 flex items-center justify-center text-green-600">
                                                        <BarChart3 className="h-3 w-3" />
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-slate-700">Rendimiento del Sistema</span>
                                                </div>
                                                <div className="flex items-end gap-1 h-16 w-full px-2 pb-2 justify-between">
                                                    {[40, 70, 45, 90, 60, 85].map((h, i) => (
                                                        <div key={i} className="w-full bg-blue-500 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recent Files */}
                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 space-y-2">
                                                <div className="h-2 w-16 bg-slate-200 rounded-full mb-3"></div>
                                                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-100">
                                                    <div className="h-4 w-4 bg-purple-100 rounded text-purple-600 flex items-center justify-center"><Layers className="h-2.5 w-2.5" /></div>
                                                    <div className="h-1.5 w-12 bg-slate-200 rounded-full"></div>
                                                </div>
                                                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded border border-slate-100 opacity-60">
                                                    <div className="h-4 w-4 bg-blue-100 rounded text-blue-600 flex items-center justify-center"><Globe className="h-2.5 w-2.5" /></div>
                                                    <div className="h-1.5 w-10 bg-slate-200 rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Notification */}
                                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-lg shadow-md text-white flex flex-col justify-center relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
                                                <span className="text-[10px] opacity-80 mb-1">Estado de conexión</span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                                                    <span className="text-xs font-bold">Activo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* FIN INTERFAZ EXACTA */}
                                </div>

                                {/* Reflejo en el cristal para realismo extra */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARDS SECTION - MANTENIDO INTACTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                <DocsCard
                    icon={<Zap className="h-6 w-6 text-amber-500" />}
                    title="Automatizaciones"
                    description="Aprende cómo funcionan los cron jobs, colas de tareas y triggers automáticos del sistema."
                    href="/docs/automation"
                />
                <DocsCard
                    icon={<Shield className="h-6 w-6 text-emerald-500" />}
                    title="Seguridad & Auth"
                    description="Protocolos de autenticación, gestión de roles (RBAC) y protección de rutas middleware."
                    href="/docs/auth"
                />
                <DocsCard
                    icon={<Layers className="h-6 w-6 text-blue-500" />}
                    title="Componentes UI"
                    description="Catálogo de componentes reutilizables shadcn/ui estilizados para el ecosistema IPG."
                    href="/docs/components"
                />
            </div>

            <div className="border-t border-slate-200 pt-10">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Exploración Rápida</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/docs/tech-stack" className="group block space-y-2 p-6 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <Globe className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Stack Tecnológico</h3>
                        </div>
                        <p className="text-sm text-slate-500">Next.js 14, React Server Components, Tailwind, Prisma y Supabase.</p>
                    </Link>
                    <Link href="/docs/resources" className="group block space-y-2 p-6 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                <BookOpen className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Sistema de Archivos</h3>
                        </div>
                        <p className="text-sm text-slate-500">Lógica de carpetas anidadas, carga de archivos y gestión de permisos.</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

function DocsCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
    return (
        <Link href={href} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="mb-2 font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
        </Link>
    )
}