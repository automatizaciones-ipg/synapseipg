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
            { title: "2. Subiendo un Recurso", href: "/docs/tutorial/creating-resurces" },
            { title: "3. Tu Espacio Personal", href: "/docs/tutorial/profile" },
            { title: "4. Navegación Maestra", href: "/docs/tutorial/navigation" },
            { title: "5. Gestión de Recursos", href: "/docs/tutorial/resources" },
            { title: "6. Colaboración & Grupos", href: "/docs/tutorial/groups" },
            { title: "7. Mis Herramientas", href: "/docs/tutorial/tools" },
            { title: "8. Papelera & Seguridad", href: "/docs/tutorial/trash" },
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