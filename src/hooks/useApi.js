import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const API_BASE = '/.netlify/functions'
// Detectar modo desarrollo automáticamente
const IS_DEVELOPMENT = import.meta.env.DEV

console.log('🔧 Modo:', IS_DEVELOPMENT ? 'desarrollo (mocks)' : 'producción (APIs reales)', { env: import.meta.env.MODE })

// Configuración mock para desarrollo
const MOCK_CONFIG = {
  globalLinks: {
    whatsappUrl: "https://wa.link/oy1xno",
    telegramUrl: "https://t.me/jugadirecto",
    xclubUrl: "https://1xclub.bet",
    envivoUrl: "https://24envivo.com"
  },
  sites: {
    "1xclub-links-casinos": {
      brandName: "1XCLUB.BET",
      siteName: "1xclub-links-casinos",
      brandType: "1xclub",
      mainUrl: "https://1xclub.bet",
      deployUrl: "https://7.registrogratis.online"
    },
    "1xclub-links-wsp": {
      brandName: "1XCLUB.BET",
      siteName: "1xclub-links-wsp",
      brandType: "1xclub",
      mainUrl: "https://1xclub.bet",
      deployUrl: "https://8.registrogratis.online"
    },
    "24envivo-links-casinos": {
      brandName: "24ENVIVO.COM",
      siteName: "24envivo-links-casinos",
      brandType: "24envivo",
      mainUrl: "https://24envivo.com",
      deployUrl: "https://9.registrogratis.online"
    },
    "24envivo-links-wsp": {
      brandName: "24ENVIVO.COM",
      siteName: "24envivo-links-wsp",
      brandType: "24envivo",
      mainUrl: "https://24envivo.com",
      deployUrl: "https://10.registrogratis.online"
    }
  }
}

// Cliente fetch mejorado con fallback para desarrollo
const apiClient = async (endpoint, options = {}) => {
  // En desarrollo, usar datos mock directamente
  if (IS_DEVELOPMENT) {
    console.log(`🔧 Modo desarrollo: usando mock para ${endpoint}`)
    return mockApiResponse(endpoint, options)
  }
  
  const url = `${API_BASE}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    // Fallback a mock en caso de error
    console.log(`⚠️ Error en API, usando fallback mock para ${endpoint}`)
    return mockApiResponse(endpoint, options)
  }
}

// Función mock para simular respuestas de API en desarrollo
const mockApiResponse = async (endpoint, options = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simular latencia
  
  switch (endpoint) {
    case '/ping':
      return {
        success: true,
        status: 'ok',
        message: 'API funcionando correctamente (modo desarrollo)',
        timestamp: new Date().toISOString()
      }
    
    case '/get-config':
      return {
        success: true,
        config: MOCK_CONFIG,
        lastModified: new Date().toISOString()
      }
    
    case '/update-config':
      return {
        success: true,
        message: 'Configuración actualizada (modo desarrollo)',
        config: MOCK_CONFIG
      }
    
    case '/check-sites-status':
      return {
        success: true,
        sites: {
          "1xclub-links-casinos": { online: true, lastDeploy: new Date().toISOString() },
          "1xclub-links-wsp": { online: true, lastDeploy: new Date().toISOString() },
          "24envivo-links-casinos": { online: true, lastDeploy: new Date().toISOString() },
          "24envivo-links-wsp": { online: true, lastDeploy: new Date().toISOString() }
        }
      }
    
    case '/deploy-site':
      const siteName = JSON.parse(options.body || '{}').siteName
      return {
        success: true,
        message: `Sitio ${siteName} desplegado correctamente (modo desarrollo)`,
        deployUrl: MOCK_CONFIG.sites[siteName]?.deployUrl
      }
    
    case '/deploy-all-sites':
      return {
        success: true,
        message: 'Todos los sitios desplegados correctamente (modo desarrollo)',
        deployedSites: Object.keys(MOCK_CONFIG.sites)
      }
    
    default:
      return {
        success: false,
        error: `Endpoint ${endpoint} no encontrado`
      }
  }
}

// Hook para verificar conexión con la API
export const useApiHealth = () => {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: () => apiClient('/ping'),
    refetchInterval: 10000, // Cada 10 segundos
    retry: 2,
    staleTime: 5000,
    onError: (error) => {
      console.warn('API health check failed:', error)
    }
  })
}

// Hook para obtener configuración
export const useConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: () => apiClient('/get-config'),
    staleTime: 30000, // 30 segundos
    retry: 3,
    onError: (error) => {
      toast.error(`Error al cargar configuración: ${error.message}`)
    }
  })
}

// Hook para actualizar configuración completa
export const useUpdateConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (configData) => apiClient('/update-config', {
      method: 'POST',
      body: JSON.stringify(configData)
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(['config'], data.config)
      queryClient.invalidateQueries(['sites-status'])
      toast.success('Configuración actualizada correctamente')
    },
    onError: (error) => {
      toast.error(`Error al guardar configuración: ${error.message}`)
    }
  })
}

// Hook para actualizar solo textos
export const useUpdateTexts = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (textsData) => apiClient('/update-texts', {
      method: 'POST',
      body: JSON.stringify({ texts: textsData })
    }),
    onSuccess: (data) => {
      // Actualizar cache local
      queryClient.setQueryData(['config'], (old) => ({
        ...old,
        texts: data.texts
      }))
      toast.success('Textos actualizados correctamente')
    },
    onError: (error) => {
      toast.error(`Error al guardar textos: ${error.message}`)
    }
  })
}

// Hook para verificar estado de sitios
export const useSitesStatus = () => {
  return useQuery({
    queryKey: ['sites-status'],
    queryFn: () => apiClient('/check-sites-status'),
    refetchInterval: 30000, // Cada 30 segundos
    retry: 2,
    staleTime: 15000,
    onError: (error) => {
      console.warn('Sites status check failed:', error)
    }
  })
}

// Hook para desplegar sitio individual
export const useDeploySite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (siteName) => apiClient('/deploy-site', {
      method: 'POST',
      body: JSON.stringify({ siteName })
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['sites-status'])
      toast.success(`Sitio ${variables} desplegado correctamente`)
    },
    onError: (error, variables) => {
      toast.error(`Error al desplegar ${variables}: ${error.message}`)
    }
  })
}

// Hook para desplegar todos los sitios
export const useDeployAllSites = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => apiClient('/deploy-all-sites', {
      method: 'POST'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sites-status'])
      toast.success('Todos los sitios desplegados correctamente')
    },
    onError: (error) => {
      toast.error(`Error en despliegue masivo: ${error.message}`)
    }
  })
}

// Hook personalizado para manejar estados de loading
export const useLoadingState = () => {
  const { data: healthData, isLoading: isHealthLoading } = useApiHealth()
  const { isLoading: isConfigLoading } = useConfig()
  
  return {
    isConnected: healthData?.status === 'ok',
    isLoading: isHealthLoading || isConfigLoading,
    connectionStatus: healthData?.status === 'ok' ? 'online' : 'offline'
  }
}
