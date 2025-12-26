'use client'

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { 
  User, Shield, Sparkles, HardDrive, 
  LogOut, Loader2, Laptop 
} from "lucide-react"
import { toast } from "sonner"
import { updateProfileSettings } from "@/actions/settings"

// Función auxiliar para formatear bytes
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

interface SettingsViewProps {
  user: {
    email: string
    id: string
  }
  profile: {
    full_name: string | null
    avatar_url: string | null
    bio?: string | null // Añadimos bio al tipo
  }
  storageUsed: number // Dato real en bytes
}

export function SettingsView({ user, profile, storageUsed }: SettingsViewProps) {
  const [loading, setLoading] = useState(false)
  
  // Estado del Formulario
  const [fullName, setFullName] = useState(profile.full_name || "")
  // Iniciamos la bio con el dato real de la BD o un string vacío
  const [bio, setBio] = useState(profile.bio || "")
  
  // Preferencias
  const [aiAutoTag, setAiAutoTag] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [themeSystem, setThemeSystem] = useState(true) // Estado para el switch de tema

  // Lógica de Almacenamiento
  const STORAGE_LIMIT = 500 * 1024 * 1024; // Ejemplo: Límite de 500MB (Ajustable)
  const storagePercentage = Math.min((storageUsed / STORAGE_LIMIT) * 100, 100)

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Enviamos también la preferencia de tema si tuvieras la columna
      const result = await updateProfileSettings({ 
        fullName, 
        bio,
        themePreference: themeSystem ? 'system' : 'light' 
      })
      
      if (result.success) {
        toast.success("Perfil actualizado correctamente")
      } else {
        toast.error("Error al guardar en base de datos")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER DE PERFIL */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="relative z-10 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback className="bg-white/10 text-white text-xl">
              {(fullName || user.email).substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{fullName || "Usuario Sin Nombre"}</h2>
            <p className="text-blue-100">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              {/* CAMBIO: Badge dice "Activo" en lugar de Plan Pro */}
              <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-medium text-green-100 border border-green-400/30 backdrop-blur-md">
                Estado: Activo
              </span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* CAMBIO: Eliminamos la pestaña de "Plan" */}
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">IA & Auto</TabsTrigger>
          <TabsTrigger value="danger">Cuenta</TabsTrigger>
        </TabsList>

        {/* --- PESTAÑA GENERAL --- */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Editar Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-slate-500"/> Información Personal</CardTitle>
                <CardDescription>Esta información es visible y editable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Biografía Corta</Label>
                  <Textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Escribe algo sobre ti..." 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico</Label>
                  <Input value={user.email} disabled className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                  <p className="text-[10px] text-slate-400">El correo no se puede editar por seguridad.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-4">
                <Button onClick={handleSaveProfile} disabled={loading} className="ml-auto">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>

            {/* Preferencias y Almacenamiento */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Laptop className="w-5 h-5 text-slate-500"/> Apariencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Tema del Sistema</Label>
                      <p className="text-sm text-slate-500">Sincronizar con el modo claro/oscuro de tu dispositivo.</p>
                    </div>
                    {/* CAMBIO: Switch habilitado para guardar preferencia */}
                    <Switch checked={themeSystem} onCheckedChange={setThemeSystem} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notificaciones por Email</Label>
                      <p className="text-sm text-slate-500">Recibir resumen semanal.</p>
                    </div>
                    <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                  </div>
                </CardContent>
              </Card>

              {/* Almacenamiento REAL */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700"><HardDrive className="w-5 h-5"/> Uso de Supabase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-blue-900">
                    <span>Usado: {formatBytes(storageUsed)}</span>
                    <span>Total Disponible: 500 MB</span> 
                  </div>
                  
                  {/* Barra de progreso real */}
                  <Progress 
                    value={storagePercentage} 
                    className="h-2 bg-blue-200 [&>div]:bg-blue-600" 
                  />
                  
                  <p className="text-xs text-blue-500 pt-1">
                    Este es el almacenamiento real ocupado por tus archivos en la nube.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- PESTAÑA IA --- */}
        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-purple-600"><Sparkles className="w-5 h-5"/> Inteligencia Artificial (Gemini)</CardTitle>
                  <CardDescription>Configura cómo la IA te ayuda a organizar tus recursos.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">Beta</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-white">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Auto-Etiquetado Inteligente</Label>
                    <p className="text-sm text-slate-500">Permitir que la IA analice el contenido y sugiera tags al subir.</p>
                  </div>
                  <Switch checked={aiAutoTag} onCheckedChange={setAiAutoTag} />
               </div>
               
               <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-white">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Detección de Enlaces</Label>
                    <p className="text-sm text-slate-500">Extraer automáticamente títulos y metadatos de URLs pegadas.</p>
                  </div>
                  <Switch checked={true} disabled />
               </div>

               <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                  <p><strong>Nota de Privacidad:</strong> Tus datos se envían a Gemini (Google) solo para análisis momentáneo y no se usan para entrenar modelos públicos.</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- PESTAÑA DANGER --- */}
        <TabsContent value="danger" className="mt-6">
          <Card className="border-red-100 bg-red-50/30">
             <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2"><Shield className="w-5 h-5"/> Zona de Peligro</CardTitle>
                <CardDescription>Acciones irreversibles sobre tu cuenta.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-white">
                   <div>
                      <h4 className="font-semibold text-slate-900">Cerrar Sesión</h4>
                      <p className="text-sm text-slate-500">Finalizar tu sesión actual en este dispositivo.</p>
                   </div>
                   <form action="/auth/signout" method="post">
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                         <LogOut className="w-4 h-4 mr-2" />
                         Salir
                      </Button>
                   </form>
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}