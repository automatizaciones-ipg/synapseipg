'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Zap, Sparkles, Globe, Clock, FileText, ArrowUpRight, Database, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link' // Importación necesaria para navegación real

// --- TIPOS ---
type NodeType = { id: number; x: number; y: number; r: number; delay: number }

type ConnectionType = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number
}

// Tipo exportado para uso en page.tsx
export type GlobalResource = {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'IMG' | 'OTHER';
  author: string;
  timeAgo: string;
}

export function DashboardHero({
  children,
  userEmail,
  recentResources = [] // Array vacío por defecto si no llegan datos
}: {
  children: React.ReactNode
  userEmail?: string
  recentResources?: GlobalResource[]
}) {
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [connections, setConnections] = useState<ConnectionType[]>([])
  
  const [currentIndex, setCurrentIndex] = useState(0)

  // Lógica de Nodos (Tu código original)
  useEffect(() => {
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

  // Lógica del Rotador "Alive"
  useEffect(() => {
    if (recentResources.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentResources.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [recentResources.length])

  const showNetwork = nodes.length > 0
  const currentResource = recentResources.length > 0 ? recentResources[currentIndex] : null

  // Helper de Iconos
  const getIcon = (type: string) => {
     if (type === 'PDF') return <FileText className="w-5 h-5 text-red-400"/>;
     if (type === 'IMG') return <ImageIcon className="w-5 h-5 text-purple-400"/>;
     return <Database className="w-5 h-5 text-blue-400"/>;
  }

  return (
    <div className="space-y-8 min-h-screen pb-10">

      {/* --- HERO SECTION --- */}
      <div className="relative w-full min-h-[200px] lg:h-[240px] overflow-hidden rounded-3xl bg-[#0B1120] border border-blue-900/30 shadow-2xl group select-none transform-gpu translate-z-0">

        {/* 1. FONDO */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050914] via-[#0B1120] to-[#1e3a8a] opacity-90" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {showNetwork && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-screen">
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
                transition={{ duration: link.duration, repeat: Infinity, ease: "linear" }}
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
                transition={{ duration: 4, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </svg>
        )}

        {/* 2. CONTENIDO GRID */}
        <div className="relative z-10 w-full h-full p-6 md:p-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 text-center md:text-left">
             <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-2xl flex items-center justify-center shadow-lg border border-blue-400/30 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/10 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />
                <FolderOpen className="w-8 h-8 md:w-9 md:h-9 text-white drop-shadow-md z-10" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-[#0B1120] z-20 flex items-center justify-center shadow-sm"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
              >
                <Sparkles className="w-2.5 h-2.5 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div className="flex flex-col space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
              >
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                  Inicio
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col md:flex-row items-center gap-3"
              >
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/20 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  <span className="text-blue-200 text-sm font-medium">Explorador de Recursos IPG</span>
                </div>
                {userEmail && (
                  <span className="text-xs text-blue-300/50 font-mono tracking-wide">
                    {userEmail}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* COLUMNA DERECHA - LIVE GLOBAL FEED */}
          <div className="lg:col-span-5 h-full flex items-center justify-center lg:justify-end">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 relative overflow-hidden shadow-2xl shadow-blue-900/20 hover:bg-white/10 transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-bold text-blue-100 tracking-wider uppercase">Actividad Global</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800">
                  <Globe className="w-3 h-3" />
                  <span>Público</span>
                </div>
              </div>

              {/* Contenido Animado */}
              <div className="h-[70px] relative"> 
                <AnimatePresence mode="wait">
                  {currentResource ? (
                    <motion.div
                      key={currentResource.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      {/* 🔥 LINK REAL: Se puede visitar el recurso al hacer click 🔥 */}
                      <Link 
                        href={`/resources/${currentResource.id}`}   // <--- AQUÍ ESTÁ EL CAMBIO
                        target="_blank"                             // Abre nueva pestaña
                        rel="noopener noreferrer"                   // Seguridad obligatoria
                        className="flex items-start gap-3 w-full h-full group cursor-pointer"
                      >
                        {/* Icono */}
                        <div className="h-10 w-10 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shrink-0 group-hover:border-blue-400 transition-colors">
                            {getIcon(currentResource.type)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate pr-2 group-hover:text-blue-300 transition-colors">
                            {currentResource.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-blue-200/70 truncate max-w-[120px]">
                              Por {currentResource.author}
                            </p>
                            <span className="text-[10px] text-white/30">•</span>
                            <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                              <Clock className="w-3 h-3" /> {currentResource.timeAgo}
                            </span>
                          </div>
                        </div>

                        {/* Flecha Acción */}
                        <div className="h-8 w-8 rounded-full bg-white/5 group-hover:bg-blue-600 flex items-center justify-center transition-all border border-white/10 group-hover:border-blue-500 shrink-0">
                          <ArrowUpRight className="w-4 h-4 text-blue-300 group-hover:text-white" />
                        </div>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="text-white/50 text-xs text-center pt-4 italic flex justify-center items-center h-full">
                       <Clock className="w-3 h-3 mr-2 opacity-50"/> Esperando actividad...
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Barra de Progreso */}
              {recentResources.length > 1 && (
                <motion.div 
                  key={`progress-${currentIndex}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-500/50"
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- TABLA PRINCIPAL --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative z-0"
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  )
}