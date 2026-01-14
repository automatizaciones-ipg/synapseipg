'use client'

import { useState } from 'react'
import { updatePassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Zap, Lock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    
    const formData = new FormData(event.currentTarget)
    const result = await updatePassword(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Contraseña actualizada correctamente')
      router.push('/') // Redirige al home/dashboard
    }
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      
      {/* 🎨 SECCIÓN IZQUIERDA: VISUAL & BRANDING (Idéntico a Login) */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 relative overflow-hidden p-12 text-white">
        <div className="absolute inset-0 z-0">
              <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Synapse IPG</span>
        </div>

        <div className="relative z-10 max-w-lg">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl font-bold tracking-tight mb-6 leading-tight"
            >
                Seguridad ante todo.
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-slate-400"
            >
                Establece una nueva contraseña segura para proteger tu cuenta y tus recursos en la plataforma Synapse.
            </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs text-slate-500 font-medium">
             <p>© 2025 IPG Synapse System</p>
        </div>
      </div>

      {/* 🔐 SECCIÓN DERECHA: FORMULARIO NUEVA CLAVE */}
      <div className="flex items-center justify-center bg-slate-50 p-6 lg:p-12 relative">
         <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

         <div className="w-full max-w-md space-y-8">
            
            <div className="text-center space-y-2">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-blue-200 shadow-xl">
                         <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Nueva Contraseña
                    </h2>
                    <p className="text-slate-500">
                        Ingresa y confirma tu nueva clave de acceso.
                    </p>
                </motion.div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <div className="relative">
                        <Input 
                            id="password" 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            minLength={6}
                            placeholder="••••••••"
                            disabled={loading}
                            className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all pr-10 disabled:opacity-50"
                        />
                        <button 
                            type="button"
                            disabled={loading}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        required 
                        minLength={6}
                        placeholder="••••••••"
                        disabled={loading}
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:opacity-50"
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-base shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">Actualizar Clave <CheckCircle2 className="w-4 h-4" /></span>
                    )}
                </Button>
                </form>
            </div>

         </div>

         <div className="absolute bottom-6 text-center w-full text-xs text-slate-400">
            © 2025 IPG Synapse System. Seguridad garantizada.
         </div>
      </div>
    </div>
  )
}