import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const API_BASE = '/.netlify/functions'

// Cliente fetch mejorado con retry automático y mejor manejo de errores
const apiClient = async (endpoint, options = {}) => {
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
    throw error
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
