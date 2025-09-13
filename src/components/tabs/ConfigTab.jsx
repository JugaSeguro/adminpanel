import React, { useState, useEffect } from 'react'
import { RefreshCw, Save, Globe, Info, Link, MessageCircle, Send, Sparkles } from 'lucide-react'
import { useConfig, useUpdateConfig } from '../../hooks/useApi'
import useAppStore from '../../store/useStore'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import { SiteCardSkeleton } from '../ui/SkeletonLoader'

const ConfigTab = () => {
  const { data: config, isLoading, refetch } = useConfig()
  const updateConfig = useUpdateConfig()
  const { setLoading, getFallbackConfig, addDeployLog } = useAppStore()
  
  const [formData, setFormData] = useState({
    whatsappUrl: '',
    telegramUrl: ''
  })
  
  const [isFormValid, setIsFormValid] = useState(false)

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

  // Validar formulario
  useEffect(() => {
    const isValid = formData.whatsappUrl.trim() !== '' && formData.telegramUrl.trim() !== ''
    setIsFormValid(isValid)
  }, [formData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateUrl = (url, type) => {
    if (!url) return { isValid: false, message: 'URL requerida' }
    
    if (type === 'whatsapp') {
      if (!url.includes('wa.me') && !url.includes('whatsapp.com')) {
        return { isValid: false, message: 'Debe ser una URL de WhatsApp válida' }
      }
    }
    
    if (type === 'telegram') {
      if (!url.includes('t.me') && !url.includes('telegram.me')) {
        return { isValid: false, message: 'Debe ser una URL de Telegram válida' }
      }
    }
    
    return { isValid: true, message: '' }
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
    <div className="space-y-4 md:space-y-8 animate-fade-in p-3 md:p-0">
      {/* Header con gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Configuración de URLs
              </h2>
              <p className="text-slate-600 mt-1 text-sm md:text-base">Gestiona los enlaces globales de todos los sitios</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="md"
            onClick={() => refetch()}
            isLoading={isLoading}
            loadingText="Recargando..."
            icon={<RefreshCw className="w-4 h-4" />}
            className="text-sm md:text-base"
          >
            Recargar Config
          </Button>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Enlaces Globales con diseño moderno */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Enlaces Globales</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Aplicados a todos los sitios</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* WhatsApp Input */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp Global</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.whatsappUrl}
                  onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                  placeholder="https://wa.link/oy1xno"
                  className={`w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 group-hover:bg-white/90 text-sm md:text-base ${
                    validateUrl(formData.whatsappUrl, 'whatsapp').isValid ? 'border-green-200' : 'border-red-200'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validateUrl(formData.whatsappUrl, 'whatsapp').isValid ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Se aplicará automáticamente a los 4 sitios</span>
              </p>
              {!validateUrl(formData.whatsappUrl, 'whatsapp').isValid && formData.whatsappUrl && (
                <p className="text-xs text-red-500 mt-1">{validateUrl(formData.whatsappUrl, 'whatsapp').message}</p>
              )}
            </div>
            
            {/* Telegram Input */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Telegram Global</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.telegramUrl}
                  onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                  placeholder="https://t.me/jugadirecto"
                  className={`w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 group-hover:bg-white/90 text-sm md:text-base ${
                    validateUrl(formData.telegramUrl, 'telegram').isValid ? 'border-blue-200' : 'border-red-200'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {validateUrl(formData.telegramUrl, 'telegram').isValid ? (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Se aplicará automáticamente a los 4 sitios</span>
              </p>
              {!validateUrl(formData.telegramUrl, 'telegram').isValid && formData.telegramUrl && (
                <p className="text-xs text-red-500 mt-1">{validateUrl(formData.telegramUrl, 'telegram').message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información de Sitios con diseño moderno */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Configuración Automática</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">4 sitios configurados</span>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3 md:space-x-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Configuración Inteligente</h4>
                <p className="text-blue-800 mb-3">Los 4 sitios se configuran automáticamente. Solo necesitas cambiar WhatsApp y Telegram arriba.</p>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Sitios 🎰 Casino (7 y 9): Página completa con botones</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Sitios 💬 WhatsApp (8 y 10): Redirección directa</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Actualización automática en todos los sitios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {sitesMappingData.map((site, index) => (
              <div key={index} className="group">
                <div className={`relative bg-white/80 backdrop-blur-sm border-2 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  site.type === 'casino' 
                    ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50/50' 
                    : 'border-green-200 hover:border-green-300 hover:bg-green-50/50'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl shadow-lg ${
                      site.type === 'casino' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-green-500 to-green-600'
                    }`}>
                      <span className="text-xl">{site.name.includes('🎰') ? '🎰' : '💬'}</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-800 mb-2">{site.name}</h5>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          site.type === 'casino' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          URL
                        </span>
                        <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono">{site.url}</code>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{site.description}</p>
                    </div>
                  </div>
                  
                  {/* Indicador de estado */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${
                      site.type === 'casino' ? 'bg-blue-400' : 'bg-green-400'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de Acción con diseño moderno */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                <Save className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Guardar Configuración</h4>
                <p className="text-sm text-slate-600">Los cambios se aplicarán a todos los sitios</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Indicador de validación */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isFormValid 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  isFormValid ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {isFormValid ? 'Formulario válido' : 'Campos requeridos'}
                </span>
              </div>
              
              {/* Botón de guardar */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSaveConfig}
                isLoading={updateConfig.isLoading}
                disabled={!isFormValid}
                loadingText="Guardando..."
                icon={<Save className="w-5 h-5" />}
                className="text-sm md:text-base font-semibold relative overflow-hidden"
              >
                Guardar Configuración
                
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigTab