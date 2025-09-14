import React from 'react'

const Navigation = ({ activeTab, onTabChange }) => {

  const tabs = [
    {
      id: 'supabase-links',
      label: 'Gestión de Enlaces Globales',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: 'Gestionar enlaces de WhatsApp',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
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
                onClick={() => onTabChange(id)}
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