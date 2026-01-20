'use client'

import { motion } from 'framer-motion'
import { FolderOpen, Zap, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

// Tipos visuales
type NodeType = { id: number; x: number; y: number; r: number; delay: number }

// CORRECCIÓN 1: Agregamos 'duration' al tipo para calcularlo UNA SOLA VEZ
type ConnectionType = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number
}

export function DashboardHero({
  children,
  userEmail
}: {
  children: React.ReactNode
  userEmail?: string
}) {
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [connections, setConnections] = useState<ConnectionType[]>([])

  useEffect(() => {
    // Generación de datos dentro del Effect (permitido usar Math.random aquí)
    const generateData = () => {
      const nodeCount = 12;
      const newNodes = Array.from({ length: nodeCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.5 + 1,
        delay: Math.random() * 2
      }))

      const newConnections: ConnectionType[] = []

      for (let i = 0; i < newNodes.length; i++) {
        const node = newNodes[i];
        for (let j = i + 1; j < Math.min(i + 3, newNodes.length); j++) {
          const target = newNodes[j];
          const dx = Math.abs(node.x - target.x);
          const dy = Math.abs(node.y - target.y);

          if (dx < 20 && dy < 40) {
            newConnections.push({
              id: `link-${i}-${j}`,
              x1: node.x,
              y1: node.y,
              x2: target.x,
              y2: target.y,
              // CORRECCIÓN 1: Calculamos la duración AQUÍ, no en el render
              duration: 3 + Math.random() * 2
            })
          }
        }
      }

      setNodes(newNodes)
      setConnections(newConnections)
    }

    generateData()
  }, [])

  const showNetwork = nodes.length > 0

  return (
    <div className="space-y-8 min-h-screen pb-10">

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[200px] overflow-hidden rounded-3xl bg-[#0B1120] border border-blue-900/30 shadow-xl group select-none transform-gpu translate-z-0">

        {/* Fondo estático optimizado */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#172554] to-[#0B1120] opacity-90" />

        {/* Ruido CSS puro */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Red Neuronal SVG */}
        {showNetwork && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <defs>
              <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {connections.map((link) => (
              <motion.line
                key={link.id}
                x1={`${link.x1}%`} y1={`${link.y1}%`}
                x2={`${link.x2}%`} y2={`${link.y2}%`}
                stroke="url(#hero-gradient)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{
                  // CORRECCIÓN 1: Usamos el valor pre-calculado del estado
                  duration: link.duration,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ willChange: "opacity" }}
              />
            ))}

            {nodes.map((node) => (
              <motion.circle
                key={node.id}
                cx={`${node.x}%`} cy={`${node.y}%`}
                r={node.r}
                fill="#93c5fd"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{
                  duration: 4,
                  delay: node.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        )}

        {/* Contenido Texto/Icono */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-start h-full px-8 md:px-12 gap-6 text-center md:text-left">

          {/* Icono Principal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            // CORRECCIÓN 2: "out" no existe. Usamos "easeOut"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full" />

            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/30 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-white/10 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />
              <FolderOpen className="w-9 h-9 text-white drop-shadow-md z-10" />
            </div>

            <motion.div
              className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full border-4 border-[#0B1120] z-20 flex items-center justify-center shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <Sparkles className="w-2.5 h-2.5 text-yellow-900" />
            </motion.div>
          </motion.div>

          <div className="flex flex-col space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Inicio
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/20">
                <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                <span className="text-blue-200 text-sm font-medium">Explorador de Recursos IPG</span>
              </div>

              {userEmail && (
                <span className="hidden md:inline-block text-xs text-blue-300/50 font-mono">
                  {userEmail}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- TABLA PRINCIPAL --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-0"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  )
}