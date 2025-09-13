import React, { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'

/**
 * Componente para activar/desactivar el modo localStorage
 * Esto permite que el panel funcione sin depender de las funciones de Netlify
 */
const LocalStorageToggle = () => {
  const [enabled, setEnabled] = useState(false)

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const storedValue = localStorage.getItem('admin_panel_use_local_storage')
    setEnabled(storedValue === 'true')
  }, [])

  // Actualizar localStorage cuando cambia el estado
  const toggleLocalStorage = (newValue) => {
    setEnabled(newValue)
    localStorage.setItem('admin_panel_use_local_storage', newValue)
    
    // Recargar la página para aplicar los cambios
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-md">
      <Switch
        checked={enabled}
        onChange={toggleLocalStorage}
        className={`${
          enabled ? 'bg-emerald-600' : 'bg-gray-600'
        } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none`}
      >
        <span className="sr-only">Usar almacenamiento local</span>
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-1'
          } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className="text-xs text-gray-300 font-medium">
        {enabled ? 'Modo local' : 'Modo API'}
      </span>
    </div>
  )
}

export default LocalStorageToggle
