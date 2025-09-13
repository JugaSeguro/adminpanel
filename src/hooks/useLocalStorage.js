/**
 * Hook para manejar persistencia en localStorage como alternativa a la API
 * Esto permite que el panel funcione incluso cuando las funciones de Netlify fallan
 */

import { useState, useEffect } from 'react'
import { MOCK_CONFIG } from './useApi'

// Prefijo para todas las claves en localStorage
const STORAGE_PREFIX = 'admin_panel_'

/**
 * Hook para usar localStorage con un valor por defecto
 */
export const useLocalStorage = (key, defaultValue) => {
  const prefixedKey = STORAGE_PREFIX + key
  
  // Estado para almacenar el valor actual
  const [value, setValue] = useState(() => {
    try {
      // Intentar obtener del localStorage
      const item = window.localStorage.getItem(prefixedKey)
      // Parsear el JSON almacenado o usar el valor por defecto
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error al leer ${key} de localStorage:`, error)
      return defaultValue
    }
  })

  // Efecto para actualizar localStorage cuando cambia el valor
  useEffect(() => {
    try {
      // Guardar en localStorage
      window.localStorage.setItem(prefixedKey, JSON.stringify(value))
    } catch (error) {
      console.error(`Error al guardar ${key} en localStorage:`, error)
    }
  }, [prefixedKey, value])

  return [value, setValue]
}

/**
 * Hook específico para la configuración
 */
export const useLocalConfig = () => {
  // Usar MOCK_CONFIG como valor por defecto
  const [config, setConfig] = useLocalStorage('config', MOCK_CONFIG)
  
  // Función para actualizar la configuración
  const updateConfig = (newConfig) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      meta: {
        ...(prev.meta || {}),
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin-panel-local'
      }
    }))
  }

  // Función para actualizar solo los textos
  const updateTexts = (newTexts) => {
    setConfig(prev => ({
      ...prev,
      texts: {
        ...(prev.texts || {}),
        ...newTexts
      },
      meta: {
        ...(prev.meta || {}),
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin-panel-texts-local'
      }
    }))
  }

  return {
    config,
    updateConfig,
    updateTexts
  }
}

/**
 * Hook para el estado de los sitios (online/offline)
 */
export const useLocalSitesStatus = () => {
  // Estado inicial con todos los sitios online
  const initialStatus = {
    "1xclub-links-casinos": { online: true, lastDeploy: new Date().toISOString() },
    "1xclub-links-wsp": { online: true, lastDeploy: new Date().toISOString() },
    "24envivo-links-casinos": { online: true, lastDeploy: new Date().toISOString() },
    "24envivo-links-wsp": { online: true, lastDeploy: new Date().toISOString() }
  }
  
  const [sitesStatus, setSitesStatus] = useLocalStorage('sites_status', initialStatus)
  
  // Función para simular despliegue
  const deploySite = (siteName) => {
    setSitesStatus(prev => ({
      ...prev,
      [siteName]: {
        online: true,
        lastDeploy: new Date().toISOString()
      }
    }))
    
    return {
      success: true,
      message: `Sitio ${siteName} desplegado correctamente (simulado)`,
      deployUrl: `https://${siteName}.netlify.app`
    }
  }
  
  // Función para simular despliegue de todos los sitios
  const deployAllSites = () => {
    const now = new Date().toISOString()
    const newStatus = {}
    
    Object.keys(sitesStatus).forEach(site => {
      newStatus[site] = {
        online: true,
        lastDeploy: now
      }
    })
    
    setSitesStatus(newStatus)
    
    return {
      success: true,
      message: 'Todos los sitios desplegados correctamente (simulado)',
      deployedSites: Object.keys(sitesStatus)
    }
  }
  
  return {
    sitesStatus,
    deploySite,
    deployAllSites
  }
}
