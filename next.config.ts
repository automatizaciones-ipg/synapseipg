import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Intentamos obtener el host de tu variable de entorno
        // Si no está disponible, usamos el wildcard de Supabase como fallback seguro
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname 
          : '**.supabase.co',
      },
    ],
  },
  // Opcional: Aumentar límite de server actions si subes archivos grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;