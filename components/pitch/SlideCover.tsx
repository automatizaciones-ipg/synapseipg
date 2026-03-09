export default function SlideCover() {
    return (
      <section className="relative w-[1280px] h-[720px] mx-auto flex flex-col items-center justify-center bg-[#060B19] overflow-hidden">
  
        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
  
        {/* Glow */}
        <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full" />
  
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')",
          }}
        />
  
        {/* Logo */}
        <div className="relative z-10 mb-12">
          <div className="w-32 h-32 bg-gray-900 border border-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
            <i className="fas fa-bolt text-6xl text-blue-500" />
          </div>
        </div>
  
        {/* Titles */}
        <h1 className="relative z-10 text-8xl font-extrabold tracking-tight mb-4">
          Synapse IPG
        </h1>
  
        <div className="h-1.5 w-32 bg-blue-600 rounded-full mb-6" />
  
        <h2 className="relative z-10 text-4xl font-light text-gray-300">
          Sistema Centralizado de Archivos y Recursos IPG
        </h2>
  
        {/* Footer */}
        <div className="absolute bottom-8 left-12 right-12 flex justify-between text-gray-500 text-sm border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-code-branch text-blue-600" />
            <span>v1.0.0 Stable Release</span>
          </div>
  
          <span className="uppercase tracking-widest text-xs">
            IPG - Instituto Profesional
          </span>
        </div>
  
      </section>
    )
  }