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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-lg rounded-lg border-0 mx-2 max-w-md">
            <div className="text-center p-8">
              <div className="mb-6">
                <AlertTriangle size={60} className="text-red-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Oops! Algo salió mal</h2>
              <p className="text-gray-600 mb-6">
                Ha ocurrido un error inesperado en la aplicación. 
                Por favor, recarga la página para continuar.
              </p>
              <button
                onClick={this.handleReload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Recargar Aplicación
              </button>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 text-left">
                  <details className="mt-4">
                    <summary className="text-gray-500 text-sm cursor-pointer hover:text-gray-700">
                      Ver detalles del error
                    </summary>
                    <pre className="mt-3 p-4 bg-gray-100 rounded-lg text-sm text-red-600 overflow-auto max-h-48">
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