import React, { Suspense } from 'react'
import './App.css'

// Lazy load components
const SupabaseLinksTab = React.lazy(() => import('./components/tabs/SupabaseLinksTab'))

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Gestión de Enlaces Globales
            </h1>
            <p className="text-slate-600">
              Administración de enlaces WhatsApp con Supabase
            </p>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-slate-600">Cargando...</span>
              </div>
            }>
              <SupabaseLinksTab />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App