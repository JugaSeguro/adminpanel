/**
 * Hook para proveer configuración desde API o localStorage según la preferencia del usuario
 */

import { useEffect, useState } from 'react'
import { useConfig, useUpdateConfig, useUpdateTexts } from './useApi'
import { useLocalConfig } from './useLocalStorage'

export const useConfigProvider = () => {
  // Determinar si se debe usar localStorage
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  
  // Cargar preferencia al inicio
  useEffect(() => {
    const storedPreference = localStorage.getItem('admin_panel_use_local_storage')
    setUseLocalStorage(storedPreference === 'true')
  }, [])
  
  // Hooks para API
  const apiConfig = useConfig()
  const apiUpdateConfig = useUpdateConfig()
  const apiUpdateTexts = useUpdateTexts()
  
  // Hook para localStorage
  const localConfig = useLocalConfig()
  
  // Retornar el proveedor adecuado según la preferencia
  if (useLocalStorage) {
    return {
      data: { config: localConfig.config, success: true },
      isLoading: false,
      isError: false,
      error: null,
      updateConfig: localConfig.updateConfig,
      updateTexts: localConfig.updateTexts,
      source: 'localStorage'
    }
  } else {
    return {
      data: apiConfig.data,
      isLoading: apiConfig.isLoading,
      isError: apiConfig.isError,
      error: apiConfig.error,
      updateConfig: (data) => apiUpdateConfig.mutate(data),
      updateTexts: (data) => apiUpdateTexts.mutate(data),
      source: 'api'
    }
  }
}

export default useConfigProvider
