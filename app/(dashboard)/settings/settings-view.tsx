'use client'

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes" 

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  User, Shield, Sparkles, HardDrive, 
  LogOut, Loader2, Laptop, Camera, Trash2, AlertTriangle, Moon, Sun
} from "lucide-react"

import { toast } from "sonner"
import { updateProfileSettings } from "@/actions/settings"
import { UserProfile } from "@/types/settings"

// --- UTILS ---
function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// --- INTERFACES ---
interface SettingsViewProps {
  user: { email: string; id: string }
  profile: UserProfile 
  storageUsed: number
}

export function SettingsView({ user, profile, storageUsed }: SettingsViewProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const { theme, setTheme } = useTheme() // Quitamos resolvedTheme, no es necesario si forzamos el sistema
  const [mounted, setMounted] = useState(false)

  // Estados Locales
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  
  const [aiAutoTag, setAiAutoTag] = useState(profile.ai_autotag)
  const [emailNotifs, setEmailNotifs] = useState(profile.email_notifications)

  // --- ESTADO OPTIMISTA PARA EL TEMA ---
  // Inicializamos basado en props para evitar el flash, luego sincronizamos
  const [isDark, setIsDark] = useState(profile.theme === 'dark')

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const STORAGE_LIMIT = 500 * 1024 * 1024; 
  const storagePercentage = Math.min((storageUsed / STORAGE_LIMIT) * 100, 100)

  // Sincronización Inicial Robusta
  useEffect(() => {
    setMounted(true)
    // Prioridad: Base de datos > LocalStorage existente > Light Default
    if (profile.theme && profile.theme !== 'system') {
        setTheme(profile.theme)
        setIsDark(profile.theme === 'dark')
    } else {
        // Si por alguna razón es null, aseguramos light
        setIsDark(theme === 'dark')
    }
  }, [profile.theme, setTheme, theme])

  // --- LOGIC: THEME & PREFERENCES (OPTIMISTIC UI) ---
  const handleThemeToggle = async (checked: boolean) => {
    // 1. UI INSTANTÁNEA (Cero Lag)
    setIsDark(checked)
    const newTheme = checked ? "dark" : "light"
    
    // 2. Aplicar tema (Next-Themes maneja el DOM)
    setTheme(newTheme)

    // 3. Persistir en DB (Asíncrono, no bloquea UI)
    try { 
        await updateProfileSettings({ theme: newTheme }) 
    } catch (error) { 
        console.error("Error guardando tema en DB", error)
        // Opcional: Revertir si falla, aunque raramente vale la pena el parpadeo
    }
  }

  const handlePreferenceToggle = async (type: 'email' | 'ai', value: boolean) => {
      if (type === 'email') setEmailNotifs(value)
      if (type === 'ai') setAiAutoTag(value)
      const payload = type === 'email' ? { emailNotifs: value } : { aiAutoTag: value }
      const result = await updateProfileSettings(payload)
      if (!result.success) {
          toast.error("No se pudo guardar la preferencia")
          if (type === 'email') setEmailNotifs(!value)
          if (type === 'ai') setAiAutoTag(!value)
      } else {
          toast.success("Preferencia guardada")
      }
  }

  // --- LOGIC: AVATAR & PROFILE ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) { toast.error("El archivo debe ser una imagen"); return }
      if (file.size > 2 * 1024 * 1024) { toast.error("La imagen debe pesar menos de 2MB"); return }

      setUploadingImage(true)
      const toastId = toast.loading("Subiendo nueva foto...")

      try {
          const fileExt = file.name.split('.').pop()
          const filePath = `${user.id}-${Date.now()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
          if (uploadError) throw uploadError
          
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
          const publicUrl = urlData.publicUrl

          const result = await updateProfileSettings({ avatarUrl: publicUrl })
          if (!result.success) throw new Error(result.message)

          setAvatarUrl(publicUrl)
          toast.success("Foto actualizada", { id: toastId })
          router.refresh()
      } catch (error) {
          console.error(error)
          toast.error("Error al subir imagen", { id: toastId })
      } finally {
          setUploadingImage(false)
      }
  }

  const handleSaveProfile = async () => {
      setLoading(true)
      try {
          const result = await updateProfileSettings({ fullName, bio })
          if (result.success) {
              toast.success("Perfil actualizado")
              router.refresh()
          } else {
              toast.error("Error al guardar")
          }
      } catch (error) {
          toast.error("Error de conexión")
      } finally {
          setLoading(false)
      }
  }

  // --- LOGIC: LOGOUT ---
  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Sesión cerrada")
    router.refresh()
    router.push('/login')
  }

  // --- LOGIC: DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.rpc('delete_own_account')
      if (error) throw error

      toast.success("Cuenta eliminada permanentemente.")
      router.refresh()
      router.push('/login')
    } catch (error) {
      console.error(error)
      toast.error("Error crítico al eliminar la cuenta. Contacte soporte.")
      setIsDeleting(false)
    }
  }

  if (!mounted) return null 

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 p-6 text-white shadow-lg transition-colors">
         <div className="relative z-10 flex items-center gap-6">
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                    <AvatarImage src={avatarUrl || ""} className="object-cover" />
                    <AvatarFallback className="bg-white/10 text-white text-xl">
                        {(fullName || user.email).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                 </Avatar>
                 <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                     {uploadingImage ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage}/>
             </div>
             <div>
                <h2 className="text-2xl font-bold">{fullName || "Usuario"}</h2>
                <p className="text-blue-100">{user.email}</p>
             </div>
         </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">IA & Auto</TabsTrigger>
          <TabsTrigger value="danger">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            <Card>
               <CardHeader><CardTitle>Información Personal</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label>Nombre Completo</Label>
                     <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <Label>Biografía</Label>
                     <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}/>
                  </div>
               </CardContent>
               <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
                  <Button onClick={handleSaveProfile} disabled={loading} className="ml-auto">
                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Guardar
                  </Button>
               </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Laptop className="w-5 h-5"/> Apariencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Modo Oscuro</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isDark ? 'Activado' : 'Desactivado'}
                      </p>
                    </div>
                    {/* USAMOS EL ESTADO LOCAL 'isDark' PARA LA RESPUESTA INSTANTÁNEA */}
                    <Switch 
                        checked={isDark} 
                        onCheckedChange={handleThemeToggle} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificaciones por Email</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recibir resumen semanal.</p>
                    </div>
                    <Switch checked={emailNotifs} onCheckedChange={(val) => handlePreferenceToggle('email', val)} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                 <CardHeader><CardTitle className="text-blue-700 dark:text-blue-400">Uso de Supabase</CardTitle></CardHeader>
                 <CardContent>
                    <div className="flex justify-between text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                       <span>{formatBytes(storageUsed)}</span>
                       <span>500 MB</span>
                    </div>
                    <Progress value={storagePercentage} className="h-2" />
                 </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
               <CardTitle className="text-purple-600 dark:text-purple-400">Inteligencia Artificial</CardTitle>
               <CardDescription>Controla el comportamiento de Gemini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-white dark:bg-slate-950">
                   <div className="space-y-0.5">
                      <Label className="text-base font-semibold">Auto-Etiquetado</Label>
                      <p className="text-sm text-slate-500">Analizar contenido automáticamente al subir.</p>
                   </div>
                   <Switch checked={aiAutoTag} onCheckedChange={(val) => handlePreferenceToggle('ai', val)} />
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6 space-y-6">
           <Card className="border-red-100 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900">
              <CardHeader>
                 <CardTitle className="text-red-600 flex items-center gap-2">
                    <Shield className="w-5 h-5"/> Zona de Peligro
                 </CardTitle>
                 <CardDescription>Acciones irreversibles sobre tu cuenta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 
                 <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white dark:bg-slate-950 dark:border-red-900/50">
                    <div>
                       <h4 className="font-semibold text-slate-900 dark:text-white">Cerrar Sesión</h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400">Finalizar tu sesión en este dispositivo.</p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:bg-transparent dark:hover:bg-red-950 dark:border-red-900"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                    </Button>
                 </div>

                 <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/30 dark:border-red-900/50">
                    <div>
                       <h4 className="font-bold text-red-700 dark:text-red-400">Eliminar Cuenta</h4>
                       <p className="text-sm text-red-600/80 dark:text-red-400/70">
                           Borrar permanentemente tu cuenta y todos tus datos.
                       </p>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-red-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            ¿Estás absolutamente seguro?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer y es irreversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                          <p>Esto eliminará permanentemente:</p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                              <li>Tu cuenta de usuario y perfil.</li>
                              <li>Todos los recursos y archivos que hayas subido.</li>
                              <li>Tus membresías en grupos.</li>
                              <li>Tus favoritos y configuraciones.</li>
                          </ul>
                        </div>

                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault() 
                                handleDeleteAccount()
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                          >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                "Sí, eliminar mi cuenta"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                 </div>

              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}