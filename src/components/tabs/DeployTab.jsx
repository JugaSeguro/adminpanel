import React from 'react'
import { Rocket, Play, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { useDeploySite, useDeployAllSites } from '../../hooks/useApi'
import useAppStore from '../../store/useStore'

const DeployTab = () => {
  const deploySite = useDeploySite()
  const deployAllSites = useDeployAllSites()
  const { deployLogs, addDeployLog, clearDeployLogs } = useAppStore()

  const sites = [
    {
      id: '1xclub-links-casinos',
      name: '1XClub Casinos',
      description: 'Página completa del casino con botones',
      icon: '🎰'
    },
    {
      id: '1xclub-links-wsp',
      name: '1XClub WhatsApp',
      description: 'Redirección directa a WhatsApp',
      icon: '💬'
    },
    {
      id: '24envivo-links-casinos',
      name: '24EnVivo Casinos',
      description: 'Página completa del casino con botones',
      icon: '🎰'
    },
    {
      id: '24envivo-links-wsp',
      name: '24EnVivo WhatsApp',
      description: 'Redirección directa a WhatsApp',
      icon: '💬'
    }
  ]

  const handleDeploySite = async (siteId, siteName) => {
    addDeployLog(`Iniciando despliegue de ${siteName}...`)
    try {
      await deploySite.mutateAsync(siteId)
      addDeployLog(`✅ ${siteName} desplegado correctamente`)
    } catch (error) {
      addDeployLog(`❌ Error desplegando ${siteName}: ${error.message}`)
    }
  }

  const handleDeployAll = async () => {
    const shouldDeploy = window.confirm(
      '¿Estás seguro de que deseas redesplegar todos los sitios? Esta operación puede tardar varios minutos.'
    )
    
    if (!shouldDeploy) return

    addDeployLog('🚀 Iniciando despliegue masivo de todos los sitios...')
    try {
      await deployAllSites.mutateAsync()
      addDeployLog('✅ Todos los sitios han sido desplegados correctamente')
    } catch (error) {
      addDeployLog(`❌ Error en despliegue masivo: ${error.message}`)
    }
  }

  const getLogIcon = (message) => {
    if (message.includes('✅')) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (message.includes('❌')) return <AlertCircle className="w-4 h-4 text-red-500" />
    if (message.includes('🚀')) return <Rocket className="w-4 h-4 text-blue-500" />
    return <Clock className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Control de Despliegue
          </h2>
        </div>
      </div>

      {/* Despliegue Individual */}
      <div className="deploy-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Despliegue Individual
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site) => (
            <div key={site.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{site.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{site.name}</h4>
                    <p className="text-sm text-gray-600">{site.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeploySite(site.id, site.name)}
                  disabled={deploySite.isLoading}
                  className="btn btn-secondary flex-shrink-0"
                >
                  {deploySite.isLoading ? (
                    <>
                      <div className="spinner" />
                      Desplegando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Desplegar
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Despliegue Masivo */}
      <div className="deploy-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Despliegue Masivo
        </h3>
        
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            Actualizar Todos los Sitios
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Esto actualizará la configuración y redespliegará los 4 sitios simultáneamente. 
            El proceso puede tardar algunos minutos.
          </p>
          
          <button
            onClick={handleDeployAll}
            disabled={deployAllSites.isLoading}
            className="btn btn-primary btn-lg"
          >
            {deployAllSites.isLoading ? (
              <>
                <div className="spinner" />
                Desplegando Todos...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Actualizar Todos los Sitios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Log de Despliegues */}
      <div className="deploy-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Log de Despliegues
          </h3>
          <button
            onClick={clearDeployLogs}
            disabled={deployLogs.length === 0}
            className="btn btn-secondary btn-sm"
          >
            Limpiar Log
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {deployLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay actividad reciente</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {deployLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-sm font-mono">
                  <span className="text-gray-400 flex-shrink-0">
                    [{log.timestamp}]
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    {getLogIcon(log.message)}
                    <span className="text-gray-100">{log.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="config-card bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-1" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">
              Información sobre Despliegues
            </h4>
            <div className="text-sm text-amber-800 space-y-2">
              <p>
                <strong>Despliegue Individual:</strong> Actualiza solo el sitio seleccionado. 
                Útil para cambios específicos o pruebas.
              </p>
              <p>
                <strong>Despliegue Masivo:</strong> Actualiza todos los sitios a la vez. 
                Recomendado después de cambios en configuración global.
              </p>
              <p>
                <strong>Tiempo estimado:</strong> Individual (~1-2 min), Masivo (~3-5 min).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployTab
