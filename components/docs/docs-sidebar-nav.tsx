'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DocsConfig } from "./docs-config"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface DocsSidebarNavProps {
    config: DocsConfig[]
    onLinkClick?: () => void // Para cerrar el menú móvil al hacer click
}

export function DocsSidebarNav({ config, onLinkClick }: DocsSidebarNavProps) {
    const pathname = usePathname()

    return (
        <div className="w-full">
            {config.map((section, index) => (
                <div key={index} className="pb-6">
                    <h4 className="mb-2 rounded-md px-2 py-1 text-sm font-bold text-slate-900 tracking-tight">
                        {section.title}
                    </h4>
                    {section.items?.length && (
                        <div className="grid grid-flow-row auto-rows-max text-sm gap-1">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.disabled ? "#" : item.href}
                                    onClick={onLinkClick}
                                    className={cn(
                                        "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 transition-all duration-200",
                                        item.disabled && "cursor-not-allowed opacity-60",
                                        pathname === item.href
                                            ? "font-medium text-blue-700 bg-blue-50 border-blue-100/50"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                    )}
                                >
                                    {item.title}
                                    {item.label && (
                                        <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] h-5 bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm">
                                            {item.label}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}