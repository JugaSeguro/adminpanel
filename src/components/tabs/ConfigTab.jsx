import React, { useState, useEffect } from 'react'
import { RefreshCw, Save, Globe, Info } from 'lucide-react'
import { useConfig, useUpdateConfig } from '../../hooks/useApi'
import useAppStore from '../../store/useStore'
import toast from 'react-hot-toast'

const ConfigTab = () => {
  const { data: config, isLoading, refetch } = useConfig()
  const updateConfig = useUpdateConfig()
  const { setLoading, getFallbackConfig, addDeployLog } = useAppStore()
  
  const [formData, setFormData] = useState({
    whatsappUrl: '',
    telegramUrl: ''
  })

  // Cargar datos del formulario cuando se obtiene la config
  useEffect(() => {
    if (config?.globalLinks) {
      setFormData({
        whatsappUrl: config.globalLinks.whatsappUrl || '',
        telegramUrl: config.globalLinks.telegramUrl || ''
      })
    } else {
      // Usar configuración fallback
      const fallback = getFallbackConfig()
      setFormData({
        whatsappUrl: fallback.globalLinks.whatsappUrl,
        telegramUrl: fallback.globalLinks.telegramUrl
      })
    }
  }, [config, getFallbackConfig])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveConfig = async () => {
    try {
      setLoading(true, 'Guardando configuración...')
      
      const configData = {
        globalLinks: {
          whatsappUrl: formData.whatsappUrl,
          telegramUrl: formData.telegramUrl,
          // URLs principales son fijas
          xclubUrl: "https://1xclub.bet",
          envivoUrl: "https://24envivo.com"
        },
        sites: {
          "1xclub-links-casinos": {
            brandName: "1XCLUB.BET",
            siteName: "1xclub-links-casinos",
            brandType: "1xclub"
          },
          "1xclub-links-wsp": {
            brandName: "1XCLUB.BET",
            siteName: "1xclub-links-wsp",
            brandType: "1xclub"
          },
          "24envivo-links-casinos": {
            brandName: "24ENVIVO.COM",
            siteName: "24envivo-links-casinos",
            brandType: "24envivo"
          },
          "24envivo-links-wsp": {
            brandName: "24ENVIVO.COM",
            siteName: "24envivo-links-wsp",
            brandType: "24envivo"
          }
        }
      }

      await updateConfig.mutateAsync(configData)
      addDeployLog('Configuración actualizada en el servidor')
      
      // Preguntar si desea redesplegar
      const shouldRedeploy = window.confirm(
        '¿Deseas redesplegar todos los sitios ahora para aplicar los cambios?'
      )
      
      if (shouldRedeploy) {
        // Aquí se podría llamar al hook de deploy all
        addDeployLog('Redespiegue solicitado por el usuario')
      }
      
    } catch (error) {
      console.error('Error saving config:', error)
    } finally {
      setLoading(false)
    }
  }

  const sitesMappingData = [
    {
      name: "🎰 1XClub - Casinos",
      url: "7.registrogratis.online",
      description: "Página completa del casino con enlace a https://1xclub.bet + botones WhatsApp/Telegram",
      type: "casino"
    },
    {
      name: "💬 1XClub - WhatsApp",
      url: "8.registrogratis.online",
      description: "Redirección directa al WhatsApp configurado arriba",
      type: "whatsapp"
    },
    {
      name: "🎰 24EnVivo - Casinos",
      url: "9.registrogratis.online",
      description: "Página completa del casino con enlace a https://24envivo.com + botones WhatsApp/Telegram",
      type: "casino"
    },
    {
      name: "💬 24EnVivo - WhatsApp",
      url: "10.registrogratis.online",
      description: "Redirección directa al WhatsApp configurado arriba",
      type: "whatsapp"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Configuración de URLs
        </h2>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recargar Config
        </button>
      </div>

      {/* Enlaces Globales */}
      <div className="config-card">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Enlaces Globales (Aplicados a Todos los Sitios)
          </h3>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp (Único para todos):</label>
            <input
              id="whatsapp"
              type="url"
              value={formData.whatsappUrl}
              onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
              placeholder="https://wa.link/oy1xno"
              className="form-control"
            />
            <small>Este enlace se aplicará automáticamente a los 4 sitios</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="telegram">Telegram (Único para todos):</label>
            <input
              id="telegram"
              type="url"
              value={formData.telegramUrl}
              onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
              placeholder="https://t.me/jugadirecto"
              className="form-control"
            />
            <small>Este enlace se aplicará automáticamente a los 4 sitios</small>
          </div>
        </div>
      </div>

      {/* Información de Sitios */}
      <div className="config-card">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configuración Automática de Sitios
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Los 4 sitios se configuran automáticamente. Solo necesitas cambiar WhatsApp y Telegram:
        </p>
        
        <div className="space-y-3">
          {sitesMappingData.map((site, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-2 ${
                site.type === 'casino' 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-gray-900">{site.name}</strong>
                  <span className="mx-2 text-gray-400">→</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {site.url}
                  </code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {site.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Configuración Simple:</strong>
              <br />• Sitios 🎰 Casino (7 y 9): Muestran página completa con botones
              <br />• Sitios 💬 WhatsApp (8 y 10): Redirigen directamente al WhatsApp
              <br />• Solo cambias WhatsApp y Telegram arriba para actualizar todos automáticamente
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfig}
          disabled={updateConfig.isLoading}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4" />
          {updateConfig.isLoading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  )
}

export default ConfigTab
