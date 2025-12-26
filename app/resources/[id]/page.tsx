import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft, Download, ExternalLink, Calendar, FileText, 
  ShieldCheck, Globe, Youtube, Cloud, Layout, Users, Mail
} from "lucide-react"
import Link from "next/link" 
import { Resource, Profile } from "@/types" 
import { ShareResourceButton } from "@/components/dashboard/share-button"
import { FavoriteButton } from "@/components/resources/favorite-button"

interface Props {
  params: Promise<{ id: string }>
}

interface ResourceWithExtras extends Resource {
  resource_shares: {
    user_id: string
    profiles: Profile 
  }[]
}

export default async function ResourceDetailPage(props: Props) {
  const params = await props.params
  const resourceId = params.id
  const supabase = await createClient()

  // 1. Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Obtener el recurso y sus relaciones
  const { data: rawResource, error } = await supabase
    .from('resources')
    .select(`
      *,
      profiles (
        full_name,
        email,
        avatar_url
      ),
      resource_shares (
         user_id,
         profiles (
           full_name, 
           email, 
           avatar_url
         )
      )
    `)
    .eq('id', resourceId)
    .single()

  if (error || !rawResource) {
    notFound()
  }

  // 3. ESTADO INICIAL DEL SERVIDOR
  // Se lo pasamos al botón para que tenga algo que mostrar mientras carga.
  // Pero el botón verificará si es verdad o mentira apenas cargue.
  let isFavoriteServer = false;
  if (user) {
    const { data: favData } = await supabase
      .from('favorites') 
      .select('id')
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .maybeSingle()
    
    isFavoriteServer = !!favData
  }

  const resource = rawResource as unknown as ResourceWithExtras

  // Estilos
  const isLink = resource.file_type === 'link' || !resource.file_path;
  const targetUrl = resource.file_url || '#';

  const getResourceStyle = () => {
    const url = (targetUrl || "").toLowerCase();
    if (isLink) {
      if (url.includes("youtube") || url.includes("youtu.be")) return { color: "#EF4444", icon: Youtube, label: "Video" }
      if (url.includes("drive.google") || url.includes("docs.google")) return { color: "#0F9D58", icon: Cloud, label: "Drive" }
      if (url.includes("figma") || url.includes("canva")) return { color: "#A259FF", icon: Layout, label: "Diseño" }
      return { color: "#64748B", icon: Globe, label: "Enlace Web" }
    }
    return { color: "#3B82F6", icon: FileText, label: "Archivo Físico" }
  }

  const style = getResourceStyle()
  const IconComponent = style.icon
  const date = new Date(resource.created_at).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  const author = resource.profiles
  const authorName = author?.full_name || 'Usuario IPG'
  const authorEmail = author?.email || ''
  const authorAvatar = author?.avatar_url
  const authorInitials = authorName.substring(0, 2).toUpperCase()
  const fileSizeMB = resource.file_size ? (resource.file_size / 1024 / 1024).toFixed(2) : '0.00';
  const sharedUsers = resource.resource_shares || []

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 px-6 mt-6 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          prefetch={false} // Evitamos caché vieja al volver
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
        </Link>
        
        {/* BOTÓN INTELIGENTE */}
        {/* Ya no usamos 'key' compleja. El botón verifica su propio estado. */}
        <FavoriteButton 
          resourceId={resource.id} 
          initialIsFavorite={isFavoriteServer} 
        />
      </div>

      {/* HEADER PRINCIPAL */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0" style={{ backgroundColor: style.color }}>
            <IconComponent className="w-10 h-10" />
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 px-3 py-1">{resource.category}</Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-600" style={{ color: style.color, borderColor: style.color }}>{style.label}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{resource.title}</h1>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{date}</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /><span>Verificado por IPG</span></div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          <div className="prose prose-slate max-w-none">
             <h3 className="text-xl font-semibold text-slate-900 mb-3">Descripción</h3>
             <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
               {resource.description || "Sin descripción detallada."}
             </p>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200">#{tag}</Badge>
              ))}
            </div>
          )}

          <Card className={`border-2 border-dashed ${isLink ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-white rounded-full shadow-sm border ${isLink ? 'border-blue-100' : 'border-slate-100'}`}>
                  {isLink ? <Globe className="w-6 h-6 text-blue-500"/> : <Download className="w-6 h-6 text-green-500"/>}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{isLink ? "Recurso Externo" : "Archivo Adjunto"}</p>
                  <p className="text-sm text-slate-500">{isLink ? "Enlace externo seguro." : `Listo para descargar (${fileSizeMB} MB est.)`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <ShareResourceButton resourceId={resource.id} />

                {isLink ? (
                  <Button className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white gap-2" size="lg" asChild>
                    <a href={targetUrl} target="_blank" rel="noopener noreferrer">Ir al Enlace <ExternalLink className="w-4 h-4"/></a>
                  </Button>
                ) : (
                  <Button className="flex-1 sm:flex-initial gap-2" size="lg" asChild>
                    <a href={targetUrl} target="_blank" download>Descargar <Download className="w-4 h-4"/></a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-base font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-slate-500"/> Publicado por</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={authorAvatar || ""} />
                  <AvatarFallback className="bg-slate-900 text-white font-bold">{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-semibold text-slate-900 text-sm truncate" title={authorName}>{authorName}</p>
                  <p className="text-xs text-slate-500 truncate" title={authorEmail}>{authorEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-medium text-slate-500 flex justify-between items-center">
                  <span>Miembros con acceso</span>
                  <Badge variant="secondary" className="text-xs font-normal">{sharedUsers.length}</Badge>
                </CardTitle>
             </CardHeader>
             
             <CardContent className="p-0">
               {sharedUsers.length > 0 ? (
                 <div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
                   {sharedUsers.map((share, idx) => (
                     <div key={idx} className="flex items-center gap-3 p-3 border-b last:border-0 hover:bg-slate-50 transition-colors">
                       <Avatar className="h-9 w-9 border border-slate-100">
                          <AvatarImage src={share.profiles?.avatar_url || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                            {(share.profiles?.full_name || share.profiles?.email || "U").substring(0,2).toUpperCase()}
                          </AvatarFallback>
                       </Avatar>
                       <div className="flex-1 overflow-hidden">
                         <p className="text-sm font-medium text-slate-900 truncate">
                           {share.profiles?.full_name || "Usuario Sin Nombre"}
                         </p>
                         <div className="flex items-center gap-1 text-xs text-slate-500">
                           <Mail className="w-3 h-3" />
                           <span className="truncate">{share.profiles?.email}</span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                   <Users className="w-8 h-8 mb-2 opacity-20" />
                   <p className="text-xs italic">Este recurso no se ha compartido con nadie aún.</p>
                 </div>
               )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}