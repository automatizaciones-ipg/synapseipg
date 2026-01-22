'use client'

import Link from "next/link"
import { Search, Menu, BookOpen, Zap, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DocsSidebarNav } from "./docs-sidebar-nav"
import { docsConfig } from "./docs-config"
import { useState } from "react"
import { motion } from "framer-motion"

// --- COMPONENTE LOGO ANIMADO (Extraído y Adaptado) ---
function SynapseLogo({ size = "md" }: { size?: "sm" | "md" }) {
    const containerSize = size === "md" ? "w-9 h-9" : "w-8 h-8"
    const iconSize = size === "md" ? "w-5 h-5" : "w-4 h-4"

    return (
        <div className="relative group shrink-0">
            <motion.div
                className="absolute inset-0 rounded-xl bg-blue-500/20 blur-sm"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <div className={`${containerSize} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center relative shadow-sm border border-blue-400/20 overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className={`${iconSize} text-white fill-blue-50 drop-shadow-sm`} />
                {/* Brillo Pasante */}
                <motion.div
                    className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg]"
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>
        </div>
    )
}

export function DocsNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-8">

                {/* --- MOBILE MENU TRIGGER --- */}
                <div className="flex md:hidden mr-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-slate-900">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>

                        {/* Sheet Content con Estilo "Dark Mode" para consistencia con Sidebar original */}
                        <SheetContent side="left" className="pr-0 w-[300px] bg-[#0B1120] border-r-slate-800 text-white p-0">
                            <div className="flex flex-col h-full bg-gradient-to-b from-[#0B1120] to-[#0f172a]">
                                <SheetHeader className="p-6 text-left border-b border-white/5">
                                    <SheetTitle className="text-white flex items-center gap-3">
                                        <SynapseLogo size="md" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg tracking-tight">Synapse IPG</span>
                                            <span className="text-[10px] text-blue-400 tracking-wider font-medium uppercase">Academia</span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto py-6 px-4">
                                    {/* Renderizamos el menú usando tu componente DocsSidebarNav pero adaptado al tema oscuro */}
                                    <div className="text-slate-300">
                                        <DocsSidebarNav config={docsConfig} onLinkClick={() => setIsOpen(false)} />
                                    </div>
                                </div>

                                {/* Footer del Menú Móvil */}
                                <div className="p-4 border-t border-white/5 bg-slate-900/50">
                                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/30">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Ir a la Aplicación
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* --- DESKTOP LOGO AREA --- */}
                <div className="mr-4 hidden md:flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-3 group">
                        <SynapseLogo size="md" />
                        <div className="flex flex-col">
                            <span className="hidden font-bold sm:inline-block text-slate-900 tracking-tight text-lg leading-none">
                                Synapse <span className="text-slate-400 font-normal">Docs</span>
                            </span>
                        </div>
                    </Link>

                    {/* Main Navigation Links */}
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/docs" className="transition-colors hover:text-blue-600 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-md">
                            Documentación
                        </Link>
                        <Link href="/docs/tutorial/intro" className="flex items-center gap-2 transition-colors text-blue-700 bg-blue-50/80 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 hover:text-blue-800 hover:shadow-sm">
                            <BookOpen className="h-3.5 w-3.5" />
                            Tutorial Interactivo
                        </Link>
                    </nav>
                </div>

                {/* --- SEARCH & ACTIONS --- */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 w-full md:w-64">
                            <Search className="h-3.5 w-3.5" />
                            <span className="inline-flex">Buscar...</span>
                            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>

                    <nav className="flex items-center gap-2 ml-2">
                        <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <span className="font-semibold text-xs border border-slate-300 bg-white px-1.5 py-0.5 rounded shadow-sm">App</span>
                                <span className="sr-only">Ir al Dashboard</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}