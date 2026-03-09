import React from 'react';

const SlideProblem: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Animaciones */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }
        .dashed-line {
          stroke-dasharray: 8, 8;
          animation: dash 30s linear infinite;
        }
        @keyframes dash {
          to { stroke-dashoffset: 1000; }
        }
        .pulse-red {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          animation: pulse-red 2.5s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Background Grid Sutil */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-grid"></div>

      {/* Header Section (Responsivo y centrado relativo) */}
      <header className="relative z-10 w-full px-8 py-8 lg:px-16 lg:py-10 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-[#060B19]/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-full border border-red-500/20 uppercase tracking-wider">
              Diagnóstico Actual
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">El Ecoosistema de Recursos Actual</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg max-w-2xl">Información de archios en distintas fuentes</p>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
             <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <p className="text-xs text-red-400 uppercase font-bold tracking-widest mt-1">Estado Actual</p>
        </div>
      </header>

      {/* Main Content (Se ajusta al monitor y centra los contenidos) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 lg:px-16 py-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10">
        
        {/* Left Column: Chaos Metrics */}
        <div className="w-full lg:w-5/12 max-w-lg flex flex-col justify-center">
          <div className="glass-panel rounded-2xl p-8 shadow-2xl border-t-4 border-t-red-500 relative overflow-hidden">
            {/* Brillo rojo sutil de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center relative z-10">
              <i className="fas fa-chart-line text-red-500 mr-3"></i> Observaciones
            </h3>
            
            <div className="space-y-4 relative z-10">
              {/* Metric 1 */}
              <div className="p-4 rounded-xl bg-[#0B1121] border border-white/5 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 group flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mr-5 flex-shrink-0 text-red-400 shadow-inner">
                  <i className="fas fa-clock text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Productividad</p>
                  <p className="text-white font-semibold text-lg leading-tight">Horas perdidas</p>
                  <p className="text-gray-400 text-sm mt-1 leading-snug">Buscando documentos oficiales en correos y discos.</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-4 rounded-xl bg-[#0B1121] border border-white/5 hover:bg-white/10 hover:border-yellow-500/50 transition-all duration-300 group flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mr-5 flex-shrink-0 text-yellow-400 shadow-inner">
                  <i className="fas fa-balance-scale text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Legal</p>
                  <p className="text-white font-semibold text-lg leading-tight">Riesgo Normativo</p>
                  <p className="text-gray-400 text-sm mt-1 leading-snug">Operación e inducción con documentos obsoletos.</p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-4 rounded-xl bg-[#0B1121] border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 group flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mr-5 flex-shrink-0 text-orange-400 shadow-inner">
                  <i className="fas fa-file-excel text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Integridad</p>
                  <p className="text-white font-semibold text-lg leading-tight">Versiones Desactualizadas</p>
                  <p className="text-gray-400 text-sm mt-1 leading-snug">Duplicidad infinita de archivos (v1, v2, vFinal).</p>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="p-4 rounded-xl bg-[#0B1121] border border-white/5 hover:bg-white/10 hover:border-red-600/50 transition-all duration-300 group flex items-start">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mr-5 flex-shrink-0 text-red-500 shadow-inner">
                  <i className="fas fa-user-secret text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Seguridad</p>
                  <p className="text-white font-semibold text-lg leading-tight">Fuga de Información</p>
                  <p className="text-gray-400 text-sm mt-1 leading-snug">Envío de datos sensibles en canales no oficiales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagrama Congelado (Cero desparrame) */}
        <div className="w-full lg:w-7/12 flex items-center justify-center lg:justify-end min-h-[500px]">
          {/* Este contenedor interno tiene tamaño fijo en pixeles (700x500). 
            Se escala usando CSS (scale) dependiendo de la pantalla. 
            Así garantizamos que el SVG y los divs jamás pierdan sincronía. 
          */}
          <div className="relative w-[700px] h-[500px] transform scale-[0.65] sm:scale-75 md:scale-90 xl:scale-100 origin-center lg:origin-right transition-transform duration-500">
            
            {/* Líneas SVG mapeadas EXACTAMENTE a los nodos */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 700 500">
              <path className="dashed-line" d="M 150 100 Q 345 70 540 140" fill="none" stroke="#334155" strokeWidth="2" />
              <path className="dashed-line" d="M 150 100 Q 120 240 180 380" fill="none" stroke="#334155" strokeWidth="2" />
              <path className="dashed-line" d="M 540 140 Q 580 270 520 400" fill="none" stroke="#334155" strokeWidth="2" />
              <path className="dashed-line" d="M 180 380 Q 350 420 520 400" fill="none" stroke="#334155" strokeWidth="2" />
              
              {/* Cruces Rojas (X) posicionadas en el centro de las curvas */}
              <text fill="#EF4444" fontFamily="FontAwesome" fontSize="22" fontWeight="900" textAnchor="middle" x="345" y="95"></text>
              <text fill="#EF4444" fontFamily="FontAwesome" fontSize="22" fontWeight="900" textAnchor="middle" x="140" y="250"></text>
              <text fill="#EF4444" fontFamily="FontAwesome" fontSize="22" fontWeight="900" textAnchor="middle" x="570" y="280"></text>
              <text fill="#EF4444" fontFamily="FontAwesome" fontSize="22" fontWeight="900" textAnchor="middle" x="350" y="420"></text>
            </svg>

            {/* Nodo 1: Google Drive */}
            <div className="absolute top-[20px] left-[30px] bg-[#0F172A] border border-[#1E293B] shadow-2xl p-6 rounded-2xl w-[240px] flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <i className="fab fa-google-drive text-3xl text-green-500"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-100">Google Drive</h4>
              <p className="text-sm text-gray-500 mt-1">Silos sin estructura</p>
              <div className="mt-4 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 w-full flex justify-center items-center">
                <i className="fas fa-times-circle mr-2"></i> Aislado
              </div>
            </div>

            {/* Nodo 2: Correos */}
            <div className="absolute top-[60px] left-[420px] bg-[#0F172A] border border-[#1E293B] shadow-2xl p-6 rounded-2xl w-[240px] flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <i className="fas fa-envelope text-3xl text-blue-400"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-100">Correos</h4>
              <p className="text-sm text-gray-500 mt-1">Hilos interminables</p>
              <div className="mt-4 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 w-full flex justify-center items-center">
                <i className="fas fa-times-circle mr-2"></i> Difícil rastreo
              </div>
            </div>

            {/* Nodo 3: Discos Locales */}
            <div className="absolute top-[300px] left-[60px] bg-[#0F172A] border border-[#1E293B] shadow-2xl p-6 rounded-2xl w-[240px] flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <i className="fas fa-hdd text-3xl text-gray-400"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-100">Discos Locales</h4>
              <p className="text-sm text-gray-500 mt-1">Mis Documentos</p>
              <div className="mt-4 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 w-full flex justify-center items-center">
                <i className="fas fa-times-circle mr-2"></i> Sin respaldo
              </div>
            </div>

            {/* Nodo 4: WhatsApp */}
            <div className="absolute top-[320px] left-[400px] bg-[#0F172A] border border-[#1E293B] shadow-2xl p-6 rounded-2xl w-[240px] flex flex-col items-center text-center z-10">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                <i className="fab fa-whatsapp text-3xl text-green-400"></i>
              </div>
              <h4 className="text-lg font-bold text-gray-100">WhatsApp</h4>
              <p className="text-sm text-gray-500 mt-1">Canal informal</p>
              <div className="mt-4 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20 w-full flex justify-center items-center">
                <i className="fas fa-times-circle mr-2"></i> Fuga de datos
              </div>
            </div>

            {/* Centro: Vacío de Verdad */}
            <div className="absolute top-[220px] left-[286px] transform -translate-x-1/2 -translate-y-1/2 z-0 text-center">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-red-500/40 flex items-center justify-center mx-auto mb-3 pulse-red bg-[#060B19]/50 backdrop-blur-md">
                <i className="fas fa-question text-4xl text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"></i>
              </div>
              <p className="text-[11px] text-red-400 font-mono tracking-widest uppercase bg-[#060B19]/80 px-2 py-1 rounded border border-red-500/10">Sin Fuente de Verdad</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Line Decorativo */}
      <div className="w-full h-1.5 bg-gray-900 mt-auto flex">
        <div className="h-full bg-red-500 w-1/4 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000"></div>
      </div>
    </div>
  );
};

export default SlideProblem;