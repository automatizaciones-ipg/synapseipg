import React from 'react';

const SlideFeatures: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones y Colores */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .ambient-glow {
          position: absolute;
          width: 800px;
          height: 500px;
          background-color: rgba(37, 99, 235, 0.08);
          filter: blur(100px);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* Hover de Tarjetas */
        .feature-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: #3B82F6;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.15);
          background-color: #131d33;
        }

        /* Efecto de Íconos */
        .icon-wrapper {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover .icon-wrapper {
          transform: scale(1.1);
        }

        /* Línea de Acento Superior */
        .card-accent {
          background: transparent;
          transition: background 0.3s ease;
        }
        .feature-card:hover .card-accent {
          background: #3B82F6;
        }
      `}</style>

      {/* Background Grid y Brillo Ambiental */}
      <div className="absolute inset-0 z-0 opacity-[0.05] bg-grid"></div>
      <div className="ambient-glow"></div>

      {/* Header Responsivo */}
      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">
              Capacidades
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Funcionalidad: Lo que hace Synapse</h1>
        </div>
        
        {/* Indicador Lateral (Oculto en móviles pequeños para limpieza) */}
        <div className="hidden md:flex items-center space-x-2 text-gray-500 bg-[#0F172A] px-4 py-2 rounded-lg border border-[#1E293B]">
          <i className="fas fa-th-large"></i>
          <span className="text-sm font-medium tracking-wide">Core Features v1.0</span>
        </div>
      </header>

      {/* Contenedor Principal: Grid de Funcionalidades */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 lg:px-16 py-10 relative z-10 flex flex-col justify-center">
        
        {/* Usamos CSS Grid responsivo: 1 columna en móvil, 2 en tablet, 3 en escritorio grande */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 w-full">

          {/* Card 1: Centralización */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-blue-500/15 text-blue-400 border border-blue-400/20">
              <i className="fas fa-folder-open"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">Centralización de Recursos</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Permite publicar recursos y enlaces privadoos o colaborativos para miembrs de IPG
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Publicar Recursos</span>
            </div>
          </div>

          {/* Card 2: Seguridad RLS */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-400/20">
              <i className="fas fa-shield-alt"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">Seguridad por Depto (RLS)</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Row-Level Security nativo en base de datos. El blindaje es matemático: si no tienes permisos, la data no existe para ti.
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">PostgreSQL</span>
            </div>
          </div>

          {/* Card 3: Trazabilidad */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/20">
              <i className="fas fa-history"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">Trazabilidad Total</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Historial completo de acciones. Registros de quién subió, modificó o accedió a un recurso crítico.
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Trazabilidad de Recursos</span>
            </div>
          </div>

          {/* Card 4: IA */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-purple-500/15 text-purple-400 border border-purple-400/20">
              <i className="fas fa-brain"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">Clasificación Inteligente IA</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Integración con IA generativa para analizar, etiquetar y categorizar documentos automáticamente al momento de la carga.
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">AI Gemini</span>
            </div>
          </div>

          {/* Card 5: Responsivo */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-green-500/15 text-green-400 border border-green-400/20">
              <i className="fas fa-mobile-alt"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">100% Responsivo</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Experiencia fluida en móviles, tablets y escritorio. Es posible ver y publicar recursos desde cualquier dispsitivo conectado a internet.
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-green-400 font-bold uppercase tracking-widest">diseño Responsivo</span>
            </div>
          </div>

          {/* Card 6: Rendimiento */}
          <div className="feature-card group bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden">
            <div className="card-accent absolute top-0 left-0 w-full h-1"></div>
            
            <div className="icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl bg-teal-500/15 text-teal-400 border border-teal-400/20">
              <i className="fas fa-bolt"></i>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">Rendimiento Ultra-rápido</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
              Arquitectura optimizada. Carga instantánea de recursos e interfaces gráficas del sistema.
            </p>
            
            <div className="pt-4 border-t border-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-teal-400 font-bold uppercase tracking-widest">High Performance</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info Sutil */}
      <div className="w-full text-right px-8 pb-6 lg:px-16 text-gray-600 text-xs font-mono tracking-widest uppercase">
        <p>Synapse Core Capabilities</p>
      </div>

    </div>
  );
};

export default SlideFeatures;