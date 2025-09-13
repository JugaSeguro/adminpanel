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
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Configuración de URLs</h2>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="btn btn-outline-primary"
        >
          <RefreshCw size={16} className={`me-2 ${isLoading ? 'spinner-border spinner-border-sm' : ''}`} />
          Recargar Config
        </button>
      </div>

      {/* Enlaces Globales */}
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <Globe size={18} className="me-2 text-primary" />
          <h5 className="card-title mb-0">Enlaces Globales (Aplicados a Todos los Sitios)</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="whatsapp" className="form-label">WhatsApp (Único para todos):</label>
              <input
                id="whatsapp"
                type="url"
                value={formData.whatsappUrl}
                onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                placeholder="https://wa.link/oy1xno"
                className="form-control"
              />
              <div className="form-text">Este enlace se aplicará automáticamente a los 4 sitios</div>
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="telegram" className="form-label">Telegram (Único para todos):</label>
              <input
                id="telegram"
                type="url"
                value={formData.telegramUrl}
                onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                placeholder="https://t.me/jugadirecto"
                className="form-control"
              />
              <div className="form-text">Este enlace se aplicará automáticamente a los 4 sitios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Sitios */}
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center">
          <Info size={18} className="me-2 text-primary" />
          <h5 className="card-title mb-0">Configuración Automática de Sitios</h5>
        </div>
        <div className="card-body">
          <p className="mb-4">Los 4 sitios se configuran automáticamente. Solo necesitas cambiar WhatsApp y Telegram:</p>
          
          <div className="row g-3">
            {sitesMappingData.map((site, index) => (
              <div className="col-md-6" key={index}>
                <div className={`card h-100 ${site.type === 'casino' ? 'border-primary' : 'border-success'} border-opacity-25`}>
                  <div className="card-body">
                    <h5 className="card-title">{site.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      <span className="badge bg-secondary me-2">URL:</span>
                      <code>{site.url}</code>
                    </div>
                    <p className="card-text small">{site.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="alert alert-info mt-4">
            <div className="d-flex">
              <div className="flex-shrink-0">
                <Info size={24} />
              </div>
              <div className="ms-3">
                <h6 className="alert-heading">Configuración Simple:</h6>
                <ul className="mb-0 ps-3">
                  <li>Sitios 🎰 Casino (7 y 9): Muestran página completa con botones</li>
                  <li>Sitios 💬 WhatsApp (8 y 10): Redirigen directamente al WhatsApp</li>
                  <li>Solo cambias WhatsApp y Telegram arriba para actualizar todos automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="d-flex justify-content-end">
        <button
          onClick={handleSaveConfig}
          disabled={updateConfig.isLoading}
          className="btn btn-primary"
        >
          <Save size={16} className="me-2" />
          {updateConfig.isLoading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  )
}

export default ConfigTab