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
        className: 'status-connecting'
      }
    }
    
    if (isConnected) {
      return {
        icon: Wifi,
        text: 'Conectado',
        className: 'status-online'
      }
    }
    
    return {
      icon: WifiOff,
      text: 'Desconectado',
      className: 'status-offline'
    }
  }

  const { icon: StatusIcon, text, className } = getStatusConfig()

  return (
    <div className={className}>
      <StatusIcon size={16} className={isLoading ? 'animate-spin' : ''} />
      <span>{text}</span>
    </div>
  )
}

export default ConnectionStatus