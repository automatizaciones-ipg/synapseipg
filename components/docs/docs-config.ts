export type DocsConfig = {
    title: string
    items: {
        title: string
        href: string
        disabled?: boolean
        label?: string
    }[]
}

export const docsConfig: DocsConfig[] = [
    {
        title: "🎓 Academia Synapse",
        items: [
            { title: "1. Primeros Pasos", href: "/docs/tutorial/intro", label: "Inicio" },
            { title: "2. Tu Espacio Personal", href: "/docs/tutorial/profile" },
            { title: "3. Navegación Maestra", href: "/docs/tutorial/navigation" },
            { title: "4. Gestión de Recursos", href: "/docs/tutorial/resources" },
            { title: "5. Colaboración & Grupos", href: "/docs/tutorial/groups" },
            { title: "6. Mis Herramientas", href: "/docs/tutorial/tools" },
            { title: "7. Papelera & Seguridad", href: "/docs/tutorial/security" },
        ],
    },
    {
        title: "Documentación Técnica",
        items: [
            { title: "Introducción", href: "/docs" },
            { title: "Arquitectura", href: "/docs/architecture" },
            { title: "Autenticación", href: "/docs/auth" },
            { title: "Componentes UI", href: "/docs/components" },
        ],
    },
]