import React from 'react'
import { Rocket, Play, AlertCircle, CheckCircle, Clock, Zap, Globe, Activity, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 space-y-8">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header con diseño moderno */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Control de Despliegue
                </h1>
                <p className="text-slate-600 mt-1">Gestiona y despliega todos tus sitios web</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl border border-green-200">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Sistema Activo</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl border border-blue-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{sites.length} Sitios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Despliegue Individual */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Despliegue Individual</h3>
              <p className="text-slate-600">Despliega sitios específicos de forma independiente</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sites.map((site) => (
              <div key={site.id} className="group relative bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl border border-white/50">
                        {site.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{site.name}</h4>
                        <p className="text-slate-600 text-sm">{site.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-600 font-medium">Listo</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeploySite(site.id, site.name)}
                    disabled={deploySite.isLoading}
                    className={`w-full group/btn relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                      deploySite.isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {deploySite.isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Desplegando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Play className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        <span>Desplegar Sitio</span>
                      </div>
                    )}
                    
                    {/* Efecto de brillo */}
                    {!deploySite.isLoading && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Despliegue Masivo */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Despliegue Masivo</h3>
              <p className="text-slate-600">Actualiza y despliega todos los sitios simultáneamente</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl mx-auto w-fit">
                <Rocket className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h4 className="text-2xl font-bold text-slate-800 mb-3">
              Actualizar Todos los Sitios
            </h4>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
              Esta operación actualizará la configuración y redespliegará los {sites.length} sitios simultáneamente. 
              El proceso puede tardar algunos minutos y aplicará todos los cambios pendientes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl border border-blue-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{sites.length} Sitios</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">~5-10 minutos</span>
              </div>
            </div>
            
            <button
              onClick={handleDeployAll}
              disabled={deployAllSites.isLoading}
              className={`group relative px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl ${
                deployAllSites.isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:scale-105 hover:shadow-2xl'
              }`}
            >
              {deployAllSites.isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Desplegando Todos...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Actualizar Todos los Sitios</span>
                </div>
              )}
              
              {/* Efecto de brillo */}
              {!deployAllSites.isLoading && (
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Log de Despliegues con diseño moderno */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Log de Despliegues</h3>
                <p className="text-slate-600">Historial de actividad y estado de despliegues</p>
              </div>
            </div>
            
            <button
              onClick={clearDeployLogs}
              disabled={deployLogs.length === 0}
              className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                deployLogs.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Limpiar Log</span>
              </div>
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto border border-slate-700 shadow-inner">
            {deployLogs.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-400">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-slate-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative p-4 bg-slate-700 rounded-full">
                      <Clock className="w-12 h-12 mx-auto opacity-60" />
                    </div>
                  </div>
                  <p className="text-lg font-medium">No hay actividad reciente</p>
                  <p className="text-sm text-slate-500 mt-1">Los logs de despliegue aparecerán aquí</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {deployLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800/70 transition-colors duration-200">
                    <div className="flex-shrink-0 mt-0.5">
                      {getLogIcon(log)}
                    </div>
                    <span className="text-slate-400 font-mono text-xs mt-1 min-w-[80px]">
                      {new Date().toLocaleTimeString()}
                    </span>
                    <span className="text-slate-200 flex-1 font-medium leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información con diseño moderno */}
      <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-amber-900 mb-4">
                Información sobre Despliegues
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h5 className="font-bold text-amber-800 mb-2 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Despliegue Individual</span>
                  </h5>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    Actualiza solo el sitio seleccionado. Útil para cambios específicos o pruebas.
                    <span className="block mt-2 font-medium">⏱️ Tiempo estimado: ~1-2 minutos</span>
                  </p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                  <h5 className="font-bold text-amber-800 mb-2 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Despliegue Masivo</span>
                  </h5>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    Actualiza todos los sitios a la vez. Recomendado después de cambios en configuración global.
                    <span className="block mt-2 font-medium">⏱️ Tiempo estimado: ~5-10 minutos</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeployTab
