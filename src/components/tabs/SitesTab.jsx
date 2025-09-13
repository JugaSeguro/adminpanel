import React from 'react'
import { Heart, ExternalLink, RefreshCw } from 'lucide-react'
import { useSitesStatus } from '../../hooks/useApi'
import Button from '../ui/Button'
import { SiteCardSkeleton } from '../ui/SkeletonLoader'

const SitesTab = () => {
  const { data: sitesStatus, isLoading, refetch } = useSitesStatus()

  const sites = [
    {
      id: '1xclub-links-casinos',
      name: '1XClub - Casinos',
      url: 'https://7.registrogratis.online',
      type: 'casino',
      icon: '🎰'
    },
    {
      id: '1xclub-links-wsp',
      name: '1XClub - WhatsApp',
      url: 'https://8.registrogratis.online',
      type: 'whatsapp',
      icon: '💬'
    },
    {
      id: '24envivo-links-casinos',
      name: '24EnVivo - Casinos',
      url: 'https://9.registrogratis.online',
      type: 'casino',
      icon: '🎰'
    },
    {
      id: '24envivo-links-wsp',
      name: '24EnVivo - WhatsApp',
      url: 'https://10.registrogratis.online',
      type: 'whatsapp',
      icon: '💬'
    }
  ]

  const getSiteStatus = (siteId) => {
    if (isLoading) {
      return {
        status: 'pending',
        text: 'Verificando...',
        lastDeploy: '--',
        responseTime: '--'
      }
    }

    const siteData = sitesStatus?.sites?.[siteId]
    if (!siteData) {
      return {
        status: 'offline',
        text: 'Sin datos',
        lastDeploy: '--',
        responseTime: '--'
      }
    }

    return {
      status: siteData.online ? 'online' : 'offline',
      text: siteData.online ? 'En línea' : 'Fuera de línea',
      lastDeploy: siteData.lastDeploy || 'Nunca',
      responseTime: siteData.responseTime ? `${siteData.responseTime}ms` : '--'
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Estado de los Sitios
          </h2>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => refetch()}
          isLoading={isLoading}
          loadingText="Verificando..."
          icon={<RefreshCw className="w-4 h-4" />}
          className="text-sm md:text-base"
        >
          <span className="hidden sm:inline">Verificar Estado</span>
          <span className="sm:hidden">Verificar</span>
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {isLoading ? (
          // Mostrar skeletons mientras carga
          Array.from({ length: 4 }).map((_, index) => (
            <SiteCardSkeleton key={index} />
          ))
        ) : (
          sites.map((site) => {
            const status = getSiteStatus(site.id)
            
            return (
              <div key={site.id} className="sites-card p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl">{site.icon}</span>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-900">
                      {site.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 break-all">{site.url}</p>
                  </div>
                </div>
                
                <span className={`status-badge border text-xs md:text-sm px-2 md:px-3 py-1 ${getStatusBadgeClass(status.status)}`}>
                  {status.text}
                </span>
              </div>

              {/* Status Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Último deploy:</span>
                  <span className="font-medium">{status.lastDeploy}</span>
                </div>
                
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Tiempo de respuesta:</span>
                  <span className="font-medium">{status.responseTime}</span>
                </div>
                
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium capitalize">
                    {site.type === 'casino' ? 'Página Casino' : 'Redirección WhatsApp'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(site.url, '_blank', 'noopener,noreferrer')}
                  icon={<ExternalLink className="w-4 h-4" />}
                  className="w-full justify-center text-sm md:text-base"
                >
                  Ver Sitio
                </Button>
              </div>
            </div>
          )
        }))
        )}
      </div>

      {/* Summary Stats */}
      {sitesStatus && (
        <div className="config-card p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            Resumen del Sistema
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg">
              <div className="text-lg md:text-2xl font-bold text-green-600">
                {Object.values(sitesStatus.sites || {}).filter(s => s.online).length}
              </div>
              <div className="text-xs md:text-sm text-green-700">Sitios en línea</div>
            </div>
            
            <div className="text-center p-2 md:p-3 bg-red-50 rounded-lg">
              <div className="text-lg md:text-2xl font-bold text-red-600">
                {Object.values(sitesStatus.sites || {}).filter(s => !s.online).length}
              </div>
              <div className="text-xs md:text-sm text-red-700">Sitios fuera de línea</div>
            </div>
            
            <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg">
              <div className="text-lg md:text-2xl font-bold text-blue-600">
                {Math.round(
                  Object.values(sitesStatus.sites || {})
                    .filter(s => s.responseTime)
                    .reduce((acc, s) => acc + s.responseTime, 0) /
                  Object.values(sitesStatus.sites || {}).filter(s => s.responseTime).length
                ) || 0}ms
              </div>
              <div className="text-xs md:text-sm text-blue-700">Tiempo promedio</div>
            </div>
            
            <div className="text-center p-2 md:p-3 bg-purple-50 rounded-lg">
              <div className="text-lg md:text-2xl font-bold text-purple-600">
                {new Date(sitesStatus.lastCheck || Date.now()).toLocaleTimeString()}
              </div>
              <div className="text-xs md:text-sm text-purple-700">Última verificación</div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="config-card bg-blue-50 border-blue-200 p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2 text-sm md:text-base">
              ¿Cómo interpretar los estados?
            </h4>
            <div className="text-xs md:text-sm text-blue-800 space-y-1">
              <p><strong>En línea:</strong> El sitio responde correctamente y está funcionando.</p>
              <p><strong>Fuera de línea:</strong> El sitio no responde o hay un error de conexión.</p>
              <p><strong>Verificando:</strong> Se está comprobando el estado del sitio en este momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SitesTab
