import React from 'react';

const SlideCierre: React.FC = () => {
  // Datos del Roadmap de implementación
  const steps = [
    { id: 1, icon: 'fa-rocket', title: 'Piloto Controlado', desc: '2 semanas de prueba con usuarios clave.' },
    { id: 2, icon: 'fa-users-cog', title: 'Onboarding', desc: 'Capacitación por área y carga de datos.' },
    { id: 3, icon: 'fa-balance-scale', title: 'Gobernanza', desc: 'Oficialización de política de uso de datos.' },
    { id: 4, icon: 'fa-chart-line', title: 'Medición', desc: 'KPIs de adopción y eficiencia operativa.' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Efectos y Animaciones */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .glow-center {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background-color: rgba(37, 99, 235, 0.15); /* Blue glow */
          filter: blur(150px);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        /* Botón CTA Animado */
        .cta-button {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: white;
          box-shadow: 0 0 30px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(255,255,255,0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 40px rgba(37, 99, 235, 0.6), inset 0 0 15px rgba(255,255,255,0.3);
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }

        /* Animación de pulso sutil para el CTA */
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .animate-pulse-shadow {
          animation: subtlePulse 3s infinite;
        }

        /* Iconos del Roadmap */
        .step-icon-container {
          transition: all 0.4s ease;
        }
        .step-card:hover .step-icon-container {
          transform: scale(1.15) translateY(-5px);
          box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);
          border-color: #60A5FA;
          background-color: #1E3A8A;
          color: #fff;
        }
      `}</style>

      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-10 bg-grid pointer-events-none"></div>
      <div className="glow-center"></div>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-6 lg:px-16 pt-12 pb-24">
        
        {/* Hero Phrase */}
        <div className="text-center max-w-5xl mx-auto mb-10 mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Ingresar a Demo 
          </h1>
        </div>

        {/* Call to Action Button (URL Actualizada) */}
        <a 
          href="https://synapseipg.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cta-button animate-pulse-shadow flex items-center justify-center gap-3 px-10 py-4 rounded-full text-lg md:text-xl font-bold border border-blue-400/50 mb-16 lg:mb-20 cursor-pointer"
        >
          <i className="fas fa-bolt text-blue-200"></i>
          Ingresar a Synapse IPG
        </a>

        {/* Implementation Roadmap */}

      </main>

      {/* Footer Contact Pills */}
      <footer className="absolute bottom-0 w-full p-6 flex flex-wrap justify-center items-center gap-4 z-20 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2.5 px-5 py-2 bg-slate-900/60 border border-slate-700/50 rounded-full text-slate-300 text-xs md:text-sm font-medium backdrop-blur-sm transition-colors hover:bg-slate-800 hover:border-slate-500">
          <i className="fas fa-envelope text-blue-400"></i>
          tecnologia@ipg.cl
        </div>
        
        <div className="flex items-center gap-2.5 px-5 py-2 bg-slate-900/60 border border-slate-700/50 rounded-full text-slate-300 text-xs md:text-sm font-medium backdrop-blur-sm transition-colors hover:bg-slate-800 hover:border-slate-500">
          <i className="fas fa-globe text-blue-400"></i>
          synapse.ipg.cl
        </div>
        
        <div className="flex items-center gap-2.5 px-5 py-2 bg-slate-900/60 border border-slate-700/50 rounded-full text-slate-300 text-xs md:text-sm font-medium backdrop-blur-sm transition-colors hover:bg-slate-800 hover:border-slate-500">
          <i className="fas fa-shield-alt text-emerald-400"></i>
          Powered by Vercel & Supabase
        </div>
      </footer>
    </div>
  );
};

export default SlideCierre;