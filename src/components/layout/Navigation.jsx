import React from 'react'
import useAppStore from '../../store/useStore'

const Navigation = () => {
  const { activeTab, setActiveTab } = useAppStore()

  const tabs = [
    {
      id: 'config',
      label: 'URLs y Enlaces',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      description: 'Gestionar despliegues',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ]

  return (
    <nav className="relative bg-white/50 backdrop-blur-sm border-b border-white/20 shadow-lg animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
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
                className={`group relative flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 whitespace-nowrap hover-scale hover-lift ${
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