import React from 'react';

const SlideArchitecture: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones y Conectores */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .ambient-glow {
          position: absolute;
          width: 900px;
          height: 400px;
          background-color: rgba(37, 99, 235, 0.08);
          filter: blur(80px);
          border-radius: 50%;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* Tech Card Styling */
        .tech-card {
          background: #0F172A;
          border: 1px solid #1E293B;
          border-radius: 12px;
          padding: 20px;
          width: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .tech-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);
          border-color: #3B82F6;
        }

        .icon-box {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          background: #1E293B;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }

        .tech-card:hover .icon-box {
          background: #2563EB;
          color: white !important;
          border-color: #60A5FA;
        }

        .badge-tech {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 8px;
          border-radius: 4px;
          margin-top: 10px;
          background: rgba(255,255,255,0.05);
          color: #94A3B8;
          font-weight: 600;
        }

        /* Connection Lines */
        .connection-line {
          height: 2px;
          flex: 1;
          background: #1E293B;
          position: relative;
          margin: 0 10px;
          min-width: 30px;
          overflow: hidden;
        }

        .connection-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #3B82F6;
          opacity: 0.8;
          transform: scaleX(0);
          transform-origin: left;
          animation: flowLine 2.5s infinite ease-in-out;
        }

        .arrow-head {
          color: #3B82F6;
          font-size: 14px;
          animation: pulseArrow 2.5s infinite;
        }

        @keyframes flowLine {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.8; }
          100% { transform: scaleX(0); opacity: 0; transform-origin: right; }
        }

        @keyframes pulseArrow {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(4px); opacity: 1; filter: drop-shadow(0 0 5px #3B82F6); }
        }

        /* Specific Brand Colors */
        .card-github .icon-box { color: #ffffff; }
        .card-vercel .icon-box { color: #ffffff; }
        .card-next .icon-box { color: #61DAFB; }
        .card-supabase .icon-box { color: #3ECF8E; }
        .card-resend .icon-box { color: #ffffff; }
        .card-gemini .icon-box { color: #8E75FF; }

        .card-supabase { border-bottom: 3px solid #3ECF8E; }
        .card-gemini { border-bottom: 3px solid #8E75FF; }
        .card-resend { border-bottom: 3px solid #E2E8F0; }

      `}</style>

      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>
      <div className="ambient-glow"></div>

      {/* Header Responsivo */}
      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">
              Infraestructura
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Arquitectura Técnica</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg">Stack moderno, escalable y 100% propiedad institucional.</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-gray-500 bg-[#0F172A] px-4 py-2 rounded-lg border border-[#1E293B]">
          <i className="fas fa-layer-group"></i>
          <span className="text-sm font-medium tracking-wide">Stack v1.0</span>
        </div>
      </header>

      {/* Main Content: Diagrama centrado y auto-escalable */}
      <main className="flex-1 w-full flex items-center justify-center relative z-10 overflow-hidden pb-24">
        
        {/* Lienzo virtual para proteger el diagrama (se encoge en pantallas pequeñas) */}
        <div className="relative w-[1100px] h-[400px] transform scale-[0.45] sm:scale-[0.6] md:scale-75 lg:scale-90 xl:scale-100 origin-center transition-transform duration-500 flex flex-col items-center justify-center">

          {/* Top Row: Core Pipeline */}
          <div className="flex items-center w-full justify-center mb-10 z-20">
            
            {/* 1. GitHub */}
            <div className="tech-card card-github group shrink-0">
              <div className="icon-box"><i className="fab fa-github text-3xl"></i></div>
              <h3 className="font-bold text-white text-[15px]">GitHub</h3>
              <p className="text-xs text-gray-400 mt-1">Código Fuente</p>
              <span className="badge-tech">Repo Privado</span>
            </div>

            {/* Conector */}
            <div className="connection-line"></div>
            <i className="fas fa-chevron-right arrow-head"></i>
            <div className="connection-line"></div>

            {/* 2. Vercel */}
            <div className="tech-card card-vercel group shrink-0">
              <div className="icon-box">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 22.525H0l12-21.05 12 21.05z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-white text-[15px]">Vercel</h3>
              <p className="text-xs text-gray-400 mt-1">Hosting Serverless</p>
              <span className="badge-tech">CI/CD Auto</span>
            </div>

            {/* Conector */}
            <div className="connection-line"></div>
            <i className="fas fa-chevron-right arrow-head"></i>
            <div className="connection-line"></div>

            {/* 3. Next.js */}
            <div className="tech-card card-next group shrink-0">
              <div className="icon-box"><i className="fab fa-react text-3xl"></i></div>
              <h3 className="font-bold text-white text-[15px]">Next.js + TS</h3>
              <p className="text-xs text-gray-400 mt-1">Frontend & API</p>
              <span className="badge-tech">Server Actions</span>
            </div>

            {/* Conector */}
            <div className="connection-line"></div>
            <i className="fas fa-chevron-right arrow-head"></i>
            <div className="connection-line"></div>

            {/* 4. Supabase */}
            <div className="tech-card card-supabase group shrink-0 relative">
              <div className="icon-box"><i className="fas fa-database text-2xl"></i></div>
              <h3 className="font-bold text-white text-[15px]">Supabase</h3>
              <p className="text-xs text-gray-400 mt-1">Backend & Auth</p>
              <span className="badge-tech text-emerald-400 bg-emerald-400/10">PostgreSQL</span>
              
              {/* Punto de anclaje para la ramificación hacia abajo */}
              <div className="absolute -bottom-[42px] left-1/2 w-[2px] h-[40px] bg-dashed border-l-2 border-dashed border-[#334155]"></div>
            </div>
            
          </div>

          {/* Integrations Branching (Nivel Inferior) */}
          <div className="w-full flex justify-end relative z-10 pr-[40px]">
            
            {/* Línea horizontal dashed que conecta con la línea vertical de Supabase */}
            <div className="absolute -top-[2px] right-[242px] w-[210px] h-[2px] border-t-2 border-dashed border-[#334155]"></div>
            
            <div className="flex space-x-6 relative">
              {/* Líneas verticales cortas hacia Resend y Gemini */}
              <div className="absolute -top-[2px] left-[80px] w-[2px] h-[20px] border-l-2 border-dashed border-[#334155]"></div>
              <div className="absolute -top-[2px] left-[264px] w-[2px] h-[20px] border-l-2 border-dashed border-[#334155]"></div>

              {/* 5. Resend */}
              <div className="tech-card card-resend group w-[160px] h-[130px] p-[15px] mt-[18px]">
                <div className="icon-box w-[40px] h-[40px] mx-auto"><i className="fas fa-paper-plane text-lg"></i></div>
                <h3 className="font-bold text-white text-sm">Resend</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight">Emails Transaccionales</p>
              </div>

              {/* 6. Gemini AI */}
              <div className="tech-card card-gemini group w-[160px] h-[130px] p-[15px] mt-[18px]">
                <div className="icon-box w-[40px] h-[40px] mx-auto"><i className="fas fa-brain text-lg"></i></div>
                <h3 className="font-bold text-white text-sm">Gemini AI</h3>
                <p className="text-[11px] text-gray-400 mt-1 leading-tight">Auto-categorización</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Ownership Footer Banner (Fijo en la parte inferior) */}
      <div className="absolute bottom-0 w-full py-4 px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between z-30 bg-[#1E3A8A]/20 border-t border-blue-600/30 backdrop-blur-md">
        
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <i className="fas fa-shield-alt text-white"></i>
          </div>
          <div>
            <h4 className="text-white font-bold text-base lg:text-lg leading-tight">Soberanía de Datos</h4>
            <p className="text-blue-200 text-xs lg:text-sm mt-0.5">La información y código es propiedad de IPG</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-blue-900/60 px-5 py-2.5 rounded-lg border border-blue-500/40 shadow-inner">
          <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
          <span className="text-white font-bold tracking-widest text-sm">100% PROPIEDAD IPG</span>
        </div>
      </div>

    </div>
  );
};

export default SlideArchitecture;