import React from 'react';

const SlideSolution: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones y Efectos */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }
        
        .center-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background-color: rgba(37, 99, 235, 0.1);
          filter: blur(80px);
          border-radius: 50%;
          top: 320px; /* Centrado en el hub Y */
          left: 640px; /* Centrado en el hub X */
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .pulse-line {
          stroke: #60A5FA;
          stroke-width: 2;
          stroke-dasharray: 10, 10;
          animation: dash 2s linear infinite;
        }

        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }

        /* Hover de Nodos */
        .hub-node {
          transition: all 0.3s ease;
        }
        .hub-node:hover {
          border-color: #3B82F6 !important;
          transform: translate(-50%, -50%) scale(1.05) !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5) !important;
        }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>

      {/* Header Responsivo */}
      <header className="relative z-50 w-full px-8 py-8 lg:px-16 lg:py-10 flex flex-col items-start bg-gradient-to-b from-[#060B19] to-transparent">
        <div className="flex items-center space-x-3 mb-3">
          <span className="px-4 py-1.5 bg-blue-900/30 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-wider">
            La Solución
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Synapse IPG: Centralizador de Recursos</h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg">Centralización coolaborativa con las áreas de IPG</p>
      </header>

      {/* Contenedor del Diagrama (Centrado y auto-escalable) */}
      <main className="flex-1 flex items-center justify-center w-full relative z-10 overflow-hidden">
        
        {/* LIENZO VIRTUAL: 1280x720 congelado. Se escala con 'scale-' de Tailwind */}
        <div className="relative w-[1280px] h-[720px] transform scale-[0.4] sm:scale-[0.55] md:scale-[0.75] lg:scale-90 xl:scale-100 origin-center transition-transform duration-500">
          
          <div className="center-glow"></div>

          {/* Líneas Conectoras SVG */}
          <svg className="absolute top-0 left-0 w-[1280px] h-[720px] pointer-events-none z-[5]" viewBox="0 0 1280 720">
            {/* Top */}
            <line x1="640" x2="640" y1="320" y2="120" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            <line className="pulse-line" x1="640" x2="640" y1="320" y2="120" />
            
            {/* Top Right */}
            <line x1="640" x2="830" y1="320" y2="170" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            <line className="pulse-line" x1="640" x2="830" y1="320" y2="170" />
            
            {/* Bottom Right */}
            <line x1="640" x2="850" y1="320" y2="400" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            
            {/* Bottom Left */}
            <line x1="640" x2="430" y1="320" y2="400" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            
            {/* Top Left */}
            <line x1="640" x2="450" y1="320" y2="170" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            <line className="pulse-line" x1="640" x2="450" y1="320" y2="170" />
            
            {/* Right Middle */}
            <line x1="640" x2="900" y1="320" y2="280" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
            
            {/* Left Middle */}
            <line x1="640" x2="380" y1="320" y2="280" stroke="#2563EB" strokeWidth="2" opacity="0.4" />
          </svg>

          {/* HUB CENTRAL (x:640, y:320) */}
          <div className="absolute top-[320px] left-[640px] transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="w-[160px] h-[160px] rounded-full bg-[#1e3a8a] border-2 border-[#60A5FA] shadow-[0_0_30px_rgba(37,99,235,0.6)] flex flex-col justify-center items-center">
              <i className="fas fa-bolt text-5xl text-white mb-2 drop-shadow-[0_0_10px_#60A5FA]"></i>
              <p className="text-white font-bold text-lg tracking-wider">SYNAPSE</p>
              <p className="text-blue-300 text-xs uppercase font-semibold mt-1">IPG Core</p>
            </div>
          </div>

          {/* NODOS SATÉLITES */}
          
          {/* 1. Top */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '120px', left: '640px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-bullhorn text-[18px] text-pink-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Comunicaciones</p>
          </div>

          {/* 2. Top Right */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '170px', left: '830px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-id-card text-[18px] text-purple-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Admisión</p>
          </div>

          {/* 3. Right Middle */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '280px', left: '900px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-file-signature text-[18px] text-green-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Secretaría General</p>
          </div>

          {/* 4. Bottom Right */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '400px', left: '850px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-users text-[18px] text-yellow-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Gestión de Personas</p>
          </div>

          {/* 5. Bottom Left */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '400px', left: '430px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-graduation-cap text-[18px] text-indigo-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Asuntos Académicos</p>
          </div>

          {/* 6. Left Middle */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '280px', left: '380px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-chart-pie text-[18px] text-red-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Asuntos Económicos</p>
          </div>

          {/* 7. Top Left */}
          <div className="hub-node absolute flex flex-col items-center justify-center w-[140px] p-[10px] bg-[#0F172A] border border-blue-600/30 rounded-xl shadow-lg z-20" style={{ top: '170px', left: '450px', transform: 'translate(-50%, -50%)' }}>
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800/80 flex items-center justify-center mb-1 border border-white/10">
              <i className="fas fa-code text-[18px] text-cyan-400"></i>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 text-center mt-1 leading-tight">Desarrollo</p>
          </div>
          
        </div>
      </main>


    </div>
  );
};

export default SlideSolution;