'use client'

import { DocsConfig } from "./docs-config"
import { DocsSidebarNav } from "./docs-sidebar-nav"

interface DocsSidebarProps {
    config: DocsConfig[]
}

export function DocsSidebar({ config }: DocsSidebarProps) {
    return (
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-slate-100/50">
            <div className="h-full overflow-y-auto py-6 pr-6 pl-2 lg:py-8 custom-scrollbar">
                <DocsSidebarNav config={config} />
            </div>
        </aside>
    )
}