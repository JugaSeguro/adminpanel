import React from 'react'
import { Wifi, WifiOff, Loader } from 'lucide-react'
import { useLoadingState } from '../../hooks/useApi'

const ConnectionStatus = () => {
  const { isConnected, isLoading, connectionStatus } = useLoadingState()

  const getStatusConfig = () => {
    if (isLoading) {
      return {
        icon: Loader,
        text: 'Conectando...',
        className: 'connecting'
      }
    }
    
    if (isConnected) {
      return {
        icon: Wifi,
        text: 'Conectado',
        className: 'online'
      }
    }
    
    return {
      icon: WifiOff,
      text: 'Desconectado',
      className: 'offline'
    }
  }

  const { icon: StatusIcon, text, className } = getStatusConfig()

  return (
    <div className={`connection-status ${className}`}>
      <StatusIcon 
        className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
      />
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

export default ConnectionStatus
