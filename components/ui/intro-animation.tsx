"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Zap } from "lucide-react" // Usamos el rayo como metáfora de sinapsis

export function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // La animación dura 2.5 segundos en total antes de desaparecer
    const timer = setTimeout(() => setShowSplash(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
        >
          {/* Contenedor del Logo con Efecto de Pulso */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Círculo de fondo pulsante (La Sinapsis) */}
            <motion.div
              className="absolute h-24 w-24 rounded-full bg-blue-500/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute h-16 w-16 rounded-full bg-blue-500/40"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            
            {/* Icono Central */}
            <div className="relative z-10 bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/30">
               <Zap className="h-10 w-10 text-white fill-current" />
            </div>
          </motion.div>

          {/* Texto con revelación escalonada */}
          <motion.div 
            className="mt-8 text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Synapse IPG
            </h1>
            <p className="text-sm text-slate-400 font-medium tracking-widest uppercase">
              Connecting Knowledge
            </p>
          </motion.div>

          {/* Barra de carga decorativa */}
          <motion.div
            className="mt-12 h-1 w-48 bg-slate-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}