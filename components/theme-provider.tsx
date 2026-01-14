"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Solución robusta: Extraer tipos directamente del componente
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}