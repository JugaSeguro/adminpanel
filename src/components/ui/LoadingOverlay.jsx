import React from 'react'
import useAppStore from '../../store/useStore'

const LoadingOverlay = () => {
  const { loadingMessage } = useAppStore()

  return (
    <div className="overlay-modern">
      <div className="modal-modern text-center">
        <div className="spinner-modern mx-auto mb-4">
          <span className="sr-only">Cargando...</span>
        </div>
        <p className="text-gray-700 font-medium">{loadingMessage || 'Procesando...'}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay