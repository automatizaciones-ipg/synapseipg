import { DocsNavbar } from "@/components/docs/docs-navbar"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { docsConfig } from "@/components/docs/docs-config"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <DocsNavbar />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 sm:px-8 max-w-screen-2xl">
                <DocsSidebar config={docsConfig} />
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                    <div className="mx-auto w-full min-w-0">
                        {children}
                    </div>
                    {/* Espacio reservado para el "On this page" (índice derecho) futuro */}
                    <div className="hidden text-sm xl:block">
                        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
                            <div className="space-y-2">
                                <p className="font-medium text-slate-900">En esta página</p>
                                <ul className="m-0 list-none">
                                    <li className="mt-0 pt-2"><span className="text-slate-500 hover:text-slate-900 cursor-pointer text-xs">Resumen</span></li>
                                    <li className="mt-0 pt-2"><span className="text-slate-500 hover:text-slate-900 cursor-pointer text-xs">Características</span></li>
                                    <li className="mt-0 pt-2"><span className="text-slate-500 hover:text-slate-900 cursor-pointer text-xs">Arquitectura</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}