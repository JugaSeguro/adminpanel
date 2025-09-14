import React, { Suspense, useState } from 'react'
import { Link2, Phone } from 'lucide-react'
import './App.css'

// Lazy load components
const SupabaseLinksTab = React.lazy(() => import('./components/tabs/SupabaseLinksTab'))
const LandingPhonesTab = React.lazy(() => import('./components/tabs/LandingPhonesTab'))

function App() {
  const [activeTab, setActiveTab] = useState('global-links')

  const tabs = [
    {
      id: 'global-links',
      name: 'Enlaces Globales',
      icon: Link2,
      component: SupabaseLinksTab
    },
    {
      id: 'landing-phones',
      name: 'Números por Landing',
      icon: Phone,
      component: LandingPhonesTab
    }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Panel de Administración
            </h1>
            <p className="text-slate-600">
              Gestión de enlaces y números de teléfono con Supabase
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-600">Cargando...</span>
              </div>
            }>
              {ActiveComponent && <ActiveComponent />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App