import React, { useState } from 'react'
import { Save, Github, MessageCircle, Link2 } from 'lucide-react'
import { useGitHubApi } from '../../hooks/useGitHubApi'
import Button from '../ui/Button'

const GitHubConfigTab = () => {
  const { updateAllWhatsAppLinks, isLoading, error, repositories } = useGitHubApi()
  
  const [whatsappUrl, setWhatsappUrl] = useState('https://wa.link/oy1xno')

  const handleUpdateWhatsApp = async () => {
    try {
      await updateAllWhatsAppLinks(whatsappUrl)
    } catch (error) {
      console.error('Error updating WhatsApp:', error)
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
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl shadow-lg">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover-scale">
                <span className="hidden sm:inline">Actualizar Links de WhatsApp</span>
                <span className="sm:hidden">WhatsApp Links</span>
              </h2>
              <p className="text-green-200/80 text-xs sm:text-sm font-medium tracking-wide hidden sm:block">
                Actualiza el link de WhatsApp en los 4 sitios de casino
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
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Sitios que se actualizarán */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sitios que se Actualizarán</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {repositories.map(siteName => (
              <div key={siteName} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-white/20">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-slate-700">
                  {siteDisplayNames[siteName] || siteName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulario de WhatsApp */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30"></div>
        
        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nuevo Link de WhatsApp</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          
          <div className="max-w-2xl">
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>URL de WhatsApp</span>
              </label>
              <input
                type="url"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://wa.link/oy1xno"
                className="w-full px-4 py-4 bg-white/80 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 group-hover:bg-white/90 text-base border-green-200"
              />
              <p className="text-sm text-slate-500 mt-2">
                Este link se actualizará en todos los botones de WhatsApp de los 4 sitios
              </p>
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
                <h4 className="font-semibold text-slate-800">Actualizar en GitHub</h4>
                <p className="text-sm text-slate-600">
                  Se actualizarán todos los links de WhatsApp en los 4 sitios
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
                onClick={handleUpdateWhatsApp}
                isLoading={isLoading}
                loadingText="Actualizando..."
                icon={<Github className="w-5 h-5" />}
                className="text-sm md:text-base font-semibold relative overflow-hidden"
              >
                Actualizar WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GitHubConfigTab
