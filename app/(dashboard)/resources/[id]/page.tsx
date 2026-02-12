import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, FileType, HardDrive, Calendar, Tag, Info, 
  Download, ExternalLink, Globe, Youtube, Cloud, Layout, 
  ShieldCheck, CheckCircle2, FileText, Image as ImageIcon, Box, 
  PlayCircle, Eye, FileSpreadsheet, Presentation, Music, FileCode,
  FileQuestion 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Resource, Profile } from "@/types"
import { ShareResourceButton } from "@/components/dashboard/share-button"

// --- UTILIDADES ---
function formatBytes(bytes: number, decimals = 2) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function getInitials(name: string) {
  return name.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase() || "U"
}

function isImgUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff)(\?.*)?$/i.test(url);
}

function getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// --- TIPOS ---
interface Props {
  params: Promise<{ id: string }>
}

interface ResourceWithExtras extends Omit<Resource, 'profiles'> {
  profiles: Profile | null; 
  resource_shares: { user_id: string; profiles: Profile }[];
  resource_group_shares: { group: { id: string; name: string } }[];
}

// --- COMPONENTE PRINCIPAL ---
export default async function ResourceDetailPage(props: Props) {
  const params = await props.params
  const resourceId = params.id
  const supabase = await createClient()

  // 1. OBTENCIÓN DE DATOS
  let resource: ResourceWithExtras | null = null;

  const { data: fullData, error: fullError } = await supabase
    .from('resources')
    .select(`
      *,
      profiles ( full_name, email, avatar_url ),
      resource_shares ( user_id, profiles ( full_name, email, avatar_url ) ),
      resource_group_shares ( group:groups ( id, name ) )
    `)
    .eq('id', resourceId)
    .single()

  if (fullError) {
    const { data: basicData, error: basicError } = await supabase
      .from('resources')
      .select(`*, profiles ( full_name, email, avatar_url )`)
      .eq('id', resourceId)
      .single()

    if (basicError || !basicData) return notFound() 
    
    resource = { 
      ...basicData, 
      resource_shares: [], 
      resource_group_shares: [] 
    } as unknown as ResourceWithExtras
  } else {
    resource = fullData as unknown as ResourceWithExtras
  }

  // 2. GENERACIÓN DE URLS FIRMADAS (Visualización y Descarga)
  const isLink = resource.file_type === 'link' || !resource.file_path;
  
  // URL por defecto (para links externos o fallback)
  let targetUrl = resource.file_url || '#';
  // URL específica para forzar la descarga del archivo binario
  let downloadUrl = targetUrl; 

  if (!isLink && resource.file_path) {
    // A. URL para Visualización (inline) - Validez extendida para visores externos
    const { data: viewData } = await supabase.storage
      .from('resources') // Asegúrate que este sea el nombre correcto de tu bucket. En tu código anterior usabas 'files', aquí asumo 'resources' o ajustalo.
      .createSignedUrl(resource.file_path, 7200) // 2 horas para dar tiempo a visores externos

    if (viewData) targetUrl = viewData.signedUrl

    // B. URL para Descarga (attachment) - Fuerza al navegador a descargar
    const { data: dlData } = await supabase.storage
      .from('resources')
      .createSignedUrl(resource.file_path, 3600, {
        download: true // Esto añade Content-Disposition: attachment
      })

    if (dlData) downloadUrl = dlData.signedUrl
  }

  // 3. LÓGICA VISUAL MEJORADA
  const getResourceMeta = () => {
    const url = (targetUrl || "").toLowerCase();
    // Priorizamos la extensión real del archivo si existe path, sino la del link
    const pathExt = resource.file_path?.split('.').pop()?.toLowerCase();
    const urlExt = url.split('.').pop()?.split('?')[0]?.toLowerCase();
    const ext = pathExt || urlExt || "";
    
    const type = (resource.file_type || "").toLowerCase();
    
    if (isLink) {
      if (url.includes("youtube") || url.includes("youtu.be")) 
        return { icon: Youtube, color: "text-red-500", label: "YouTube Video", bg: "bg-red-500/10", border: "border-red-500/20" }
      
      // Google Workspace
      if (url.includes("docs.google.com/spreadsheets"))
        return { icon: FileSpreadsheet, color: "text-emerald-500", label: "Google Sheets", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
      if (url.includes("docs.google.com/document"))
        return { icon: FileText, color: "text-blue-500", label: "Google Docs", bg: "bg-blue-500/10", border: "border-blue-500/20" }
      if (url.includes("docs.google.com/presentation"))
        return { icon: Presentation, color: "text-orange-500", label: "Google Slides", bg: "bg-orange-500/10", border: "border-orange-500/20" }
      if (url.includes("docs.google.com/forms"))
        return { icon: FileQuestion, color: "text-purple-500", label: "Google Forms", bg: "bg-purple-500/10", border: "border-purple-500/20" }
      if (url.includes("drive.google")) 
        return { icon: Cloud, color: "text-sky-500", label: "Google Drive", bg: "bg-sky-500/10", border: "border-sky-500/20" }

      if (url.includes("figma")) 
        return { icon: Layout, color: "text-purple-500", label: "Figma Design", bg: "bg-purple-500/10", border: "border-purple-500/20" }
      
      if (isImgUrl(url))
        return { icon: ImageIcon, color: "text-pink-500", label: "Imagen Externa", bg: "bg-pink-500/10", border: "border-pink-500/20" }
    }

    // Archivos Locales o Tipos definidos
    if (type.includes("image") || isImgUrl(url)) return { icon: ImageIcon, color: "text-pink-500", label: "Imagen", bg: "bg-pink-500/10", border: "border-pink-500/20" }
    if (type.includes("pdf") || ext === 'pdf') return { icon: FileText, color: "text-red-500", label: "Documento PDF", bg: "bg-red-500/10", border: "border-red-500/20" }
    if (type.includes("video")) return { icon: PlayCircle, color: "text-violet-500", label: "Video", bg: "bg-violet-500/10", border: "border-violet-500/20" }
    if (type.includes("audio")) return { icon: Music, color: "text-cyan-500", label: "Audio", bg: "bg-cyan-500/10", border: "border-cyan-500/20" }
    
    // Office Checks
    if (['xls', 'xlsx', 'csv'].includes(ext)) return { icon: FileSpreadsheet, color: "text-emerald-600", label: "Hoja de Cálculo", bg: "bg-emerald-600/10", border: "border-emerald-600/20" }
    if (['doc', 'docx', 'rtf'].includes(ext)) return { icon: FileText, color: "text-blue-600", label: "Documento Word", bg: "bg-blue-600/10", border: "border-blue-600/20" }
    if (['ppt', 'pptx'].includes(ext)) return { icon: Presentation, color: "text-orange-500", label: "Presentación", bg: "bg-orange-500/10", border: "border-orange-500/20" }
    if (['txt', 'json', 'js', 'css', 'md'].includes(ext)) return { icon: FileCode, color: "text-slate-600", label: "Texto/Código", bg: "bg-slate-600/10", border: "border-slate-600/20" }

    return { icon: Globe, color: "text-blue-500", label: isLink ? "Enlace Web" : "Archivo", bg: "bg-blue-500/10", border: "border-blue-500/20" }
  }
  
  const meta = getResourceMeta()
  const TypeIcon = meta.icon
  const author = resource.profiles
  const fileType = resource.file_type?.toLowerCase() || ""

  // --- PREVIEWER MAESTRO ---
  const renderPreview = () => {
    // Usamos el path extension para mayor precisión en archivos subidos
    const pathExt = resource.file_path?.split('.').pop()?.toLowerCase();
    const urlExt = targetUrl.split('.').pop()?.split('?')[0]?.toLowerCase(); // Fallback
    const ext = pathExt || urlExt || "";

    const PreviewLabel = () => (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg pointer-events-none">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-white tracking-wide uppercase">Vista Previa</span>
        </div>
    );

    // 1. IMÁGENES (Prioridad Alta)
    const isImage = fileType.startsWith('image/') || (isLink && isImgUrl(targetUrl)) || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext);
    
    if (isImage) {
        return (
            <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/50">
                <PreviewLabel />
                {/* Fondo difuminado para efecto ambient */}
                <div className="absolute inset-0 z-0 opacity-50 blur-3xl scale-110" style={{ backgroundImage: `url(${targetUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
                {/* Imagen principal */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={targetUrl} alt={resource.title} className="relative z-10 w-auto h-auto max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg" />
            </div>
        )
    }

    // 2. PDF (Nativo)
    const isPdf = fileType === 'application/pdf' || ext === 'pdf';
    if (isPdf) {
        return (
            <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
                <PreviewLabel />
                {/* Usamos object o iframe. Object suele ser mejor para PDFs */}
                <object data={targetUrl} type="application/pdf" className="w-full h-full">
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <p>No se puede visualizar el PDF directamente.</p>
                        <a href={downloadUrl} className="text-blue-500 underline mt-2">Descargar PDF</a>
                    </div>
                </object>
            </div>
        )
    }

    // 3. VIDEO
    const isVideo = fileType.startsWith('video/') || ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
    if (isVideo) {
        return (
            <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
                <PreviewLabel />
                <video controls className="max-h-[600px] w-full" controlsList="nodownload">
                    <source src={targetUrl} type={fileType.startsWith('video/') ? fileType : undefined} />
                    Tu navegador no soporta la reproducción de video.
                </video>
            </div>
        )
    }

    // 4. AUDIO
    const isAudio = fileType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
    if (isAudio) {
        return (
             <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-xl border border-white/10">
                <PreviewLabel />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 to-blue-900/30"></div>
                <div className="z-10 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 flex flex-col items-center gap-4 w-full max-w-md mx-4">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 animate-pulse">
                        <Music className="w-8 h-8" />
                    </div>
                    <audio controls className="w-full" controlsList="nodownload">
                        <source src={targetUrl} />
                        Tu navegador no soporta audio.
                    </audio>
                </div>
            </div>
        )
    }

    // 5. GOOGLE WORKSPACE (Docs, Sheets, Slides)
    if (isLink && targetUrl.includes("docs.google.com")) {
       // Lógica existente para embeds de Google Drive...
       const match = targetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
       if (match && match[1]) {
           const fileId = match[1];
           let googleEmbedUrl = "";
           if (targetUrl.includes("/spreadsheets/")) googleEmbedUrl = `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
           else if (targetUrl.includes("/document/")) googleEmbedUrl = `https://docs.google.com/document/d/${fileId}/preview`;
           else if (targetUrl.includes("/presentation/")) googleEmbedUrl = `https://docs.google.com/presentation/d/${fileId}/preview`;
           else if (targetUrl.includes("/forms/")) googleEmbedUrl = `https://docs.google.com/forms/d/${fileId}/viewform?embedded=true`;

           if (googleEmbedUrl) {
               return (
                   <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-inner bg-white border border-slate-200">
                       <PreviewLabel />
                       <iframe src={googleEmbedUrl} className="w-full h-full" title="Google Workspace" allowFullScreen></iframe>
                   </div>
               );
           }
       }
    }

    // 6. YOUTUBE
    if (isLink) {
        const youtubeId = getYoutubeId(targetUrl);
        if (youtubeId) {
            return (
                <div className="w-full h-full relative flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl">
                    <PreviewLabel />
                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full aspect-video"></iframe>
                </div>
            )
        }
    }

    // 7. VISUALIZADOR UNIVERSAL (Office Files)
    // Para archivos .doc, .docx, .xls, .xlsx, .ppt, .pptx que son BINARIOS SUBIDOS (no links)
    const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'ai', 'psd'];
    if (officeExtensions.includes(ext)) {
        // EncodeURIComponent es crucial aquí para que Google Viewer entienda la URL firmada completa
        const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(targetUrl)}&embedded=true`;
        
        return (
            <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-inner bg-white border border-slate-200">
                <PreviewLabel />
                {/* Fallback visual si Google Viewer falla (común en entornos privados/locales) */}
                <iframe 
                    src={googleViewerUrl}
                    className="w-full h-full relative z-10"
                    title="Office Document Viewer"
                    frameBorder="0"
                ></iframe>
                {/* Capa inferior por si el iframe tarda o falla visualmente */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 -z-0">
                    <p className="text-slate-400 text-sm">Cargando vista previa de documento...</p>
                </div>
            </div>
        )
    }

    // 8. FALLBACK (Sin Vista Previa)
    return (
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-20">
            <div className={`
                w-32 h-32 rounded-full flex items-center justify-center mb-6 
                ${meta.bg} ${meta.border} border-2 relative
                before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-current before:opacity-10
            `}>
                <TypeIcon className={`w-14 h-14 ${meta.color}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Vista previa no disponible</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                Este recurso ({isLink ? "Enlace" : (fileType || "Archivo")}) está optimizado para su apertura directa.
            </p>
            <Button variant="outline" className="mt-6 gap-2" asChild>
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={!isLink ? "archivo" : undefined}>
                    {isLink ? <ExternalLink className="w-4 h-4"/> : <Download className="w-4 h-4"/>}
                    {isLink ? "Abrir Enlace" : "Descargar"}
                </a>
            </Button>
        </div>
    )
  }

  const date = new Date(resource.created_at).toLocaleDateString('es-CL', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      
      {/* --- FONDO ESPECTACULAR (AURORA MESH) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-500/20 to-purple-500/10 blur-[130px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-400/10 to-violet-400/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl ring-1 ring-white/10 mb-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-3xl -translate-y-1/2 translate-x-1/3`}></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
                <div className={`
                    w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shrink-0 
                    bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-2xl
                    group transition-transform duration-500 hover:scale-105 hover:rotate-2
                `}>
                    <TypeIcon className={`w-12 h-12 md:w-16 md:h-16 ${meta.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} />
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-3 delay-100">
                        <Badge className="bg-blue-600 hover:bg-blue-500 text-white border-0 px-3 py-1 text-xs uppercase tracking-widest font-bold shadow-lg shadow-blue-900/20">
                            {resource.category || "General"}
                        </Badge>
                        <Badge variant="outline" className="text-slate-300 border-white/10 backdrop-blur-sm">
                            {isLink ? "Recurso Externo" : "Archivo Local"}
                        </Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 animate-in fade-in slide-in-from-bottom-4 delay-200">
                        {resource.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-slate-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-5 delay-300">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>{date}</span>
                        </div>
                        {resource.file_size && (
                            <div className="flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-purple-400" />
                                <span>{formatBytes(resource.file_size)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-emerald-400" />
                             <span>Verificado por IPG</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- CONTENIDO GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMNA IZQUIERDA (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* --- VISOR DE RECURSO POTENCIADO --- */}
                <div className="group relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-xl transition-all duration-500 hover:shadow-2xl ring-1 ring-slate-200/50">
                    <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-black/5 to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-30"></div>
                    
                    <div className="bg-slate-50/50 w-full flex items-center justify-center min-h-[400px] p-4 md:p-6 relative">
                        {renderPreview()}
                    </div>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-slate-200/50 ring-1 ring-slate-200/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Info className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Sobre este recurso</h2>
                    </div>
                    
                    <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                        <p className="whitespace-pre-line">
                            {resource.description || "Sin descripción proporcionada."}
                        </p>
                    </div>

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-slate-100/50">
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Etiquetas Relacionadas
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map((tag) => (
                                    <span 
                                        key={tag} 
                                        className="px-4 py-1.5 bg-slate-100/50 border border-slate-200/50 rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-default"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMNA DERECHA: SIDEBAR STICKY (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                
                <div className="sticky top-6 space-y-6">
                    
                    {/* TARJETA DE ACCIONES */}
                    <Card className="border-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative bg-white/70 backdrop-blur-xl ring-1 ring-slate-200/50">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Box className="w-5 h-5 text-indigo-500" />
                                Acciones Rápidas
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4">
                            <Button 
                                className={`
                                    w-full h-14 text-lg font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
                                    bg-gradient-to-r ${isLink ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700'}
                                `}
                                asChild
                            >
                                {/* Usamos downloadUrl para asegurar descarga binaria */}
                                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download={!isLink ? resource.title : undefined}>
                                    {isLink ? <ExternalLink className="mr-2 w-5 h-5"/> : <Download className="mr-2 w-5 h-5"/>}
                                    {isLink ? "Abrir Recurso" : "Descargar Archivo"}
                                </a>
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200/50" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/50 backdrop-blur-md px-2 text-slate-400 font-medium rounded-full">O compartir</span>
                                </div>
                            </div>

                            <div className="bg-slate-50/50 p-1 rounded-xl ring-1 ring-slate-200/50">
                                <ShareResourceButton resourceId={resource.id} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* TARJETA DE AUTOR */}
                    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-md ring-1 ring-slate-200/50">
                        <CardContent className="p-5 flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-slate-100">
                                <AvatarImage src={author?.avatar_url || ""} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                    {getInitials(author?.full_name || "U")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Subido por</p>
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {author?.full_name || "Usuario Desconocido"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{author?.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* TARJETA DE METADATOS */}
                    <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-md overflow-hidden ring-1 ring-slate-200/50">
                        <div className="bg-slate-50/50 p-4 border-b border-slate-100/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                Detalles Técnicos
                            </h3>
                        </div>
                        <div className="p-0">
                            {[
                                { label: "Tipo", value: isLink ? "Web Link" : (resource.file_type?.split('/')[1]?.toUpperCase() || 'ARCHIVO') },
                                { label: "Plataforma", value: meta.label },
                                { label: "Peso", value: resource.file_size ? formatBytes(resource.file_size) : "N/A" },
                                { label: "ID", value: resource.id.slice(0, 8) + "...", mono: true },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center px-5 py-3 border-b border-slate-100/50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                    <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                                    <span className={`text-sm font-bold text-slate-700 ${item.mono ? 'font-mono text-xs bg-slate-100/80 px-2 py-0.5 rounded' : ''}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
      </div>
    </div>
  )
}