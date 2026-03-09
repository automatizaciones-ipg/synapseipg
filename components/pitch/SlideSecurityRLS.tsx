import React from 'react';

const SlideSecurityRLS: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones y Diagrama */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .shield-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background-color: rgba(16, 185, 129, 0.08); /* Greenish for security */
          filter: blur(80px);
          border-radius: 50%;
          top: 40%;
          right: 5%;
          transform: translate(0, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* Layer Diagram Containers */
        .layer-card {
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 16px;
          padding: 24px;
          width: 220px;
          height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }

        .layer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
        }

        /* Specific Layer Styling */
        .layer-user { border-top: 4px solid #94A3B8; }
        .layer-api { border-top: 4px solid #3B82F6; }
        .layer-db { 
          border-top: 4px solid #10B981; 
          background: #064E3B; /* Dark Green bg */
          border-color: #059669;
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
          z-index: 20;
        }
        .layer-db:hover {
          transform: scale(1.08) translateY(-5px);
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
        }
        .layer-data { border-top: 4px solid #F59E0B; }

        .icon-lg {
          font-size: 48px;
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }
        .layer-card:hover .icon-lg {
          transform: scale(1.1);
        }

        /* Flow Arrows */
        .flow-arrow {
          flex: 1;
          height: 2px;
          background: #334155;
          position: relative;
          margin: 0 15px;
          min-width: 40px;
        }
        
        .flow-arrow::after {
          content: '►';
          position: absolute;
          right: -6px;
          top: -8px;
          color: #334155;
          font-size: 14px;
        }

        /* Animated Pulse for Flow Line */
        .flow-arrow-animated::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          height: 4px;
          width: 0%;
          background: #3B82F6;
          opacity: 0.7;
          animation: pulseFlow 2s infinite ease-in-out;
        }

        @keyframes pulseFlow {
          0% { width: 0%; opacity: 0; }
          50% { width: 100%; opacity: 0.7; }
          100% { width: 100%; opacity: 0; }
        }

        /* RLS Shield Badge */
        .rls-badge {
          position: absolute;
          top: -15px;
          background: #10B981;
          color: #064E3B;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
          z-index: 25;
          border: 2px solid #064E3B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Lock Animation */
        .lock-container {
          width: 70px;
          height: 70px;
          background: rgba(16, 185, 129, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border: 2px solid #10B981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          animation: pulseLock 3s infinite alternate;
        }

        @keyframes pulseLock {
          0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); }
          100% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.5); }
        }

        /* Blocked Path Negative */
        .blocked-path {
          position: absolute;
          top: 50%;
          left: 100%;
          width: 50px;
          height: 100px;
          border-top: 2px dashed #EF4444;
          border-right: 2px dashed #EF4444;
          opacity: 0.6;
          pointer-events: none;
        }
        
        .blocked-icon {
          position: absolute;
          top: -12px;
          left: 15px;
          color: #EF4444;
          font-size: 20px;
          animation: shake 2s infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        /* Comparison Box */
        .comparison-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid #1E293B;
          border-left: 4px solid #3B82F6;
          padding: 24px;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .comparison-box:hover {
          background: rgba(15, 23, 42, 0.8);
          border-color: #334155;
        }
      `}</style>

      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>
      <div className="shield-glow"></div>

      {/* Header Responsivo */}
      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-emerald-900/30 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">
              Seguridad de Núcleo
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Row-Level Security (RLS)</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg">Protección de datos a nivel matemático, no superficial.</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-emerald-500/80 bg-[#064E3B]/20 px-4 py-2 rounded-lg border border-emerald-500/20">
          <i className="fas fa-shield-alt text-xl"></i>
          <span className="text-sm font-bold uppercase tracking-widest">PostgreSQL Hardened</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-8 relative z-10 flex flex-col justify-center gap-12 overflow-hidden">
        
        {/* Container for Layer Diagram (Auto-scaling) */}
        <div className="w-full flex justify-center mt-4">
          <div className="relative w-[1000px] h-[340px] transform scale-[0.5] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-center transition-transform duration-500 flex items-center justify-between">
            
            {/* 1. User Layer */}
            <div className="layer-card layer-user shrink-0">
              <div className="icon-lg text-slate-400"><i className="fas fa-user-circle"></i></div>
              <h3 className="text-xl font-bold text-white mb-2">Usuario</h3>
              <p className="text-slate-400 text-sm leading-tight">Intenta acceder a documentos de otra área.</p>
              <div className="mt-6 px-3 py-1.5 bg-slate-800 rounded-md text-[11px] text-slate-400 font-mono tracking-wide w-full border border-slate-700">
                REQUEST: GET /finanzas
              </div>
            </div>

            {/* Arrow */}
            <div className="flow-arrow flow-arrow-animated"></div>

            {/* 2. API Layer */}
            <div className="layer-card layer-api shrink-0">
              <div className="icon-lg text-blue-400"><i className="fas fa-server"></i></div>
              <h3 className="text-xl font-bold text-white mb-2">Aplicación</h3>
              <p className="text-slate-400 text-sm leading-tight">Next.js procesa la petición y pasa la identidad segura.</p>
              <div className="mt-6 px-3 py-1.5 bg-blue-900/30 rounded-md text-[11px] text-blue-300 font-mono border border-blue-500/30 w-full">
                AUTH: User_ID_123
              </div>
            </div>

            {/* Arrow */}
            <div className="flow-arrow flow-arrow-animated"></div>

            {/* 3. Database Layer (The Hero) */}
            <div className="layer-card layer-db shrink-0">
              <div className="rls-badge"><i className="fas fa-lock mr-1.5"></i> RLS Activo</div>
              <div className="lock-container">
                <i className="fas fa-database text-3xl text-emerald-100"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PostgreSQL</h3>
              <p className="text-emerald-100/80 text-[13px] leading-tight px-2">El motor de base de datos evalúa la regla matemática de inmediato.</p>
              
              <div className="mt-4 w-full bg-black/50 p-2.5 rounded text-left border border-emerald-500/30 shadow-inner">
                <p className="text-[10px] text-emerald-400 font-mono">IF department_id != user.dept</p>
                <p className="text-[10px] text-red-400 font-mono font-bold mt-1">THEN RETURN NULL</p>
              </div>

              {/* Blocked Visual Path */}
              <div className="blocked-path">
                <i className="fas fa-ban blocked-icon"></i>
              </div>
            </div>

            {/* Dotted Arrow (Blocked) */}
            <div className="flow-arrow border-t-2 border-dashed border-red-500/60 bg-transparent flex items-center justify-center">
              <div className="absolute -top-[14px] bg-[#060B19] px-2 py-0.5 rounded text-red-500 text-[10px] font-extrabold border border-red-500/30 tracking-widest uppercase shadow-md shadow-red-500/20">
                BLOQUEADO
              </div>
            </div>

            {/* 4. Data Layer (Unreachable) */}
            <div className="layer-card layer-data shrink-0 opacity-40 grayscale filter">
              <div className="icon-lg text-amber-500"><i className="fas fa-file-invoice-dollar"></i></div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">Datos Sensibles</h3>
              <p className="text-slate-400 text-sm leading-tight">Planillas, Sueldos, Informes Financieros.</p>
              <div className="mt-6 px-3 py-1.5 border border-slate-700 bg-slate-800/50 rounded-md text-[11px] text-slate-500 font-mono w-full tracking-widest uppercase">
                Status: Protected
              </div>
            </div>

          </div>
        </div>

        {/* Comparison / Key Message Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto z-20 pb-10">
          
          {/* Traditional Security Box */}
          <div className="comparison-box border-l-red-500">
            <div className="flex items-start">
              <div className="mr-5 mt-0.5 bg-red-900/20 p-2.5 rounded-xl text-red-400 border border-red-500/20 shadow-sm">
                <i className="fas fa-times-circle text-2xl"></i>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1.5 uppercase tracking-wide">Seguridad Tradicional (UI)</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Ocultar el botón en la pantalla frontal. Si un atacante omite la interfaz y llama a la API directamente, puede robar los datos expuestos.
                </p>
              </div>
            </div>
          </div>

          {/* Synapse RLS Box */}
          <div className="comparison-box border-l-emerald-500 bg-[#064E3B]/20 hover:bg-[#064E3B]/30 hover:border-emerald-500/50">
            <div className="flex items-start">
              <div className="mr-5 mt-0.5 bg-emerald-900/30 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/30 shadow-sm">
                <i className="fas fa-check-circle text-2xl"></i>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1.5 uppercase tracking-wide">Seguridad Synapse (RLS)</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  El dato <span className="font-semibold text-emerald-300">literalmente no existe</span> para el usuario no autorizado a nivel de disco duro. La protección es inherente al motor de base de datos, no a la pantalla.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default SlideSecurityRLS;