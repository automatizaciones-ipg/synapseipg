'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Download, Zap, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

// --- 1. DEFINICIÓN DE TIPOS ---
type ConfettiData = {
    id: number;
    left: number;        // Posición horizontal inicial (%)
    xMove: number;       // Cuánto se mueve lateralmente (px)
    rotate: number;      // Rotación final (deg)
    delay: number;       // Retraso de animación (s)
    color: string;       // Clase de color Tailwind
}

// --- 2. LÓGICA PURA (FUERA DEL COMPONENTE) ---
// Extraemos esto para mantener el componente limpio y performante
const generateConfettiParticles = (count: number): ConfettiData[] => {
    const colors = ["bg-blue-500", "bg-indigo-500", "bg-amber-400", "bg-emerald-500", "bg-purple-500"]

    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,           // 0% a 100%
        xMove: Math.random() * 400 - 200,    // -200px a 200px
        rotate: 360 * 2,                     // 720deg
        delay: Math.random() * 2,            // 0s a 2s
        color: colors[i % colors.length]
    }))
}

// --- 3. COMPONENTE DE PARTÍCULA INDIVIDUAL ---
const ConfettiParticle = ({ data }: { data: ConfettiData }) => (
    <motion.div
        initial={{ opacity: 1, y: -100, x: 0, rotate: 0 }}
        animate={{
            y: "110vh",
            x: data.xMove,
            rotate: data.rotate,
            opacity: [1, 1, 0]
        }}
        transition={{ duration: 4, delay: data.delay, ease: "easeOut" }}
        className={cn("absolute top-0 w-3 h-3 rounded-sm pointer-events-none", data.color)}
        style={{ left: `${data.left}%` }}
    />
)

// --- 4. COMPONENTE MANAGER DE CELEBRACIÓN ---
const Celebration = () => {
    const [particles, setParticles] = useState<ConfettiData[]>([])

    useEffect(() => {
        // SOLUCIÓN PROFESIONAL:
        // Usamos setTimeout para diferir el cálculo al siguiente ciclo del Event Loop.
        // 1. Evita el bloqueo del renderizado inicial (TBT).
        // 2. Soluciona el error de "synchronous setState in effect".
        // 3. Garantiza que solo corra en el cliente (no hydration errors).
        const timer = setTimeout(() => {
            setParticles(generateConfettiParticles(50))
        }, 0)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((p) => (
                <ConfettiParticle key={p.id} data={p} />
            ))}
        </div>
    )
}

// --- 5. PÁGINA PRINCIPAL ---
export default function CertificationPage() {
    const [isGenerating, setIsGenerating] = useState(true)
    const [showConfetti, setShowConfetti] = useState(false)

    // Datos simulados (en producción vendrían de useSession o Context)
    const userName = "Usuario IPG"
    const currentDate = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })

    useEffect(() => {
        // Secuencia coreografiada de la experiencia
        const timer1 = setTimeout(() => setIsGenerating(false), 2000)
        const timer2 = setTimeout(() => setShowConfetti(true), 2100)

        return () => { clearTimeout(timer1); clearTimeout(timer2) }
    }, [])

    const handleDownload = () => {
        // Aquí iría la integración con librerías como html2canvas o jspdf
        alert("Simulación: Certificado descargado en alta resolución.")
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">

            {/* FONDO INMERSIVO */}
            <div className="absolute inset-0 z-0 bg-[#0B1120]">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                {/* Orbes de luz ambiental */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* CAPA DE CELEBRACIÓN */}
            {showConfetti && <Celebration />}

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center space-y-10">

                {/* ENCABEZADO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center space-y-4"
                >
                    <Badge variant="outline" className="text-blue-300 border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm tracking-widest uppercase">
                        Academia Completada
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 tracking-tight">
                        ¡Felicidades, Experto!
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Has dominado el ecosistema Synapse. Ahora tienes el poder para gestionar, colaborar y optimizar flujos de trabajo como un profesional.
                    </p>
                </motion.div>

                {/* CONTENEDOR DEL CERTIFICADO */}
                <div className="relative group perspective-1000 w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                className="w-full aspect-[1.4/1] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-2xl"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
                                    <Zap className="h-16 w-16 text-blue-400 animate-bounce" />
                                </div>
                                <p className="text-blue-200 font-mono text-sm animate-pulse">Generando credencial criptográfica...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="certificate"
                                initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
                                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="relative w-full aspect-[1.4/1] md:aspect-[1.6/1] bg-white rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden border-8 border-double border-slate-100 flex flex-col"
                            >
                                {/* EFECTO SHINE (HOLOGRÁFICO) */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none skew-x-12 translate-x-[-100%] group-hover:animate-shine" />

                                {/* TEXTURA DE FONDO */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>

                                {/* ESQUINAS DORADAS */}
                                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-400 rounded-tl-lg z-10"></div>
                                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-400 rounded-tr-lg z-10"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-400 rounded-bl-lg z-10"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-400 rounded-br-lg z-10"></div>

                                <div className="flex-1 flex flex-col items-center justify-center z-10 p-8 md:p-12 text-center space-y-6">

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-10 w-10 bg-blue-900 rounded-lg flex items-center justify-center text-white">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold text-2xl text-slate-900 tracking-tighter">Synapse IPG</span>
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-sm font-serif text-slate-500 uppercase tracking-[0.2em]">Certificado de Excelencia</h2>
                                        <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 drop-shadow-sm">
                                            {userName}
                                        </h3>
                                    </div>

                                    <p className="text-slate-600 max-w-lg text-sm md:text-base leading-relaxed italic">
                                        Por haber completado exitosamente el programa de capacitación avanzada, demostrando dominio en gestión de recursos, seguridad y colaboración digital.
                                    </p>

                                    <div className="w-full h-px bg-slate-200 max-w-xs mx-auto my-4"></div>

                                    <div className="flex justify-between items-end w-full max-w-lg pt-4">
                                        <div className="text-left">
                                            <p className="text-xs text-slate-400 uppercase tracking-wider">Fecha de Emisión</p>
                                            <p className="font-bold text-slate-800">{currentDate}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="h-16 w-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200/50">
                                                <CheckCircle2 className="h-8 w-8 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-amber-600 mt-2 uppercase tracking-wide">Verificado</span>
                                        </div>
                                        <div className="text-right">
                                            {/* SVG INLINE PARA FIRMA (Cero assets externos pesados) */}
                                            <div className="h-10 w-32 flex items-end justify-end opacity-70">
                                                <svg viewBox="0 0 200 60" className="w-full h-full fill-none stroke-slate-800 stroke-2">
                                                    <path d="M10,50 Q50,5 90,50 T180,30" />
                                                </svg>
                                            </div>
                                            <div className="h-px w-32 bg-slate-300 mt-1"></div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Firma Autorizada</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isGenerating ? 0 : 1 }}
                    transition={{ delay: 2.5 }}
                    className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center pb-12"
                >
                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12 px-6 gap-2 backdrop-blur-md"
                    >
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>

                    <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 shadow-[0_0_20px_rgba(37,99,235,0.5)] gap-2 hover:scale-105 transition-transform"
                    >
                        <Link href="/">
                            <LayoutDashboard className="h-4 w-4" />
                            Ir a mi Dashboard
                        </Link>
                    </Button>
                </motion.div>

            </div>
        </div>
    )
}