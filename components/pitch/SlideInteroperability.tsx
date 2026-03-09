import React from 'react';

const SlideInteroperability: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones de Nodos y SVG */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .api-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          background-color: rgba(139, 92, 246, 0.08); /* Purple for API */
          filter: blur(100px);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* Central Node */
        .center-node {
          width: 160px;
          height: 160px;
          background: #0F172A;
          border: 2px solid #8B5CF6;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(139, 92, 246, 0.2);
          z-index: 30;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .center-node:hover {
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 0 60px rgba(139, 92, 246, 0.6), inset 0 0 30px rgba(139, 92, 246, 0.3);
        }

        .center-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 220px;
          border: 1px dashed #8B5CF6;
          border-radius: 50%;
          opacity: 0.5;
          animation: spin 25s linear infinite;
          pointer-events: none;
          z-index: 25;
        }

        @keyframes spin { 
          100% { transform: translate(-50%, -50%) rotate(360deg); } 
        }

        /* Satellite Nodes */
        .sat-node {
          width: 150px;
          height: 110px;
          background: #1E293B;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.5);
          cursor: default;
        }

        .sat-node:hover {
          transform: scale(1.08) !important;
          border-color: #fff;
          box-shadow: 0 0 25px rgba(255,255,255,0.15);
        }

        /* Positions for 1000x600 coordinate system */
        .node-portal { top: 50px; left: 500px; transform: translateX(-50%); border-bottom: 3px solid #10B981; }
        .node-crm    { top: 150px; left: 150px; transform: translate(-50%, -50%); border-bottom: 3px solid #F97316; }
        .node-umas   { top: 150px; left: 850px; transform: translate(-50%, -50%); border-bottom: 3px solid #3B82F6; }
        .node-hooks  { top: 450px; left: 250px; transform: translate(-50%, -50%); border-bottom: 3px solid #EC4899; }
        .node-data   { top: 450px; left: 750px; transform: translate(-50%, -50%); border-bottom: 3px solid #EAB308; }

        .icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-size: 20px;
          background: rgba(255,255,255,0.05);
          transition: transform 0.3s ease;
        }
        .sat-node:hover .icon-bubble {
          transform: scale(1.1);
        }

        /* Connecting Lines (SVG) */
        .conn-line {
          stroke: #475569;
          stroke-width: 2;
          stroke-dasharray: 6, 6;
          opacity: 0.6;
          animation: dashFlow 1.5s linear infinite;
        }

        .conn-line.active {
          stroke: #8B5CF6;
          stroke-dasharray: none;
          opacity: 0.8;
          stroke-width: 3;
        }

        @keyframes dashFlow {
          to { stroke-dashoffset: -12; }
        }

        /* Protocol Badges */
        .proto-badge {
          position: absolute;
          background: #020617;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          color: #94A3B8;
          border: 1px solid #334155;
          z-index: 15;
          transform: translate(-50%, -50%);
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          font-weight: bold;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>
      <div className="api-glow"></div>

      {/* Header Responsivo */}
      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 uppercase tracking-wider">
              Interoperabilidad
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">API & Futuro</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg">Ecosistema abierto preparado para la integración total.</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-purple-400/80 bg-[#4C1D95]/20 px-4 py-2 rounded-lg border border-purple-500/20">
          <i className="fas fa-network-wired text-xl"></i>
          <span className="text-sm font-bold uppercase tracking-widest">Conectividad v2.0</span>
        </div>
      </header>

      {/* Main Diagram Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 pb-20">
        
        {/* Contenedor Auto-escalable para coordenadas absolutas */}
        <div className="relative w-[1000px] h-[600px] transform scale-[0.45] sm:scale-[0.55] md:scale-75 lg:scale-90 xl:scale-100 origin-center transition-transform duration-500 mt-4">

          {/* SVG Connections Layer */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            {/* Base Coordinate System: Center is 500, 300 */}
            {/* To Portal (Top) */}
            <line className="conn-line active" x1="500" y1="300" x2="500" y2="105"></line>
            
            {/* To CRM (Top Left) */}
            <line className="conn-line" x1="500" y1="300" x2="150" y2="150"></line>
            
            {/* To UMAS (Top Right) */}
            <line className="conn-line" x1="500" y1="300" x2="850" y2="150"></line>
            
            {/* To Webhooks (Bottom Left) */}
            <line className="conn-line" x1="500" y1="300" x2="250" y2="450"></line>
            
            {/* To Data Warehouse (Bottom Right) */}
            <line className="conn-line" x1="500" y1="300" x2="750" y2="450"></line>
          </svg>


          {/* Center Hub */}
          <div className="center-ring"></div>
          <div className="center-node">
            <i className="fas fa-bolt text-5xl text-purple-400 mb-2 drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]"></i>
            <h3 className="text-white font-extrabold text-xl tracking-wide">SYNAPSE</h3>
            <div className="mt-2 px-2.5 py-0.5 bg-purple-900/60 rounded text-[11px] text-purple-300 border border-purple-500/40 font-mono font-bold shadow-inner">
              API GATEWAY
            </div>
          </div>

          {/* Satellites */}
          {/* Top: Portal Alumnos */}
          <div className="sat-node node-portal">
            <div className="icon-bubble bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">
              <i className="fas fa-user-graduate"></i>
            </div>
            <p className="text-white text-[15px] font-bold">Portal Alumnos</p>
            <p className="text-slate-400 text-[11px] mt-1 tracking-wide uppercase">Sist. Académico</p>
          </div>

          {/* Top Left: Bitrix CRM */}
          <div className="sat-node node-crm">
            <div className="icon-bubble bg-orange-900/30 text-orange-400 border border-orange-500/20">
              <i className="fas fa-briefcase"></i>
            </div>
            <p className="text-white text-[15px] font-bold">Bitrix CRM</p>
            <p className="text-slate-400 text-[11px] mt-1 tracking-wide uppercase">Gestión Comercial</p>
          </div>

          {/* Top Right: UMAS */}
          <div className="sat-node node-umas">
            <div className="icon-bubble bg-blue-900/30 text-blue-400 border border-blue-500/20">
              <i className="fas fa-university"></i>
            </div>
            <p className="text-white text-[15px] font-bold">UMAS</p>
            <p className="text-slate-400 text-[11px] mt-1 tracking-wide uppercase">Sist. Académico</p>
          </div>

          {/* Bottom Left: Webhooks */}
          <div className="sat-node node-hooks">
            <div className="icon-bubble bg-pink-900/30 text-pink-400 border border-pink-500/20">
              <i className="fas fa-satellite-dish"></i>
            </div>
            <p className="text-white text-[15px] font-bold">Webhooks</p>
            <p className="text-slate-400 text-[11px] mt-1 tracking-wide uppercase">Integraciónes</p>
          </div>

          {/* Bottom Right: Data Warehouse */}
          <div className="sat-node node-data">
            <div className="icon-bubble bg-yellow-900/30 text-yellow-400 border border-yellow-500/20">
              <i className="fas fa-database"></i>
            </div>
            <p className="text-white text-[15px] font-bold">Data de Recursos</p>
            <p className="text-slate-400 text-[11px] mt-1 tracking-wide uppercase">Disponible</p>
          </div>

        </div>

      </main>

      {/* Bottom Message Banner */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#4C1D95]/30 border border-purple-500/40 rounded-full py-3 px-8 flex items-center gap-4 backdrop-blur-md z-30 shadow-[0_10px_30px_rgba(139,92,246,0.2)] w-[90%] md:w-auto justify-center">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40 shrink-0">
          <i className="fas fa-plug text-white text-lg"></i>
        </div>
        <div>
          <p className="text-white text-sm md:text-base font-bold tracking-wide">Arquitectura Modular & API-Ready</p>
          <p className="text-purple-200 text-xs md:text-sm mt-0.5">Diseñada para escalar y conectarse nativamente con el ecosistema IPG.</p>
        </div>
      </div>

    </div>
  );
};

export default SlideInteroperability;