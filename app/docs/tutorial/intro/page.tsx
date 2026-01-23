'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    ChevronRight,
    Lock,
    CheckCircle2,
    RefreshCw,
    Mail,
    LayoutDashboard,
    FolderClosed,
    Users,
    Settings,
    Cloud,
    Activity,
    Search,
    Bell,
    Menu,
    FileText,
    PieChart,
    ArrowUpRight,
    Zap // Aseguramos que Zap esté importado
} from "lucide-react"
import { TutorialCard } from "@/components/docs/tutorial-card"
import { cn } from "@/lib/utils"

// --- TIPOS PARA LA SIMULACIÓN ---
type LoginState = 'idle' | 'typing' | 'loading' | 'success'
type RecoveryStep = 'form' | 'sent'

export default function LessonOnePage() {
    // --- ESTADOS PARA INTERACTIVIDAD ---

    // 1. Login Simulator
    const [loginState, setLoginState] = useState<LoginState>('idle')

    // 2. Recovery Simulator
    const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('form')

    // 3. Dashboard Simulator (Live Data)
    const [dashboardActive, setDashboardActive] = useState(false)

    // Efecto para el simulador de Login
    const handleSimulateLogin = () => {
        setLoginState('typing')
        setTimeout(() => setLoginState('loading'), 800)
        setTimeout(() => setLoginState('success'), 2000)
    }

    // Efecto para el Dashboard (Live Data Simulation)
    useEffect(() => {
        const interval = setInterval(() => {
            setDashboardActive(prev => !prev)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ================================================================================== */}
            {/* HERO SECTION REEMPLAZADO: DASHBOARD FLOTANTE 3D CON FONDO ESPECTACULAR */}
            {/* ================================================================================== */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl group cursor-default perspective-container">

                {/* 1. FONDO AMBIENTAL (GRID + ORBS) */}
                <div className="absolute inset-0 z-0">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

                    {/* Glowing Orbs (Animados) */}
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse duration-[4000ms]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse duration-[5000ms]"></div>
                </div>

                {/* 2. CONTENIDO DEL INTRO */}
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 gap-12">

                    {/* Texto Intro (Izquierda) */}
                    <div className="flex-1 space-y-6 max-w-xl text-center lg:text-left">
                        <nav className="flex items-center justify-center lg:justify-start gap-2 text-sm text-blue-400 mb-2">
                            <span className="font-bold tracking-wider uppercase text-[10px] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">Academia Synapse</span>
                            <ChevronRight className="h-3 w-3 opacity-50" />
                            <span className="font-medium text-slate-400">1. Primeros Pasos</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                            Primeros Pasos<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                                Synapse IPG
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 leading-relaxed mx-auto lg:mx-0 max-w-md">
                            Gestiona recursos colaborativos de manera rápida y eficiente y crrea conección con usuarios y grupos internos de IPG.
                        </p>
                    </div>

                    {/* 3. EL DASHBOARD FLOTANTE 3D (Derecha) */}
                    <div className="flex-1 w-full max-w-[600px] relative perspective-[1200px] h-[400px] flex items-center justify-center">

                        {/* Wrapper que rota */}
                        <div className="relative w-full h-full transition-transform duration-700 ease-out transform lg:rotate-y-[-12deg] lg:rotate-x-[5deg] lg:group-hover:rotate-y-[-2deg] lg:group-hover:rotate-x-[2deg] preserve-3d">

                            {/* --- CAPA 1: DASHBOARD PRINCIPAL --- */}
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex overflow-hidden ring-1 ring-white/10">

                                {/* Sidebar Mockup */}
                                <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-4">
                                    {/* CAMBIO REALIZADO AQUÍ: Logo Synapse en lugar de Cloud */}
                                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/30">
                                        <Zap className="h-4 w-4 text-white fill-white" />
                                    </div>
                                    <div className="flex flex-col gap-3 w-full items-center mt-4">
                                        <div className="h-8 w-8 rounded-md bg-slate-800/50 flex items-center justify-center text-blue-400 border border-blue-500/20"><LayoutDashboard className="h-4 w-4" /></div>
                                        <div className="h-8 w-8 rounded-md hover:bg-slate-800/50 flex items-center justify-center text-slate-500 transition-colors"><FolderClosed className="h-4 w-4" /></div>
                                        <div className="h-8 w-8 rounded-md hover:bg-slate-800/50 flex items-center justify-center text-slate-500 transition-colors"><Users className="h-4 w-4" /></div>
                                    </div>
                                </div>

                                {/* Main Area Mockup */}
                                <div className="flex-1 bg-slate-900/50 p-4 flex flex-col gap-4">
                                    {/* Header Fake */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-8 w-48 bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center px-3 gap-2">
                                            <Search className="h-3 w-3 text-slate-500" />
                                            <div className="h-1.5 w-20 bg-slate-700 rounded-full opacity-50"></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700"></div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Card 1 */}
                                        <div className="col-span-2 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-3 relative overflow-hidden group/card">
                                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                            <div className="flex justify-between items-start">
                                                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                                                    <Activity className="h-4 w-4" />
                                                </div>
                                                <span className="text-[10px] text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                                                    <ArrowUpRight className="h-2 w-2" /> Recurso Compartido
                                                </span>
                                            </div>
                                            <div className="h-2 w-24 bg-slate-700 rounded-full mb-2"></div>
                                            <div className="h-2 w-16 bg-slate-700/50 rounded-full"></div>
                                        </div>
                                        {/* Card 2 */}
                                        <div className="h-24 bg-slate-800/50 rounded-xl border border-slate-700/50 p-3 flex flex-col justify-center items-center">
                                            <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center mb-1">
                                                <span className="text-[9px] text-white font-bold">+100</span>
                                            </div>
                                            <span className="text-[8px] text-slate-400 mt-1">Recursos</span>
                                        </div>
                                    </div>

                                    {/* List Mockup */}
                                    <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/30 p-3 space-y-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                                                <div className="h-6 w-6 rounded bg-slate-700 flex-shrink-0"></div>
                                                <div className="space-y-1 flex-1">
                                                    <div className="h-1.5 w-24 bg-slate-600 rounded-full"></div>
                                                    <div className="h-1.5 w-12 bg-slate-700 rounded-full opacity-50"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* --- CAPA 2: ELEMENTOS FLOTANTES (POP-OUT) --- */}
                            {/* Estos elementos tienen translate-z para dar efecto de profundidad real al rotar */}

                            {/* Floating Notification (Top Right) */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl shadow-blue-900/20 border border-slate-100 flex items-center gap-3 animate-[bounce_3s_infinite] lg:transform lg:translate-z-12">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">Recurso Actualizado</p>
                                    <p className="text-[10px] text-slate-500">Hace 2 segundos</p>
                                </div>
                            </div>

                            {/* Floating User Card (Bottom Left) */}
                            <div className="absolute -bottom-6 -left-2 bg-slate-800/90 backdrop-blur-md text-white rounded-xl p-3 shadow-2xl border border-slate-600 flex items-center gap-3 lg:transform lg:translate-z-8 transition-transform hover:scale-110 duration-300">
                                <div className="relative">
                                    <div className="h-9 w-9 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-xs font-bold">IPG</div>
                                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border border-slate-800 rounded-full"></span>
                                </div>
                                <div className="pr-2">
                                    <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Administrador</p>
                                    <p className="text-xs font-bold">IPG</p>
                                </div>
                            </div>

                            {/* Decorative Blur Glow Behind */}
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full transform scale-90 translate-y-4"></div>

                        </div>
                    </div>
                </div>
            </div>

            {/* FIN DEL HERO SECTION */}

            <div className="space-y-12">

                {/* ================================================================================== */}
                {/* PASO 1: LOGIN (AJUSTADO: BOTÓN AZUL Y TEXTO SIN SUPERPOSICIÓN) */}
                {/* ================================================================================== */}
                <TutorialCard
                    step="01"
                    title="Tu Credencial Digital Unificada"
                    description="El acceso a Synapse utiliza protocolos de seguridad para que puedas ingresar con tu correo corporativo y contraseña entregada por el administrador de manera controlada y segura."
                >
                    <div className="p-8 bg-slate-100 h-full min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
                        {/* Background Sutil */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                        {loginState !== 'success' ? (
                            <div className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 space-y-5 border border-slate-100 relative z-10 transition-all duration-300 hover:-translate-y-1">

                                {/* Header del Login */}
                                <div className="space-y-1 text-center mt-2">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Bienvenido</h3>
                                    <p className="text-sm text-slate-500">Ingresa tus credenciales institucionales</p>
                                </div>

                                {/* Formulario */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">Correo institucional</label>
                                        <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3.5 text-sm text-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all placeholder:text-slate-400">
                                            {loginState === 'idle' ? '' : 'usuario@ipg.cl'}
                                            {loginState === 'typing' && <span className="animate-pulse w-0.5 h-5 bg-blue-500 block ml-0.5"></span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">Contraseña</label>
                                        <div className="h-10 w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between px-3.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                            <div className="flex gap-1.5 items-center h-full w-full">
                                                {(loginState === 'loading' || loginState === 'typing') ? (
                                                    <>
                                                        <div className="h-2 w-2 rounded-full bg-slate-800"></div>
                                                        <div className="h-2 w-2 rounded-full bg-slate-800"></div>
                                                        <div className="h-2 w-2 rounded-full bg-slate-800"></div>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">••••••••</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón: Color AZUL (Coherente con paso 02) */}
                                <button
                                    disabled={loginState !== 'idle'}
                                    onClick={handleSimulateLogin}
                                    className="h-10 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-500/20 mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                                >
                                    {loginState === 'loading' ? (
                                        <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <>
                                            Ingresar a Synapse
                                            <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover/btn:translate-x-1 group-hover/btn:text-white" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl border border-emerald-100 p-10 flex flex-col items-center justify-center animate-in zoom-in duration-300 relative z-10">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 animate-in slide-in-from-bottom-2">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-emerald-950 font-bold text-xl mb-1">¡Acceso Correcto!</h3>
                                <p className="text-slate-500 text-xs text-center mb-6">Tus credenciales han sido verificadas.</p>

                                <button onClick={() => setLoginState('idle')} className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1.5 transition-colors px-4 py-2 bg-slate-50 rounded-full">
                                    <RefreshCw className="h-3 w-3" /> Reiniciar prueba
                                </button>
                            </div>
                        )}

                        {/* Texto de Ayuda: Posicionado estáticamente (mt-6) para EVITAR SUPERPOSICIÓN */}
                        {loginState === 'idle' && (
                            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-200 shadow-sm z-10">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                Haz clic en el botón para simular
                            </div>
                        )}
                    </div>
                </TutorialCard>

                {/* PASO 2: RECUPERACIÓN INTERACTIVA */}
                <TutorialCard
                    step="02"
                    title="¿Olvidaste tu contraseña?, Recuperala de manera fácil y segura"
                    description="El sistema cuenta con un flujo de recuperación automatizado para ayudarte paso a paso de manera guiada e inmediata."
                >
                    <div className="p-6 bg-slate-100 h-full min-h-[300px] flex items-center justify-center">
                        <div className="w-full max-w-[320px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative mx-auto">
                            {/* Barra de título estilo navegador */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80"></div>
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></div>
                                </div>
                                <div className="ml-4 flex-1 h-5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 flex items-center px-2">
                                    synapse.ipg.cl/recovery
                                </div>
                            </div>

                            <div className="p-8">
                                {recoveryStep === 'form' ? (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="text-center space-y-2">
                                            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Lock className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <h4 className="font-bold text-slate-900">Recuperar Cuenta</h4>
                                            <p className="text-xs text-slate-500">Ingresa tu correo institucional para recibir un enlace temporal.</p>
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <div className="h-9 w-full bg-slate-50 border border-slate-200 rounded-md flex items-center pl-9 text-xs text-slate-600 font-medium">
                                                usuario@ipg.cl
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setRecoveryStep('sent')}
                                            className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200"
                                        >
                                            Enviar Enlace de Recuperación <ArrowRight className="h-3 w-3" />
                                        </button>
                                        <div className="text-center pt-2">
                                            <span className="text-[10px] font-medium text-slate-400 cursor-pointer hover:text-blue-600 transition-colors">Volver al inicio de sesión</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                                        <div className="relative">
                                            <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center relative z-10">
                                                <Mail className="h-7 w-7 text-blue-600" />
                                            </div>
                                            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">¡Correo Enviado!</h4>
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[200px] mx-auto">
                                                Revisa tu bandeja de entrada. El enlace expirará en 15 minutos por seguridad.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setRecoveryStep('form')}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline mt-2"
                                        >
                                            Intentar con otro correo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TutorialCard>

                {/* PASO 3: DASHBOARD VIVO (INTACTO) */}
                <TutorialCard
                    step="03"
                    title="Tu Panel General"
                    description="En el apartado inicio encontraras los recursos compartidos por ti y otros usuarios. Podrás navegar por las pestañas disponibles encontrando apartados por área de trabajo. Además, encontrarás el dashboard lateral izquierdo en el que podrás navegar por las secciones: Inicio - Favoritos - Compartidos - Grupos de Trabajo - Configuracióon - Papelera y Cerrar Sesión"
                >
                    {/* Contenedor Exterior */}
                    <div className="p-4 sm:p-6 bg-slate-200/50 h-full min-h-[400px] flex items-center justify-center">

                        {/* MOCKUP PRINCIPAL */}
                        <div className="w-full max-w-[500px] bg-slate-50 rounded-xl shadow-2xl shadow-slate-400/20 border border-slate-200/60 overflow-hidden flex flex-col sm:flex-row h-[340px] relative ring-1 ring-slate-900/5">

                            {/* --- SIDEBAR --- */}
                            <div className="hidden sm:flex w-16 bg-[#0F172A] flex-col items-center py-5 gap-6 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.3)]">
                                {/* Logo App */}
                                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50 mb-2">
                                    <Cloud className="h-5 w-5 text-white" />
                                </div>

                                {/* Iconos de Navegación */}
                                <div className="flex flex-col gap-4 w-full items-center">
                                    {/* Inicio (Activo) */}
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 shadow-sm cursor-default relative group ring-1 ring-blue-500/30">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </div>
                                    {/* Otros */}
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-default">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-default">
                                        <FolderClosed className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Settings Bottom */}
                                <div className="mt-auto">
                                    <div className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-white transition-colors">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>

                            {/* --- MAIN CONTENT --- */}
                            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">

                                {/* HEADER SUPERIOR - LIMPIO (SOLO TÍTULO Y PERFIL) */}
                                <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-5 sticky top-0 z-10">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-sm font-bold text-slate-800 tracking-tight">Panel General</h2>
                                    </div>
                                    {/* Solo Imagen de Perfil (LA) */}
                                    <div className="flex items-center">
                                        <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm border border-white cursor-default">LA</div>
                                    </div>
                                </div>

                                {/* DASHBOARD BODY */}
                                <div className="p-5 overflow-hidden flex flex-col h-full">

                                    {/* 1. TABS (PESTAÑAS) - SIN SCROLLBAR */}
                                    <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden mask-linear-gradient" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-medium rounded-full whitespace-nowrap shadow-sm">Inicio</span>
                                        {['Comunicaciones', 'Admisión', 'Secretaría General'].map((tab) => (
                                            <span key={tab} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium rounded-full whitespace-nowrap hover:bg-slate-50 cursor-default">{tab}</span>
                                        ))}
                                    </div>

                                    {/* 2. RECURSOS - SOLO 1 RECURSO, SIN SCROLLBAR */}
                                    <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                                        {/* ÚNICO RECURSO: Supabase Dashboards */}
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-28">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                        <Activity className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Supabase Dashboards</h4>
                                                        <span className="text-[9px] text-slate-400 bg-slate-50 px-1 rounded border border-slate-100 mt-0.5 inline-block">OTROS</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-slate-500 line-clamp-2 mb-auto leading-relaxed">
                                                Supabase Dashboard for managing database schemas. Provides a UI to create...
                                            </p>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] text-slate-400">20 ene 2026</span>
                                                </div>
                                                <div className="h-4 w-4 rounded-full bg-slate-100 text-[8px] flex items-center justify-center text-slate-600 font-bold border border-slate-200">LA</div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </TutorialCard>

            </div>

            {/* FOOTER NAVEGACIÓN */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-10">
                <div className="text-center sm:text-left opacity-50 cursor-not-allowed">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Lección Anterior</p>
                    <Button variant="outline" disabled className="text-slate-400 border-slate-200">
                        Inicio del Curso
                    </Button>
                </div>

                <div className="text-center sm:text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Siguiente Lección</p>
                    <Button asChild size="lg" className="group bg-slate-900 hover:bg-blue-600 text-white px-8 shadow-lg shadow-blue-900/10 transition-all hover:scale-105">
                        <Link href="/docs/tutorial/profile">
                            2. Tu Espacio Personal
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}