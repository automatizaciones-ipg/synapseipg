'use client'

import { useState } from 'react'
import { login, signup, resetPassword } from './actions' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [viewState, setViewState] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Manejo del formulario principal
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    const result = viewState === 'login' ? await login(formData) : await signup(formData)

    setLoading(false)
    if (result?.error) toast.error(result.error)
    else if (result?.success) toast.success(result.success)
  }

  // Manejo de Recuperación de contraseña
  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const result = await resetPassword(formData)
    setLoading(false)
    if (result?.error) toast.error(result.error)
    else if (result?.success) toast.success(result.success)
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      
      {/* 🎨 SECCIÓN IZQUIERDA: VISUAL & BRANDING (Dark Mode) */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 relative overflow-hidden p-12 text-white">
        {/* Fondo animado sutil (La Sinapsis de fondo) */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* Logo superior */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Synapse IPG</span>
        </div>

        {/* Contenido Central Inspiracional */}
        <div className="relative z-10 max-w-lg">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl font-bold tracking-tight mb-6 leading-tight"
            >
                Gestiona tus recursos de forma inteligente.
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-slate-400"
            >
                La plataforma centralizada para compartir, descubrir y colaborar en los proyectos de IPG. Accede a documentos, enlaces y herramientas en un solo lugar.
            </motion.p>
        </div>

        {/* Footer pequeño */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-500 font-medium">
            <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white">
                        <UsersIcon className="w-3 h-3"/>
                    </div>
                 ))}
            </div>
            <p>Únete y colabora con personal de IPG</p>
        </div>
      </div>

      {/* 🔐 SECCIÓN DERECHA: FORMULARIO (Clean UI) */}
      <div className="flex items-center justify-center bg-slate-50 p-6 lg:p-12 relative">
         {/* Decoración móvil (solo visible en celular para dar color) */}
         <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

         <div className="w-full max-w-md space-y-8">
            
            {/* Cabecera del Formulario con Transición */}
            <div className="text-center space-y-2">
                <motion.div 
                    key={viewState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="lg:hidden w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-blue-200 shadow-xl">
                         <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {viewState === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                    </h2>
                    <p className="text-slate-500">
                        {viewState === 'login' 
                            ? 'Ingresa tus credenciales para acceder al dashboard.' 
                            : 'Completa el formulario para registrarte en IPG.'}
                    </p>
                </motion.div>
            </div>

            {/* Contenedor del Formulario con AnimatePresence para suavidad */}
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                required 
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    {viewState === 'login' && (
                        <Dialog>
                        <DialogTrigger asChild>
                            <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                            ¿Olvidaste tu contraseña?
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Recuperar Acceso</DialogTitle>
                            <DialogDescription>
                                Te enviaremos un enlace seguro a tu correo corporativo para restablecerla.
                            </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleReset} className="space-y-4 mt-2">
                                <div className="space-y-2">
                                    <Label>Correo electrónico</Label>
                                    <Input name="email" type="email" placeholder="tu@ipg.cl" required />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : "Enviar enlace de recuperación"}
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
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all pr-10"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                required 
                                minLength={6}
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-base shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer" 
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        viewState === 'login' ? (
                            <span className="flex items-center gap-2">Ingresar <ArrowRight className="w-4 h-4" /></span>
                        ) : (
                            <span className="flex items-center gap-2">Registrarse <CheckCircle2 className="w-4 h-4" /></span>
                        )
                    )}
                </Button>
                </form>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center">
                <p className="text-sm text-slate-500">
                    {viewState === 'login' ? "¿Aún no tienes cuenta? " : "¿Ya tienes una cuenta? "}
                    <button 
                        type="button"
                        onClick={() => setViewState(viewState === 'login' ? 'register' : 'login')}
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded cursor-pointer"
                    >
                        {viewState === 'login' ? "Solicitar acceso" : "Iniciar Sesión"}
                    </button>
                </p>
            </div>

         </div>

         {/* Footer Legal (Copyright) */}
         <div className="absolute bottom-6 text-center w-full text-xs text-slate-400">
            © 2025 IPG Synapse System. Todos los derechos reservados.
         </div>
      </div>
    </div>
  )
}

// Icono auxiliar para el footer de la izquierda
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
}