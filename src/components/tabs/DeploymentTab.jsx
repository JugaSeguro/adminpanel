import React, { useState } from 'react'
import { Rocket, RefreshCw, CheckCircle, XCircle, Clock, Database, Globe } from 'lucide-react'
import { useSupabase } from '../../hooks/useSupabase'

const DeploymentTab = () => {
  const { links, isLoading: linksLoading } = useSupabase()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResults, setDeploymentResults] = useState([])
  const [lastDeployment, setLastDeployment] = useState(null)
  const [error, setError] = useState(null)

  const handleDeployAll = async () => {
    try {
      setIsDeploying(true)
      setError(null)
      setDeploymentResults([])
      
      const response = await fetch('/.netlify/functions/update-sites-from-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en el despliegue')
      }
      
      setDeploymentResults(data.deployments || [])
      setLastDeployment({
        timestamp: new Date().toISOString(),
        summary: data.summary,
        message: data.message
      })
      
    } catch (err) {
      console.error('Error desplegando sitios:', err)
      setError(err.message)
    } finally {
      setIsDeploying(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Rocket className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Despliegue de Sitios</h2>
            <p className="text-slate-600 text-sm">Actualizar todos los sitios con enlaces de Supabase</p>
          </div>
        </div>
        
        <button
          onClick={handleDeployAll}
          disabled={isDeploying || linksLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Rocket className={`w-5 h-5 ${isDeploying ? 'animate-bounce' : ''}`} />
          <span>{isDeploying ? 'Desplegando...' : 'Desplegar Todos'}</span>
        </button>
      </div>

      {/* Estado actual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-slate-600">Enlaces en Supabase</p>
              <p className="text-2xl font-bold text-slate-800">{links.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-600">Sitios Configurados</p>
              <p className="text-2xl font-bold text-slate-800">4</p>
              <p className="text-xs text-slate-500">1xClub + 24EnVivo (Casinos + WSP)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-slate-600">Último Despliegue</p>
              <p className="text-lg font-bold text-slate-800">
                {lastDeployment ? (
                  new Date(lastDeployment.timestamp).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                ) : (
                  'Nunca'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">Error en el despliegue</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {lastDeployment && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{lastDeployment.message}</p>
          </div>
          {lastDeployment.summary && (
            <div className="mt-2 text-sm text-green-600">
              <span>Exitosos: {lastDeployment.summary.successful}</span>
              <span className="mx-2">•</span>
              <span>Fallidos: {lastDeployment.summary.failed}</span>
              <span className="mx-2">•</span>
              <span>Total: {lastDeployment.summary.total}</span>
            </div>
          )}
        </div>
      )}

      {/* Enlaces actuales */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Enlaces Configurados en Supabase</span>
        </h3>
        
        {links.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay enlaces configurados</p>
            <p className="text-sm">Configura enlaces en la pestaña de gestión</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {links.map((link) => (
              <div key={link.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-800 capitalize">
                    {link.site_name} - {link.link_type === 'casinos' ? 'Casinos' : 'WhatsApp'}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    link.link_type === 'casinos' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {link.link_type === 'casinos' ? 'Casinos' : 'WSP'}
                  </span>
                </div>
                <p className="text-sm text-blue-600 font-mono break-all mb-2">
                  {link.wa_link}
                </p>
                <p className="text-xs text-slate-500">
                  Actualizado: {new Date(link.updated_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resultados del último despliegue */}
      {deploymentResults.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Rocket className="w-5 h-5" />
            <span>Resultados del Despliegue</span>
          </h3>
          
          <div className="space-y-3">
            {deploymentResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.deployStatus)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.deployStatus)}
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm opacity-75">
                        {result.site} - {result.type} • {result.waLink}
                      </p>
                    </div>
                  </div>
                  
                  {result.deployId && (
                    <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded">
                      {result.deployId}
                    </span>
                  )}
                </div>
                
                {result.error && (
                  <p className="text-sm mt-2 opacity-75">
                    Error: {result.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Información del Despliegue</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Los enlaces se obtienen automáticamente desde Supabase</li>
          <li>• Se despliegan todos los sitios configurados: 1xClub y 24EnVivo</li>
          <li>• Cada sitio tiene versiones para Casinos y WhatsApp</li>
          <li>• El proceso puede tomar varios minutos en completarse</li>
        </ul>
      </div>
    </div>
  )
}

export default DeploymentTab