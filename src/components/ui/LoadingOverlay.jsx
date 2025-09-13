import React from 'react'
import useAppStore from '../../store/useStore'

const LoadingOverlay = () => {
  const { loadingMessage } = useAppStore()

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mb-0 fw-medium">{loadingMessage || 'Procesando...'}</p>
      </div>
    </div>
  )
}

export default LoadingOverlay