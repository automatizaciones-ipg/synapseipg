import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Globe, BookOpen, Layers } from "lucide-react"
import Link from "next/link"

export default function DocsLandingPage() {
    return (
        <div className="space-y-12 pb-10">

            {/* HERO SECTION */}
            <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-8 sm:p-16 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Decorative Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.4]"
                    style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
                    <div className="max-w-2xl space-y-4">
                        <Badge variant="outline" className="bg-white/80 backdrop-blur text-blue-700 border-blue-200 animate-in zoom-in-50 duration-500 delay-150">
                            v1.0 System Architecture
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
                            Documentación <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Synapse IPG</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
                            La fuente única de verdad para la arquitectura, componentes y guías de desarrollo del ecosistema IPG. Diseñado para escalabilidad y rendimiento.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-500">
                            <Button size="lg" className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105">
                                Comenzar Lección <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 border-slate-300 hover:bg-white hover:text-blue-600 transition-all">
                                Ver Repositorio
                            </Button>
                        </div>
                    </div>

                    {/* Abstract Graphic Element */}
                    <div className="relative h-64 w-64 lg:h-80 lg:w-80 flex-shrink-0 animate-in fade-in zoom-in-75 duration-1000 delay-300">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" />
                        <div className="relative h-full w-full bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                            <div className="h-2 w-1/3 bg-slate-200 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-20 w-full bg-slate-100 rounded-lg border border-slate-100/50" />
                                <div className="h-20 w-full bg-blue-50 rounded-lg border border-blue-100" />
                            </div>
                            <div className="mt-auto flex justify-between">
                                <div className="h-8 w-8 rounded-full bg-slate-200" />
                                <div className="h-8 w-20 rounded-md bg-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARDS SECTION */}
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
                            <Globe className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Stack Tecnológico</h3>
                        </div>
                        <p className="text-sm text-slate-500">Next.js 14, React Server Components, Tailwind, Prisma y Supabase.</p>
                    </Link>
                    <Link href="/docs/resources" className="group block space-y-2 p-6 border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
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