import type { Metadata } from "next";
import { Inter } from "next/font/google"; // ✅ Usamos Inter (sin descarga fallida)
import "./globals.css"; // ✅ Mantenemos la importación
import { Toaster } from "@/components/ui/sonner"; 

// Configuramos Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synapse IPG",
  description: "Sistema de Gestión de Recursos Internos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos la clase de Inter al body */}
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster /> 
      </body>
    </html>
  );
}