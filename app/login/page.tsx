// ARCHIVO: app/login/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { login, signup, resetPassword } from './actions' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'

// --- TIPOS ---
interface NeuralNode {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// --- COMPONENTE VISUAL OPTIMIZADO: RED NEURONAL ---
const NeuralNetwork = () => {
  const [nodes, setNodes] = useState<NeuralNode[]>([])
  
  // SOLUCIÓN FINAL: Usamos un ref para controlar si ya generamos nodos
  // y requestAnimationFrame para evitar el error de "setState síncrono"
  useEffect(() => {
    // Generamos los datos aleatorios
    const generateNodes = () => Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 3, // Más lento para mayor elegancia
      delay: Math.random() * 2
    }));

    // requestAnimationFrame agenda la actualización para el próximo "pintado" del navegador.
    // Esto satisface al linter (ya no es síncrono) y mejora la performance percibida.
    const animationFrameId = requestAnimationFrame(() => {
      setNodes(generateNodes());
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Renderizado condicional limpio: Si no hay nodos, no renderizamos nada (Server/Hydration safe)
  if (nodes.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>

        {/* Conexiones (Optimizadas) */}
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map((target) => {
            // Cálculo de distancia Euclídea simple
            const dist = Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2));
            // Solo dibujamos líneas si están cerca (Optimización de render)
            if (dist > 20) return null; 

            return (
              <motion.line
                key={`line-${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="url(#gradient-line)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0.2, 1, 0.2], 
                  opacity: [0.1, 0.3, 0.1] 
                }}
                transition={{ 
                  duration: Math.max(node.duration, target.duration), 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )
          })
        ))}
        
        {/* Nodos (Neuronas) */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="#60A5FA"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// --- PÁGINA PRINCIPAL ---
export default function LoginPage() {
  const [viewState, setViewState] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  
  // Modal states
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  // Handlers
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isResetOpen) return 
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    try {
        const result = viewState === 'login' ? await login(formData) : await signup(formData)
        if (result?.error) toast.error(result.error)
        else if (result?.success) toast.success(result.success)
    } catch (error) {
        // --- CORRECCIÓN DE PRECISIÓN PARA TYPESCRIPT Y REDIRECCIÓN ---
        // 1. Casteamos a Error estándar para evitar 'any' implícito y acceder a .message
        const err = error as Error;
        
        // 2. Comprobamos si es el error de redirección de Next.js
        if (err.message === 'NEXT_REDIRECT' || err.message?.includes('NEXT_REDIRECT')) {
            // Si es redirección, la relanzamos para que Next.js la maneje
            throw error;
        }

        // 3. Si no es redirección, es un error real
        console.error(err);
        toast.error("Ocurrió un error inesperado")
    } finally {
        setLoading(false)
    }
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    event.stopPropagation() 
    setResetLoading(true)
    const formData = new FormData(event.currentTarget)
    
    try {
        const result = await resetPassword(formData)
        if (result?.error) {
            toast.error(result.error)
        } else if (result?.success) {
            toast.success(result.success)
            setIsResetOpen(false) 
        }
    } finally {
        setResetLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 font-sans selection:bg-blue-500/30">
      
      {/* 🎨 IZQUIERDA: VISUAL & BRANDING */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 relative overflow-hidden p-12 text-white">
        
        {/* Fondo: Neural + Glows Ambientales */}
        <div className="absolute inset-0 z-0">
              <NeuralNetwork />
              {/* Orbs difusos con motion puro para suavidad extrema */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen" 
              />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-4">
            <div className="relative group cursor-default">
                <motion.div 
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.8, ease: "anticipate" }}
                    className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10 backdrop-blur-sm z-10"
                >
                    <Zap className="w-6 h-6 text-white fill-white/20" />
                </motion.div>
                {/* Glow estático detrás del logo */}
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-40 -z-10 group-hover:opacity-60 transition-opacity duration-500" />
            </div>

            <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    Synapse Recursos IPG
                    <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    </div>
                </span>
                <span className="text-[10px] text-blue-200/60 font-medium tracking-[0.2em] uppercase">Sistema Centralizado</span>
            </div>
        </div>

        {/* Copy Principal */}
        <div className="relative z-10 max-w-lg mt-10">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-semibold backdrop-blur-md"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"/> v1.0 Inteligencia Colaborativa
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
                className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.05] text-white"
            >
                Gestión de recursos <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">inteligente IPG.</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
                className="text-lg text-slate-400 leading-relaxed max-w-md"
            >
                Conecta áreas, comparte archivos y colabora en tiempo real a través de nuestra red neuronal corporativa segura.
            </motion.p>
        </div>

        {/* Footer: Social Proof */}
        <div className="relative z-10 flex items-center gap-5 pt-8">
            <div className="flex -space-x-3">
                 {[1,2,3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center">
                            <UsersIcon className="w-4 h-4 text-slate-400 opacity-80"/>
                        </div>
                    </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-900/50">
                    +2k
                 </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <span className="text-white text-sm font-medium">Colabora Activamente</span>
                <span className="text-slate-500 text-xs">Con áreas internas de IPG</span>
            </div>
        </div>
      </div>

      {/* 🔐 DERECHA: FORMULARIO */}
      <div className="flex items-center justify-center bg-slate-50/50 p-6 lg:p-12 relative">
         {/* Mobile Top Bar */}
         <div className="lg:hidden absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

         <div className="w-full max-w-[420px] space-y-8 z-10">
            
            <div className="text-center space-y-2">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={viewState}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* ✅ LOGO MÓVIL OPTIMIZADO: Diseño dinámico idéntico a la izquierda */}
                        <div className="lg:hidden mx-auto mb-6 relative w-12 h-12 flex items-center justify-center">
                             <motion.div 
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.8, ease: "anticipate" }}
                                className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10 z-10"
                             >
                                <Zap className="w-6 h-6 text-white fill-white/20" />
                             </motion.div>
                             {/* Glow sutil para fondo claro */}
                             <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 -z-10" />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {viewState === 'login' ? 'Bienvenido' : 'Crear cuenta'}
                        </h2>
                        <p className="text-slate-500 mt-2">
                            {viewState === 'login' 
                                ? 'Ingresa tus credenciales institucionales.' 
                                : 'Completa el formulario para registrarte en IPG.'}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="bg-white px-8 py-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Campos dinámicos Register */}
                    <AnimatePresence mode="popLayout">
                        {viewState === 'register' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <Label htmlFor="full_name">Nombre Completo</Label>
                                <Input 
                                    id="full_name" 
                                    name="full_name" 
                                    placeholder="Ej: Marcela Paz" 
                                    required={viewState === 'register'}
                                    disabled={loading || isResetOpen}
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Institucional</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="usuario@ipg.cl" 
                            required 
                            disabled={loading || isResetOpen}
                            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            {viewState === 'login' && (
                                <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                                <DialogTrigger asChild>
                                    <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">
                                    ¿Olvidaste tu contraseña?
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Recuperar Acceso</DialogTitle>
                                    <DialogDescription>
                                        Ingresa tu correo institucional y te enviaremos un enlace seguro.
                                    </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleReset} className="space-y-4 mt-2">
                                        <div className="space-y-2">
                                            <Label>Correo electrónico</Label>
                                            <Input name="email" type="email" placeholder="tu@ipg.cl" required disabled={resetLoading}/>
                                        </div>
                                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={resetLoading}>
                                            {resetLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Enviar enlace"}
                                        </Button>
                                    </form>
                                </DialogContent>
                                </Dialog>
                            )}
                        </div>
                        
                        <div className="relative">
                            <Input 
                                id="password" 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                required 
                                minLength={6}
                                disabled={loading || isResetOpen}
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                            />
                            <button 
                                type="button"
                                disabled={loading || isResetOpen}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {viewState === 'register' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    type="password" 
                                    required={viewState === 'register'}
                                    minLength={6}
                                    disabled={loading || isResetOpen}
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button 
                        type="submit" 
                        className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium text-[15px] shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        disabled={loading || isResetOpen} 
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            viewState === 'login' ? (
                                <span className="flex items-center gap-2">Ingresar a Synapse <ArrowRight className="w-4 h-4" /></span>
                            ) : (
                                <span className="flex items-center gap-2">Crear cuenta <CheckCircle2 className="w-4 h-4" /></span>
                            )
                        )}
                    </Button>
                </form>
            </div>

            <div className="text-center">
                <p className="text-sm text-slate-500">
                    {viewState === 'login' ? "¿No tienes acceso? " : "¿Ya tienes usuario? "}
                    <button 
                        type="button"
                        disabled={loading || isResetOpen}
                        onClick={() => setViewState(viewState === 'login' ? 'register' : 'login')}
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                    >
                        {viewState === 'login' ? "Solicitar registro" : "Inicia Sesión"}
                    </button>
                </p>
            </div>

         </div>

         <div className="absolute bottom-6 text-center w-full text-[11px] text-slate-400 font-medium tracking-wide">
            © 2026 IPG Synapse. Designed and Developed by Luis Rivera Araya.
         </div>
      </div>
    </div>
  )
}

// Icono simple para el social proof
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
}