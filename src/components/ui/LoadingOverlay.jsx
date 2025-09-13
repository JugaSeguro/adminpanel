import React from 'react'
import useAppStore from '../../store/useStore'

const LoadingOverlay = () => {
  const { loadingMessage } = useAppStore()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border border-white/20 text-center animate-slide-in-left hover-lift max-w-sm w-full">
        <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
        <p className="text-gray-700 font-medium animate-pulse text-sm md:text-base">{loadingMessage || 'Procesando...'}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay