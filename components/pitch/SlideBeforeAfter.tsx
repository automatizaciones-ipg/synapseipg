import React from 'react';

const SlideBeforeAfter: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Layout Split y Efectos */}
      <style>{`
        /* Background Textures */
        .bg-pattern-left {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: radial-gradient(#EF4444 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .bg-pattern-right {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: radial-gradient(#3B82F6 1px, transparent 1px);
          background-size: 24px 24px;
        }

        /* Ambient Glows */
        .glow-red {
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(239, 68, 68, 0.06);
          filter: blur(100px);
          border-radius: 50%;
          top: 10%;
          left: 10%;
          pointer-events: none;
        }

        .glow-blue {
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(37, 99, 235, 0.08);
          filter: blur(100px);
          border-radius: 50%;
          top: 10%;
          right: 10%;
          pointer-events: none;
        }

        /* VS Badge Central */
        .vs-badge {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          background: #0F172A;
          border: 2px solid #334155;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 30;
          box-shadow: 0 0 30px rgba(0,0,0,0.6);
          font-weight: 900;
          font-style: italic;
          color: #94A3B8;
          font-size: 22px;
          letter-spacing: -1px;
          transition: all 0.3s ease;
        }

        .split-container:hover .vs-badge {
          transform: translate(-50%, -50%) scale(1.05);
          border-color: #475569;
          color: #F8FAFC;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
        }

        /* List Items Animados */
        .pain-point, .benefit-point {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }

        .pain-point:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.04);
        }

        .benefit-point:hover {
          transform: translateX(-5px);
          background: rgba(37, 99, 235, 0.15);
          box-shadow: 0 8px 15px -3px rgba(37, 99, 235, 0.2);
        }
      `}</style>

      {/* Main Split Container */}
      <div className="flex flex-col md:flex-row w-full h-full flex-1 relative split-container">
        
        {/* Left Side: The Problem (Before) */}
        <div className="w-full md:w-1/2 h-full bg-gradient-to-b from-[#0F172A] to-[#020617] relative border-r border-[#1E293B] overflow-hidden flex flex-col">
          <div className="bg-pattern-left"></div>
          <div className="glow-red"></div>
          
          <div className="flex-1 px-8 py-12 lg:px-16 lg:py-16 flex flex-col relative z-10 h-full max-w-2xl mx-auto md:ml-auto md:mr-0 w-full">
            
            {/* Header Antes */}
            <div className="mb-10 border-b border-white/5 pb-6">
              <span className="inline-block px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-500/20 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4">
                El Pasado
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-200 tracking-tight">Ecosistema Fragmentado</h2>
              <p className="text-slate-500 mt-2 text-sm lg:text-base">Información dispersa y procesos altamente manuales.</p>
            </div>

            {/* List of Pain Points */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Item 1 */}
              <div className="pain-point flex items-start p-4 rounded-xl bg-white/[0.02] border border-red-500/10">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-red-900/20 text-red-400 text-xl shrink-0">
                  <i className="fas fa-file-excel"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Caos Documental</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Archivos duplicados en Drive, discos locales y correos. Nadie sabe con certeza cuál es la versión final.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="pain-point flex items-start p-4 rounded-xl bg-white/[0.02] border border-red-500/10">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-red-900/20 text-red-400 text-xl shrink-0">
                  <i className="fas fa-search"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Tiempo Perdido</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Horas hombre desperdiciadas semanalmente buscando correos antiguos o solicitando accesos cruzados.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="pain-point flex items-start p-4 rounded-xl bg-white/[0.02] border border-red-500/10">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-red-900/20 text-red-400 text-xl shrink-0">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Riesgo Legal / Operativo</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Peligro constante de usar normativas o formatos desactualizados por falta de centralización oficial.</p>
                </div>
              </div>

            </div>

            {/* Metric Box Left */}
            <div className="mt-8 p-6 rounded-xl text-center bg-black/20 border border-dashed border-slate-700 w-full">
              <span className="block text-4xl font-extrabold text-slate-400 mb-1 drop-shadow-md">~4 hrs/sem</span>
              <span className="text-xs uppercase text-slate-500 tracking-widest font-semibold">Perdidas por empleado en búsqueda</span>
            </div>

          </div>
        </div>

        {/* Central Divider & VS Badge (Hidden on mobile, visible on md+) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 z-20"></div>
        <div className="hidden md:flex vs-badge">VS</div>

        {/* Right Side: The Solution (After) */}
        <div className="w-full md:w-1/2 h-full bg-gradient-to-b from-[#060B19] to-[#020617] relative overflow-hidden flex flex-col">
          <div className="bg-pattern-right"></div>
          <div className="glow-blue"></div>
          
          <div className="flex-1 px-8 py-12 lg:px-16 lg:py-16 flex flex-col relative z-10 h-full max-w-2xl mx-auto md:mr-auto md:ml-0 w-full">
            
            {/* Header Después */}
            <div className="mb-10 border-b border-white/5 pb-6">
              <span className="inline-block px-3 py-1.5 bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 rounded-md text-[11px] font-bold uppercase tracking-widest mb-4 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                Ahora (Synapse)
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Única Fuente de Verdad</h2>
              <p className="text-blue-200/60 mt-2 text-sm lg:text-base">Control total, gobernanza estructurada y eficiencia.</p>
            </div>

            {/* List of Benefits */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Item 1 */}
              <div className="benefit-point flex items-start p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-md">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 text-xl shrink-0">
                  <i className="fas fa-database"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Orden y Gobernanza</h4>
                  <p className="text-blue-100/70 text-sm leading-relaxed">Un repositorio central inmutable. La estructura digital refleja exactamente la estructura organizacional de IPG.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="benefit-point flex items-start p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-md">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 text-xl shrink-0">
                  <i className="fas fa-bolt"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Eficiencia Instantánea</h4>
                  <p className="text-blue-100/70 text-sm leading-relaxed">Acceso en milisegundos a cualquier recurso oficial, pre-clasificado y analizado por IA.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="benefit-point flex items-start p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-md">
                <div className="min-w-[44px] h-[44px] rounded-lg flex items-center justify-center mr-4 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 text-xl shrink-0">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">Seguridad Matemática (RLS)</h4>
                  <p className="text-blue-100/70 text-sm leading-relaxed">Garantía a nivel de base de datos de que cada área y usuario ve única y exclusivamente lo que le corresponde.</p>
                </div>
              </div>

            </div>

            {/* Metric Box Right */}
            <div className="mt-8 p-6 rounded-xl text-center bg-emerald-900/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] w-full relative overflow-hidden group">
              {/* Subtle sweep effect on hover */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shine"></div>
              
              <span className="block text-4xl font-extrabold text-emerald-400 mb-1 relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">100%</span>
              <span className="text-xs uppercase text-emerald-100/60 tracking-widest font-bold relative z-10">Trazabilidad y Control Total</span>
            </div>

          </div>
        </div>

      </div>

      {/* Animación custom para el brillo de la métrica derecha */}
      <style>{`
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SlideBeforeAfter;