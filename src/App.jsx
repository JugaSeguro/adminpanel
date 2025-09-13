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
    <ErrorBoundary>
      <div className="admin-container">
        <Header />
        <Navigation />
        
        <main className="admin-content">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="spinner" />
                <span>Cargando...</span>
              </div>
            </div>
          }>
            {renderActiveTab()}
          </Suspense>
        </main>

        {/* Overlay de loading global */}
        {isLoading && <LoadingOverlay />}
      </div>
    </ErrorBoundary>
  )
}

export default App
