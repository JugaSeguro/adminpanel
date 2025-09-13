import React from 'react'
import { useLoadingState } from '../../hooks/useApi'
import LocalStorageToggle from '../ui/LocalStorageToggle'

const Header = () => {
  const { connectionStatus } = useLoadingState()

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting': return 'text-amber-400'
      case 'online': return 'text-emerald-400'
      case 'offline': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusBgColor = () => {
    switch (connectionStatus) {
      case 'connecting': return 'bg-amber-400/20'
      case 'online': return 'bg-emerald-400/20'
      case 'offline': return 'bg-red-400/20'
      default: return 'bg-slate-400/20'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting': return 'Conectando...'
      case 'online': return 'En línea'
      case 'offline': return 'Desconectado'
      default: return 'Desconocido'
    }
  }

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-fade-in">
      {/* Fondo decorativo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10 animate-pulse"></div>
      
      <div className="relative px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo y título */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="relative group hover-scale">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 hover-lift">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-1 animate-slide-in-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent hover-scale">
                <span className="hidden sm:inline">Casino Admin Panel</span>
                <span className="sm:hidden">Casino Admin</span>
              </h1>
              <p className="text-blue-200/80 text-xs sm:text-sm font-medium tracking-wide hidden sm:block">
                Sistema de gestión integral • Dashboard avanzado
              </p>
            </div>
          </div>
          
          {/* Estado de conexión y controles */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Indicador de estado */}
            <div className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-full ${getStatusBgColor()} backdrop-blur-sm border border-white/10 hover-lift animate-slide-in-right`}>
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                {connectionStatus === 'online' && (
                  <div className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor()} animate-ping opacity-75`}></div>
                )}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${getStatusColor()}`}>
                <span className="hidden sm:inline">{getStatusText()}</span>
                <span className="sm:hidden">{getStatusText().split(' ')[0]}</span>
              </span>
            </div>
            
            {/* Toggle para modo localStorage */}
            <LocalStorageToggle />
          </div>
        </div>
      </div>
      
      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </header>
  )
}

export default Header