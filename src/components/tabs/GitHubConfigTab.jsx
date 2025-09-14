import React, { useState } from 'react'
import { Save, Github, RefreshCw, Globe, Link, MessageCircle, Send, Sparkles } from 'lucide-react'
import { useGitHubApi } from '../../hooks/useGitHubApi'
import Button from '../ui/Button'

const GitHubConfigTab = () => {
  const { updateText, updateAllSites, isLoading, error, repositories } = useGitHubApi()
  
  const [formData, setFormData] = useState({
    whatsappUrl: 'https://wa.link/oy1xno',
    telegramUrl: 'https://t.me/jugadirecto',
    mainTitle: 'Registrate gratis y pedi 2000 fichas para probar',
    subtitle: 'Crea tu cuenta rápido y seguro ✨'
  })
  
  const [selectedSites, setSelectedSites] = useState(repositories)
  const [updateType, setUpdateType] = useState('all') // 'all' o 'selected'

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSiteToggle = (siteName) => {
    setSelectedSites(prev => 
      prev.includes(siteName) 
        ? prev.filter(site => site !== siteName)
        : [...prev, siteName]
    )
  }

  const handleUpdateTexts = async () => {
    try {
      if (updateType === 'all') {
        // Actualizar todos los sitios
        await updateAllSites('mainTitle', formData.mainTitle)
        await updateAllSites('subtitle', formData.subtitle)
        await updateAllSites('whatsappUrl', formData.whatsappUrl)
        await updateAllSites('telegramUrl', formData.telegramUrl)
      } else {
        // Actualizar solo sitios seleccionados
        for (const siteName of selectedSites) {
          await updateText(siteName, 'mainTitle', formData.mainTitle)
          await updateText(siteName, 'subtitle', formData.subtitle)
          await updateText(siteName, 'whatsappUrl', formData.whatsappUrl)
          await updateText(siteName, 'telegramUrl', formData.telegramUrl)
        }
      }
    } catch (error) {
      console.error('Error updating texts:', error)
    }
  }

  const siteDisplayNames = {
    '1xclub-links-casinos': '🎰 1XClub - Casinos',
    '1xclub-links-wsp': '💬 1XClub - WhatsApp',
    '24envivo-links-casinos': '🎰 24EnVivo - Casinos',
    '24envivo-links-wsp': '💬 24EnVivo - WhatsApp'
  }

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in p-3 md:p-0">
      {/* Header con gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
              <Github className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover-scale">
                <span className="hidden sm:inline">Configuración GitHub</span>
                <span className="sm:hidden">GitHub Config</span>
              </h2>
              <p className="text-blue-200/80 text-xs sm:text-sm font-medium tracking-wide hidden sm:block">
                Actualización directa vía GitHub API • Control de versiones
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              GitHub API
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Configuración de sitios */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sitios a Actualizar</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="updateType"
                  value="all"
                  checked={updateType === 'all'}
                  onChange={(e) => setUpdateType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="font-medium">Todos los sitios</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="updateType"
                  value="selected"
                  checked={updateType === 'selected'}
                  onChange={(e) => setUpdateType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="font-medium">Sitios seleccionados</span>
              </label>
            </div>
            
            {updateType === 'selected' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {repositories.map(siteName => (
                  <label key={siteName} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSites.includes(siteName)}
                      onChange={() => handleSiteToggle(siteName)}
                      className="text-blue-600 rounded"
                    />
                    <span className="font-medium text-slate-700">
                      {siteDisplayNames[siteName] || siteName}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulario de configuración */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Configuración de Contenido</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Título Principal */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Título Principal</span>
              </label>
              <input
                type="text"
                value={formData.mainTitle}
                onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                placeholder="Registrate gratis y pedi 2000 fichas para probar"
                className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 group-hover:bg-white/90 text-sm md:text-base border-blue-200"
              />
            </div>
            
            {/* Subtítulo */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Subtítulo</span>
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                placeholder="Crea tu cuenta rápido y seguro ✨"
                className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 group-hover:bg-white/90 text-sm md:text-base border-purple-200"
              />
            </div>
            
            {/* WhatsApp URL */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>WhatsApp URL</span>
              </label>
              <input
                type="url"
                value={formData.whatsappUrl}
                onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                placeholder="https://wa.link/oy1xno"
                className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 group-hover:bg-white/90 text-sm md:text-base border-green-200"
              />
            </div>
            
            {/* Telegram URL */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <Send className="w-4 h-4 text-blue-600" />
                <span>Telegram URL</span>
              </label>
              <input
                type="url"
                value={formData.telegramUrl}
                onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                placeholder="https://t.me/jugadirecto"
                className="w-full px-3 md:px-4 py-3 md:py-4 bg-white/80 border-2 rounded-lg md:rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 group-hover:bg-white/90 text-sm md:text-base border-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón de actualización */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                <Save className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Actualizar vía GitHub</h4>
                <p className="text-sm text-slate-600">
                  Los cambios se aplicarán directamente a los archivos fuente
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              {error && (
                <div className="text-red-600 text-sm bg-red-100 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}
              
              <Button
                variant="primary"
                size="lg"
                onClick={handleUpdateTexts}
                isLoading={isLoading}
                loadingText="Actualizando..."
                icon={<Github className="w-5 h-5" />}
                className="text-sm md:text-base font-semibold relative overflow-hidden"
              >
                Actualizar en GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubConfigTab
