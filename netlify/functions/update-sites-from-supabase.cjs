const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const fs = require('fs').promises

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://slrzlggigpiinswjfvxr.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c'

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuración de sitios y sus hooks de deploy
const SITE_CONFIG = {
  '1xclub': {
    casinos: {
      buildHook: process.env.BUILD_HOOK_1XCLUB_CASINOS,
      name: '1xClub Casinos'
    },
    wsp: {
      buildHook: process.env.BUILD_HOOK_1XCLUB_WSP,
      name: '1xClub WhatsApp'
    }
  },
  '24envivo': {
    casinos: {
      buildHook: process.env.BUILD_HOOK_24ENVIVO_CASINOS,
      name: '24EnVivo Casinos'
    },
    wsp: {
      buildHook: process.env.BUILD_HOOK_24ENVIVO_WSP,
      name: '24EnVivo WhatsApp'
    }
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { httpMethod } = event
    
    if (httpMethod === 'POST') {
      return await updateAllSites(headers)
    } else if (httpMethod === 'GET') {
      return await getUpdateStatus(headers)
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    }
  } catch (error) {
    console.error('Error en función de actualización:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      })
    }
  }
}

// Actualizar todos los sitios con enlaces de Supabase
async function updateAllSites(headers) {
  try {
    console.log('Iniciando actualización de sitios desde Supabase...')
    
    // Obtener todos los enlaces de Supabase
    const { data: links, error } = await supabase
      .from('whatsapp_links')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    
    if (!links || links.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'No hay enlaces configurados en Supabase',
          deployments: []
        })
      }
    }
    
    console.log(`Encontrados ${links.length} enlaces en Supabase`)
    
    // Agrupar enlaces por sitio y tipo
    const linksBySite = {}
    links.forEach(link => {
      if (!linksBySite[link.site_name]) {
        linksBySite[link.site_name] = {}
      }
      linksBySite[link.site_name][link.link_type] = link.wa_link
    })
    
    console.log('Enlaces agrupados:', linksBySite)
    
    // Actualizar configuración y desplegar sitios
    const deploymentResults = []
    
    for (const [siteName, siteLinks] of Object.entries(linksBySite)) {
      for (const [linkType, waLink] of Object.entries(siteLinks)) {
        const siteConfig = SITE_CONFIG[siteName]?.[linkType]
        
        if (!siteConfig || !siteConfig.buildHook) {
          console.warn(`No se encontró configuración para ${siteName}-${linkType}`)
          continue
        }
        
        try {
          // Actualizar configuración local (si es necesario)
          await updateSiteConfig(siteName, linkType, waLink)
          
          // Disparar deploy
          const deployResult = await triggerDeploy(siteConfig.buildHook, siteConfig.name)
          
          deploymentResults.push({
            site: siteName,
            type: linkType,
            name: siteConfig.name,
            waLink: waLink,
            deployStatus: deployResult.success ? 'success' : 'failed',
            deployId: deployResult.deployId,
            error: deployResult.error
          })
          
          console.log(`Deploy ${deployResult.success ? 'exitoso' : 'fallido'} para ${siteConfig.name}`)
          
          // Pausa entre deploys para evitar sobrecarga
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          console.error(`Error desplegando ${siteConfig.name}:`, error)
          deploymentResults.push({
            site: siteName,
            type: linkType,
            name: siteConfig.name,
            waLink: waLink,
            deployStatus: 'failed',
            error: error.message
          })
        }
      }
    }
    
    const successCount = deploymentResults.filter(r => r.deployStatus === 'success').length
    const totalCount = deploymentResults.length
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Actualización completada: ${successCount}/${totalCount} sitios desplegados exitosamente`,
        deployments: deploymentResults,
        summary: {
          total: totalCount,
          successful: successCount,
          failed: totalCount - successCount
        }
      })
    }
    
  } catch (error) {
    console.error('Error actualizando sitios:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    }
  }
}

// Actualizar configuración local del sitio (placeholder)
async function updateSiteConfig(siteName, linkType, waLink) {
  // Aquí podrías actualizar archivos de configuración locales si es necesario
  // Por ahora solo logueamos la actualización
  console.log(`Configurando ${siteName}-${linkType} con enlace: ${waLink}`)
  return true
}

// Disparar deploy de Netlify
async function triggerDeploy(buildHook, siteName) {
  return new Promise((resolve) => {
    if (!buildHook) {
      resolve({ success: false, error: 'Build hook no configurado' })
      return
    }
    
    const url = new URL(buildHook)
    const postData = JSON.stringify({
      trigger_title: `Deploy desde Supabase - ${siteName}`,
      trigger_branch: 'main'
    })
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve({ 
              success: true, 
              deployId: response.id,
              message: `Deploy iniciado para ${siteName}`
            })
          } else {
            resolve({ 
              success: false, 
              error: `HTTP ${res.statusCode}: ${data}`
            })
          }
        } catch (parseError) {
          resolve({ 
            success: false, 
            error: `Error parseando respuesta: ${parseError.message}`
          })
        }
      })
    })
    
    req.on('error', (error) => {
      resolve({ 
        success: false, 
        error: `Error de conexión: ${error.message}`
      })
    })
    
    req.write(postData)
    req.end()
  })
}

// Obtener estado de actualización
async function getUpdateStatus(headers) {
  try {
    // Obtener últimas actualizaciones de Supabase
    const { data: links, error } = await supabase
      .from('whatsapp_links')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10)
    
    if (error) throw error
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        recentLinks: links || [],
        lastUpdate: links?.[0]?.updated_at || null,
        totalLinks: links?.length || 0
      })
    }
  } catch (error) {
    console.error('Error obteniendo estado:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    }
  }
}