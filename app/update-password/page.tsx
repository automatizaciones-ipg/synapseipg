'use client'

import { useState } from 'react'
import { updatePassword } from './actions' // 👇 Ver paso 4
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Zap, LockKeyhole } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    const result = await updatePassword(formData)

    setLoading(false)
    if (result?.error) {
        toast.error(result.error)
    } else {
        toast.success("Contraseña actualizada correctamente")
        // La redirección ocurre en el server action
    }
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* 🎨 BRANDING (Igual al Login) */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-950 relative overflow-hidden p-12 text-white">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">Synapse IPG</span>
        </div>
        <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Recuperación de Seguridad</h1>
            <p className="text-lg text-slate-400">Establece una nueva contraseña robusta para proteger tu cuenta y recursos.</p>
        </div>
        <div className="relative z-10 text-xs text-slate-500">Sistema Seguro IPG</div>
      </div>

      {/* 🔐 FORMULARIO */}
      <div className="flex items-center justify-center bg-slate-50 p-6 lg:p-12">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                     <LockKeyhole className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Nueva Contraseña</h2>
                <p className="text-slate-500 mt-2">Ingresa tu nueva clave para finalizar el proceso.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>
                        <div className="relative">
                            <Input 
                                id="password" name="password" 
                                type={showPassword ? "text" : "password"} 
                                required minLength={6}
                                className="pr-10"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input 
                            id="confirmPassword" name="confirmPassword" 
                            type="password" required minLength={6}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Actualizar y Entrar"}
                    </Button>
                </form>
            </div>
         </div>
      </div>
    </div>
  )
}