'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Zap, Sparkles, Globe, Clock, FileText, ArrowUpRight, Database, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

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
  recentResources = []
}: {
  children: React.ReactNode
  userEmail?: string
  recentResources?: GlobalResource[]
}) {
  const [nodes, setNodes] = useState<NodeType[]>([])
  const [connections, setConnections] = useState<ConnectionType[]>([])
  
  const [currentIndex, setCurrentIndex] = useState(0)

  // Lógica de Nodos Original (Mantenida intacta para el efecto visual)
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

  // Lógica del Rotador
  useEffect(() => {
    if (recentResources.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentResources.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [recentResources.length])

  const showNetwork = nodes.length > 0
  const currentResource = recentResources.length > 0 ? recentResources[currentIndex] : null

  const getIcon = (type: string) => {
     if (type === 'PDF') return <FileText className="w-4 h-4 text-red-400"/>;
     if (type === 'IMG') return <ImageIcon className="w-4 h-4 text-purple-400"/>;
     return <Database className="w-4 h-4 text-blue-400"/>;
  }

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* --- HERO SECTION COMPACTO --- */}
      {/* Altura reducida de min-h-[200px]/lg:h-[240px] a min-h-[140px]/lg:h-[160px] */}
      <div className="relative w-full min-h-[140px] lg:h-[160px] overflow-hidden rounded-2xl bg-[#0B1120] border border-blue-900/30 shadow-xl group select-none transform-gpu translate-z-0">

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

        {/* 2. CONTENIDO GRID AJUSTADO */}
        {/* Reducimos el padding y ajustamos el layout vertical en móviles */}
        <div className="relative z-10 w-full h-full p-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">

          {/* COLUMNA IZQUIERDA COMPACTA */}
          <div className="lg:col-span-7 flex flex-row items-center gap-4 lg:gap-6 text-left">
            {/* Ícono central más pequeño */}
             <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative shrink-0 hidden sm:block"
            >
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full" />
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/10 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12" />
                <FolderOpen className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-md z-10" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-[3px] border-[#0B1120] z-20 flex items-center justify-center shadow-sm"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
              >
                <Sparkles className="w-2 h-2 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div className="flex flex-col space-y-1.5">
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Texto más pequeño */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white leading-none">
                  Inicio
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-wrap items-center gap-2"
              >
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/20 backdrop-blur-sm">
                  <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
                  <span className="text-blue-200 text-xs font-medium">Explorador de Recursos</span>
                </div>
                {userEmail && (
                  <span className="text-[10px] text-blue-300/50 font-mono tracking-wide hidden sm:inline-block">
                    {userEmail}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* COLUMNA DERECHA - LIVE GLOBAL FEED COMPACTO */}
          {/* Se ajustan márgenes y padding de la tarjeta */}
          <div className="lg:col-span-5 h-full flex items-center justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-3 relative overflow-hidden shadow-xl hover:bg-white/10 transition-colors duration-300"
            >
              <div className="flex justify-between items-center mb-2.5 border-b border-white/5 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-100 tracking-wider uppercase">Actividad Global</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-blue-300 bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-800">
                  <Globe className="w-2.5 h-2.5" />
                  <span>Público</span>
                </div>
              </div>

              <div className="h-[50px] relative"> 
                <AnimatePresence mode="wait">
                  {currentResource ? (
                    <motion.div
                      key={currentResource.id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Link 
                        href={`/resources/${currentResource.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full h-full group cursor-pointer"
                      >
                        {/* Icono más pequeño */}
                        <div className="h-8 w-8 rounded-md bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shrink-0 group-hover:border-blue-400 transition-colors">
                            {getIcon(currentResource.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate pr-2 group-hover:text-blue-300 transition-colors">
                            {currentResource.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-blue-200/70 truncate max-w-[100px]">
                              Por {currentResource.author}
                            </p>
                            <span className="text-[8px] text-white/30">•</span>
                            <span className="flex items-center gap-1 text-[9px] text-green-400 font-medium">
                              <Clock className="w-2.5 h-2.5" /> {currentResource.timeAgo}
                            </span>
                          </div>
                        </div>

                        <div className="h-6 w-6 rounded-full bg-white/5 group-hover:bg-blue-600 flex items-center justify-center transition-all border border-white/10 group-hover:border-blue-500 shrink-0">
                          <ArrowUpRight className="w-3 h-3 text-blue-300 group-hover:text-white" />
                        </div>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="text-white/50 text-[10px] text-center pt-2 italic flex justify-center items-center h-full">
                       <Clock className="w-2.5 h-2.5 mr-1.5 opacity-50"/> Esperando actividad...
                    </div>
                  )}
                </AnimatePresence>
              </div>

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