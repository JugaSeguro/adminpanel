import React from 'react'
import { Settings } from 'lucide-react'
import ConnectionStatus from '../ui/ConnectionStatus'

const Header = () => {
  return (
    <header className="admin-header">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">
          Panel de Administración Casino
        </h1>
      </div>
      <ConnectionStatus />
    </header>
  )
}

export default Header
