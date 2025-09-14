import React from 'react'
import useAppStore from '../../store/useStore'

const Navigation = () => {
  const { activeTab, setActiveTab } = useAppStore()

  const tabs = [
    {
      id: 'config',
      label: 'URLs y Enlaces',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: 'Configurar enlaces globales',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'texts',
      label: 'Textos y Botones',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: 'Personalizar contenido y textos',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 'sites',
      label: 'Estado de Sitios',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      description: 'Monitorear estado de sitios',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      id: 'deploy',
      label: 'Despliegue',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      description: 'Gestionar despliegues',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      description: 'Actualizar vía GitHub API',
      color: 'from-gray-700 to-gray-900',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20'
    }
  ]

  return (
    <nav className="relative bg-white/50 backdrop-blur-sm border-b border-white/20 shadow-lg animate-fade-in">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-1.5 sm:py-2">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            <span className="hidden sm:inline">Panel de Control</span>
            <span className="sm:hidden">Panel</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 hidden md:block">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </div>
        </div>
        
        <div className="relative">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide pb-2 animate-slide-in-left">
            {tabs.map(({ id, label, icon, description, color, bgColor, borderColor }, index) => (
              <button
                key={id}
                className={`group relative flex items-center space-x-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md font-medium transition-all duration-300 whitespace-nowrap hover-scale hover-lift text-xs ${
                  activeTab === id
                    ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105 transform animate-pulse`
                    : `${bgColor} ${borderColor} border text-slate-600 hover:text-slate-800 hover:scale-105 hover:shadow-md`
                }`}
                onClick={() => setActiveTab(id)}
                title={description}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Indicador activo */}
                {activeTab === id && (
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                )}
                
                {/* Icono */}
                <div className={`relative z-10 transition-transform duration-300 ${
                  activeTab === id ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {icon}
                </div>
                
                {/* Label */}
                <span className="relative z-10 font-semibold hidden sm:inline">{label}</span>
                <span className="relative z-10 font-semibold text-xs sm:hidden">{label.split(' ')[0]}</span>
                
                {/* Badge de notificación (ejemplo) */}
                {id === 'sites' && (
                  <div className="relative z-10 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Indicador de scroll */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation