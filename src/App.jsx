import React, { Suspense } from 'react'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import LoadingOverlay from './components/ui/LoadingOverlay'
import ErrorBoundary from './components/ui/ErrorBoundary'
import useAppStore from './store/useStore'

// Lazy loading de tabs para mejor rendimiento
const ConfigTab = React.lazy(() => import('./components/tabs/ConfigTab'))
const TextsTab = React.lazy(() => import('./components/tabs/TextsTab'))
const SitesTab = React.lazy(() => import('./components/tabs/SitesTab'))
const DeployTab = React.lazy(() => import('./components/tabs/DeployTab'))

function App() {
  const { activeTab, isLoading } = useAppStore()

  const renderActiveTab = () => {
    const TabComponent = {
      config: ConfigTab,
      texts: TextsTab,
      sites: SitesTab,
      deploy: DeployTab
    }[activeTab]

    return TabComponent ? <TabComponent /> : <ConfigTab />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Fondo decorativo animado */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl translate-y-1/2 animate-pulse"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
        backgroundSize: '60px 60px'
      }}></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ErrorBoundary>
          <Header />
          <Navigation />
          
          <main className="flex-1 p-3 sm:p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-slide-in-left">
              {/* Tarjeta principal con glassmorphism mejorado */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                
                {/* Contenido principal */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
                  {/* Header decorativo */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
                  
                  <div className="p-4 sm:p-6 lg:p-8">
                    <Suspense fallback={
                      <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 space-y-4 animate-fade-in">
                        {/* Spinner moderno */}
                        <div className="relative">
                          <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-12 sm:w-16 h-12 sm:h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-slate-600 font-semibold text-base sm:text-lg animate-pulse">Cargando panel de administración</p>
                          <p className="text-slate-400 text-xs sm:text-sm">Preparando la interfaz...</p>
                        </div>
                      </div>
                    }>
                      {renderActiveTab()}
                    </Suspense>
                  </div>
                </div>
              </div>
              
              {/* Footer decorativo */}
              <div className="text-center py-3 sm:py-4 animate-fade-in">
                <p className="text-slate-500 text-xs sm:text-sm font-medium hover-scale">
                  <span className="hidden sm:inline">Casino Admin Panel • Versión 2.0 • </span>
                  <span className="text-blue-600 hover:text-blue-700 transition-colors">Powered by React & Tailwind</span>
                </p>
              </div>
            </div>
          </main>

          {/* Overlay de loading global */}
          {isLoading && <LoadingOverlay />}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App