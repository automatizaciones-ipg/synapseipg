import React, { useEffect, useState } from 'react';

const SlideCostROI: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Datos del gráfico enfocados solo en Synapse
  const chartData = [
    { label: 'Synapse Actual', value: 0, display: '$0', color: 'bg-emerald-500', textVal: 'text-emerald-400', width: '0%', isFree: true },
    { label: 'Synapse (Escalado)', value: 20, display: '~$20 / mes', color: 'bg-blue-500', textVal: 'text-blue-400', width: '100%' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        .money-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          background-color: rgba(16, 185, 129, 0.06);
          filter: blur(100px);
          border-radius: 50%;
          top: 40%;
          right: 5%;
          transform: translate(0, -50%);
          z-index: 0;
          pointer-events: none;
        }

        @keyframes floatNumber {
          0%, 100% { transform: translateY(0); text-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
          50% { transform: translateY(-5px); text-shadow: 0 20px 30px rgba(16, 185, 129, 0.5); }
        }
        .animate-float-number {
          animation: floatNumber 4s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>
      <div className="money-glow"></div>

      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-emerald-900/30 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-wider">
              Eficiencia Financiera
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Modelo de Costos</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg">Infraestructura ultra-eficiente y costos predecibles.</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-emerald-400/80 bg-[#064E3B]/20 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-sm">
          <i className="fas fa-server text-xl"></i>
          <span className="text-sm font-bold uppercase tracking-widest">Serverless Architecture</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-8 relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 pb-16">
        
        {/* Left Column: Chart Container */}
        <div className="flex-[3] bg-[#0F172A] border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col shadow-xl relative overflow-hidden group">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-2xl font-bold text-white">Proyección de Inversión Mensual</h3>
          </div>

          <div className="flex-1 w-full relative min-h-[200px] flex flex-col justify-center py-4">
            
            <div className="absolute inset-y-0 right-0 left-[140px] sm:left-[160px] flex justify-between z-0 pointer-events-none opacity-20">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="h-full border-l border-dashed border-slate-400 w-px"></div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col gap-10 w-full">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center w-full group/bar">
                  <div className="w-[140px] sm:w-[160px] shrink-0 text-right pr-4">
                    <span className="text-sm font-bold text-slate-300 transition-colors group-hover/bar:text-white">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex-1 h-12 bg-slate-800/50 rounded-r-md relative flex items-center">
                    <div 
                      className={`h-full ${item.color} rounded-r-md transition-all duration-1500 ease-out flex items-center shadow-lg`}
                      style={{ 
                        width: mounted ? item.width : '0%',
                        minWidth: item.isFree ? '4px' : '0'
                      }}
                    ></div>
                    
                    <div 
                      className={`absolute whitespace-nowrap font-extrabold text-xl transition-all duration-1500 ease-out pl-4 ${item.textVal}`}
                      style={{ 
                        left: mounted ? item.width : '0%',
                        opacity: mounted ? 1 : 0
                      }}
                    >
                      {item.display}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 right-0 left-[140px] sm:left-[160px] border-t border-slate-700 z-0"></div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between text-xs text-slate-500 gap-2">
            <p className="flex items-center"><i className="fas fa-check-circle mr-2 text-emerald-400"></i> Infraestructura moderna en la nube (BaaS).</p>
            <p className="font-semibold text-slate-400">Synapse escala por almacenamiento, no por usuario.</p>
          </div>
        </div>

        {/* Right Column: ROI & Stats */}
        <div className="flex-[2] flex flex-col gap-6">
          
          {/* Main Cost Card */}
          <div className="bg-gradient-to-br from-[#064E3B]/40 to-[#022C22]/60 border border-emerald-600/50 rounded-2xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-[0_10px_30px_rgba(16,185,129,0.15)] group transition-transform duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
            
            <span className="inline-block px-4 py-1.5 bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-bold uppercase tracking-widest mb-2 shadow-inner">
              Costo Operativo Actual
            </span>
            
            <h2 className="text-6xl lg:text-7xl font-extrabold text-emerald-400 my-4 animate-float-number tracking-tight">
              $0
            </h2>
            <p className="text-emerald-100/80 text-sm font-medium mb-6">Mensuales en infraestructura base</p>
            
            <div className="w-full bg-black/40 border border-black/50 rounded-xl p-4 text-left shadow-inner">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                <span className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Operación Actual:</span>
                <span className="text-emerald-400 font-mono text-sm font-bold">100% Cubierta</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60 text-xs uppercase tracking-wide font-semibold">Escalado Máximo Proyectado:</span>
                <span className="text-blue-400 font-mono text-base font-extrabold drop-shadow-md">~$20/mes</span>
              </div>
            </div>
          </div>

          {/* Feature 1: Serverless */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700 flex items-start sm:items-center flex-col sm:flex-row gap-4 transition-colors hover:bg-slate-800 hover:border-slate-600">
            <div className="w-12 h-12 shrink-0 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 text-xl shadow-inner">
              <i className="fas fa-server"></i>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-blue-900/30 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5">
                Infraestructura
              </span>
              <h4 className="text-white font-bold text-base leading-tight">Serverless & Escalable</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">Capa gratuita y generosa de Vercel/Supabase cubre el 100% de la operación actual institucional.</p>
            </div>
          </div>

          {/* Feature 2: Previsibilidad */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700 flex items-start sm:items-center flex-col sm:flex-row gap-4 transition-colors hover:bg-slate-800 hover:border-slate-600">
            <div className="w-12 h-12 shrink-0 bg-purple-900/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 text-xl shadow-inner">
              <i className="fas fa-calculator"></i>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-500/20 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5">
                Previsibilidad
              </span>
              <h4 className="text-white font-bold text-base leading-tight">Costos Controlados</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">El crecimiento masivo de datos está proyectado a un tope de ~$20 USD mensuales por almacenamiento extra.</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default SlideCostROI;