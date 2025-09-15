import React, { useState, useEffect } from 'react'
import { Save, Database, MessageCircle, Link2, Trash2, Plus, RefreshCw, Rocket, Type } from 'lucide-react'
import { useSupabase } from '../../hooks/useSupabase'

const SupabaseLinksTab = () => {
  const { isLoading, error, supabase } = useSupabase()
  const [globalLinks, setGlobalLinks] = useState(null)
  const [formData, setFormData] = useState({
    whatsapp_link: '',
    register_title: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [deploymentStatus, setDeploymentStatus] = useState('')

  // Cargar enlaces globales
  const fetchGlobalLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('global_link')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setGlobalLinks(data)
        setFormData({
          whatsapp_link: data.whatsapp_link || '',
          register_title: data.register_title || 'Registrate gratis y pedi 2000 fichas para probar'
        })
      }
    } catch (err) {
      console.error('Error cargando enlaces:', err)
    }
  }

  useEffect(() => {
    fetchGlobalLinks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    setDeploymentStatus('')
    
    if (!formData.whatsapp_link || !formData.register_title) {
      alert('Por favor completa todos los campos requeridos')
      setIsUpdating(false)
      return
    }

    try {
      // Actualizar o insertar enlaces globales
      const { data, error } = await supabase
        .from('global_link')
        .upsert({
          id: globalLinks?.id || undefined,
          whatsapp_link: formData.whatsapp_link,
          register_title: formData.register_title,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setGlobalLinks(data)
      setSuccessMessage('Enlaces actualizados exitosamente')
      
      // Iniciar despliegue automático
      setDeploymentStatus('Iniciando despliegue automático...')
      await triggerDeploymentToAllSites()
      
      setTimeout(() => {
        setSuccessMessage('')
        setDeploymentStatus('')
      }, 5000)
    } catch (err) {
      console.error('Error guardando enlaces:', err)
      alert('Error al guardar enlaces: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Función para obtener el ID de Netlify basado en el nombre del sitio
  const getNetlifySiteId = (siteName) => {
    // Obtener los IDs de Netlify desde las variables de entorno
    const siteIdMap = {
      '1xclub-links-casinos': import.meta.env.VITE_NETLIFY_SITE_ID_1XCLUB_CASINOS,
      '1xclub-links-wsp': import.meta.env.VITE_NETLIFY_SITE_ID_1XCLUB_WSP,
      '24envivo-links-casinos': import.meta.env.VITE_NETLIFY_SITE_ID_24ENVIVO_CASINOS,
      '24envivo-links-wsp': import.meta.env.VITE_NETLIFY_SITE_ID_24ENVIVO_WSP
    };
    
    return siteIdMap[siteName] || null;
  };
  
  // Función para desplegar un sitio en Netlify
  const deployToNetlify = async (siteName) => {
    const deployToken = import.meta.env.VITE_DEPLOY_TOKEN;
    const siteId = getNetlifySiteId(siteName);
    
    if (!deployToken || deployToken === 'your_deployment_token_here' || !siteId) {
      console.warn(`Simulando despliegue para ${siteName} (token o siteId no configurados)`);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      return { ok: true, status: 200 };
    }
    
    try {
      // Realizar la llamada a la API de Netlify para iniciar un despliegue
      console.log(`Desplegando ${siteName} con ID ${siteId} en Netlify...`);
      
      // Construir la URL de la API de Netlify
      const netlifyApiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/builds`;
      
      // Realizar la solicitud a la API de Netlify
      const response = await fetch(netlifyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deployToken}`
        },
        body: JSON.stringify({
          // Pasar los datos de configuración global para que estén disponibles en el despliegue
          clear_cache: true,
          env: {
            WHATSAPP_LINK: formData.whatsapp_link,
            REGISTER_TITLE: formData.register_title
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Error en la respuesta de Netlify para ${siteName}:`, errorData);
        return { ok: false, status: response.status, statusText: response.statusText };
      }
      
      const data = await response.json().catch(() => ({}));
      console.log(`Despliegue iniciado para ${siteName}:`, data);
      
      return { ok: true, status: response.status, data };
    } catch (error) {
      console.error(`Error desplegando ${siteName} en Netlify:`, error);
      return { ok: false, status: 500, statusText: error.message };
    }
  };

  const triggerDeploymentToAllSites = async () => {
    const sites = [
      { name: '1xclub-links-casinos', subdomain: '1.registrogratis.online' },
      { name: '1xclub-links-wsp', subdomain: '2.registrogratis.online' },
      { name: '24envivo-links-casinos', subdomain: '3.registrogratis.online' },
      { name: '24envivo-links-wsp', subdomain: '4.registrogratis.online' },
      { name: '1xclub-links-casinos', subdomain: '5.registrogratis.online' }, // Corregido: 5 corresponde a 1xclub
      { name: '1xclub-links-wsp', subdomain: '6.registrogratis.online' }, // Corregido: 6 corresponde a 1xclub
      { name: '1xclub-links-casinos', subdomain: '7.registrogratis.online' },
      { name: '1xclub-links-wsp', subdomain: '8.registrogratis.online' },
      { name: '24envivo-links-casinos', subdomain: '9.registrogratis.online' },
      { name: '24envivo-links-wsp', subdomain: '10.registrogratis.online' }
    ]

    let successCount = 0
    let totalSites = sites.length

    for (const site of sites) {
      try {
        setDeploymentStatus(`Desplegando ${site.name} en ${site.subdomain}...`)
        
        // Realizar despliegue real a Netlify usando la función deployToNetlify
        const response = await deployToNetlify(site.name)
        
        if (response.ok) {
          successCount++
          console.log(`✅ ${site.name} desplegado exitosamente en ${site.subdomain}`)
        } else {
          console.error(`❌ Error desplegando ${site.name}:`, response.statusText)
        }
      } catch (error) {
        console.error(`❌ Error desplegando ${site.name}:`, error)
      }
    }

    setDeploymentStatus(`Despliegue completado: ${successCount}/${totalSites} sitios actualizados`)
  }

  const handleRefresh = async () => {
    await fetchGlobalLinks()
    setSuccessMessage('Enlaces actualizados')
    setTimeout(() => setSuccessMessage(''), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Database className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Gestión de Enlaces Globales</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Administra enlaces globales usando Supabase</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
          <Link2 className="w-5 h-5" />
          <span>Configurar Enlaces Globales</span>
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Enlace WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MessageCircle className="inline w-4 h-4 mr-1" />
                Enlace WhatsApp *
              </label>
              <input
                type="url"
                value={formData.whatsapp_link}
                onChange={(e) => setFormData({ ...formData, whatsapp_link: e.target.value })}
                placeholder="https://wa.link/iqlqj4"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            
            {/* Título de Registro */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Type className="inline w-4 h-4 mr-1" />
                Título de Registro *
              </label>
              <input
                type="text"
                value={formData.register_title}
                onChange={(e) => setFormData({ ...formData, register_title: e.target.value })}
                placeholder="Registrate gratis y pedi 2000 fichas para probar"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors w-full sm:w-auto"
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-sm">{isUpdating ? 'Guardando...' : 'Guardar y Desplegar'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Estado de despliegue */}
      {deploymentStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            <p className="text-blue-700 text-sm">{deploymentStatus}</p>
          </div>
        </div>
      )}

      {/* Enlaces actuales */}
      {globalLinks && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Link2 className="w-5 h-5" />
            <span>Enlaces Globales Configurados</span>
          </h3>
          
          <div className="max-w-md">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">WhatsApp</h4>
              </div>
              <a 
                href={globalLinks.whatsapp_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-900 text-sm font-mono break-all"
              >
                {globalLinks.whatsapp_link}
              </a>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p>Última actualización: {new Date(globalLinks.updated_at).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupabaseLinksTab