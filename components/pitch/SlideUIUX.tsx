import React from 'react';

const SlideUIUX: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#060B19] flex flex-col relative overflow-hidden font-sans text-white">
      {/* CSS Personalizado para Mockups y Efectos */}
      <style>{`
        .bg-grid {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=');
        }

        /* Mockup Container */
        .mockup-container {
          background: #0F172A;
          border-radius: 12px;
          border: 1px solid #1E293B;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .mockup-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.2);
          border-color: #3B82F6;
        }

        .mockup-header {
          height: 24px;
          background: #1E293B;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border-bottom: 1px solid #334155;
        }

        /* Abstract UI Representations */
        .ui-login-form {
          width: 60%;
          padding: 20px;
          background: #0F172A;
          border-radius: 8px;
          border: 1px solid #1E293B;
        }
        
        .ui-upload {
          width: 80%;
          height: 60%;
          border: 2px dashed #3B82F6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 99, 235, 0.05);
        }

        .ui-dashboard {
          width: 100%;
          height: 100%;
          padding: 12px;
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 12px;
        }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-5 bg-grid"></div>

      {/* Header */}
      <header className="relative z-10 w-full px-8 pt-10 pb-6 lg:px-16 border-b border-white/5 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-b from-[#060B19] to-transparent">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-4 py-1.5 bg-purple-900/30 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 uppercase tracking-wider">
              Showcase
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Diseño UI/UX Premium</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg">Experiencia de usuario moderna, oscura y sin distracciones.</p>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 text-gray-500 bg-[#0F172A] px-4 py-2 rounded-lg border border-[#1E293B]">
          <i className="fas fa-magic"></i>
          <span className="text-sm font-medium tracking-wide">Estética IPG v1.0</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-8 lg:px-16 py-10 relative z-10 flex flex-col lg:flex-row gap-10 overflow-hidden">
        
        {/* Left Column: Triptych Visuals (Mockups) */}
        <div className="w-full lg:w-2/3 relative min-h-[480px]">
          
          {/* Mockup 1: Login (Top Left) */}
          <div className="mockup-container absolute top-0 left-0 w-[45%] h-[230px] z-10 bg-[#020617]">
            <div className="mockup-header">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="h-[calc(100%-24px)] relative flex items-center justify-center">
              <p className="text-[10px] text-gray-600 absolute bottom-2 font-mono uppercase tracking-widest">Login Screen</p>
              
              {/* Abstract UI Login */}
              <div className="ui-login-form">
                <div className="flex justify-center mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-bolt text-white text-[10px]"></i>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded mb-2.5"></div>
                <div className="h-2 w-full bg-slate-700 rounded mb-2.5"></div>
                <div className="h-5 w-full bg-blue-600 rounded mt-3"></div>
              </div>

              {/* Hover Overlay Placeholder */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                <p className="text-white text-xs font-bold tracking-wider uppercase">[ Insertar Captura Login ]</p>
              </div>
            </div>
          </div>

          {/* Mockup 2: Resource Interface (Bottom Left) */}
          <div className="mockup-container absolute bottom-0 left-0 w-[45%] h-[230px] z-10 bg-[#020617]">
            <div className="mockup-header">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="h-[calc(100%-24px)] relative flex items-center justify-center">
              <p className="text-[10px] text-gray-600 absolute bottom-2 font-mono uppercase tracking-widest">Upload Interface</p>
              
              {/* Abstract UI Upload */}
              <div className="ui-upload">
                <div className="text-center">
                  <i className="fas fa-cloud-upload-alt text-blue-500 text-3xl mb-3"></i>
                  <div className="h-1.5 w-16 bg-slate-600 rounded mx-auto"></div>
                </div>
              </div>

              {/* Hover Overlay Placeholder */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                <p className="text-white text-xs font-bold tracking-wider uppercase">[ Insertar Captura Subida ]</p>
              </div>
            </div>
          </div>

          {/* Mockup 3: Dashboard (Large Right Side) */}
          <div className="mockup-container absolute top-4 bottom-4 right-0 w-[65%] z-20 bg-[#020617] shadow-2xl border-blue-500/30">
            <div className="mockup-header flex justify-between">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="h-2 w-24 bg-slate-700 rounded-full opacity-50"></div>
            </div>
            
            <div className="h-[calc(100%-24px)] relative">
              {/* Abstract UI Dashboard */}
              <div className="ui-dashboard">
                {/* Sidebar */}
                <div className="bg-[#0F172A] rounded-md flex flex-col items-center py-4 gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded shadow-lg shadow-blue-500/20 mb-2"></div>
                  <div className="w-6 h-1.5 bg-slate-700 rounded-full"></div>
                  <div className="w-6 h-1.5 bg-slate-700 rounded-full"></div>
                  <div className="w-6 h-1.5 bg-slate-700 rounded-full"></div>
                  <div className="w-6 h-1.5 bg-slate-700 rounded-full"></div>
                </div>
                
                {/* Content Area */}
                <div className="flex flex-col gap-3">
                  {/* Top Stats */}
                  <div className="flex gap-3 h-12">
                    <div className="flex-1 bg-[#1E293B] rounded-md"></div>
                    <div className="flex-1 bg-[#1E293B] rounded-md"></div>
                    <div className="flex-1 bg-[#1E293B] rounded-md"></div>
                  </div>
                  
                  {/* Main Chart Area */}
                  <div className="flex-1 bg-[#0F172A] border border-dashed border-slate-700 rounded-md relative overflow-hidden flex items-end justify-around px-4 pt-8 pb-0">
                    <div className="w-[12%] bg-blue-500/30 h-[30%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/40 h-[60%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/60 h-[45%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/80 h-[80%] rounded-t-sm"></div>
                    <div className="w-[12%] bg-blue-500/50 h-[50%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>

              {/* Main Overlay Placeholder */}
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="text-center border border-dashed border-slate-500 bg-slate-900/50 p-6 rounded-xl">
                  <i className="fas fa-image text-4xl text-slate-400 mb-3"></i>
                  <p className="text-white text-sm font-bold uppercase tracking-wider">[ Insertar Captura Dashboard ]</p>
                  <p className="text-slate-500 text-xs mt-2">Reemplazar con imagen real 16:9</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Features List */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center lg:pl-10 lg:border-l border-white/10 mt-10 lg:mt-0">
          <h3 className="text-2xl font-bold text-white mb-8">Highlights de Diseño</h3>
          
          <div className="flex flex-col gap-4">
            
            {/* Feature 1 */}
            <div className="flex items-center p-3.5 bg-slate-800/40 rounded-xl border-l-4 border-blue-500 hover:bg-slate-800/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mr-4 shrink-0">
                <i className="fas fa-moon"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Dark Mode Premium</p>
                <p className="text-xs text-gray-400 mt-0.5">Reduce fatiga visual, ideal para uso prolongado.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center p-3.5 bg-slate-800/40 rounded-xl border-l-4 border-purple-500 hover:bg-slate-800/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mr-4 shrink-0">
                <i className="fas fa-mouse-pointer"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Interfaz Intuitiva</p>
                <p className="text-xs text-gray-400 mt-0.5">Curva de aprendizaje cero para nuevos usuarios.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center p-3.5 bg-slate-800/40 rounded-xl border-l-4 border-emerald-500 hover:bg-slate-800/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mr-4 shrink-0">
                <i className="fas fa-check-circle"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Adopción Garantizada</p>
                <p className="text-xs text-gray-400 mt-0.5">Diseñado pensando en flujos de trabajo reales.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center p-3.5 bg-slate-800/40 rounded-xl border-l-4 border-amber-500 hover:bg-slate-800/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mr-4 shrink-0">
                <i className="fas fa-font"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Tipografía Segoe UI</p>
                <p className="text-xs text-gray-400 mt-0.5">Legibilidad clara y moderna en todas las pantallas.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-center p-3.5 bg-slate-800/40 rounded-xl border-l-4 border-pink-500 hover:bg-slate-800/60 transition-colors">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mr-4 shrink-0">
                <i className="fas fa-universal-access"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Accesibilidad AAA</p>
                <p className="text-xs text-gray-400 mt-0.5">Contraste de color optimizado para todos.</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default SlideUIUX;