import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="card shadow border-0 mx-2" style={{ maxWidth: '500px' }}>
            <div className="card-body text-center p-5">
              <div className="mb-4">
                <AlertTriangle size={60} className="text-danger" />
              </div>
              <h2 className="card-title mb-3">¡Oops! Algo salió mal</h2>
              <p className="card-text text-muted mb-4">
                Ha ocurrido un error inesperado en la aplicación. 
                Por favor, recarga la página para continuar.
              </p>
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
              >
                <RefreshCw size={16} className="me-2" />
                Recargar Aplicación
              </button>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 text-start">
                  <details className="mt-3">
                    <summary className="text-muted small cursor-pointer">
                      Ver detalles del error
                    </summary>
                    <pre className="mt-2 p-3 bg-light rounded small text-danger overflow-auto" style={{ maxHeight: '200px' }}>
                      {this.state.error?.toString()}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary