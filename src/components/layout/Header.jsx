import React from 'react'
import { Settings } from 'lucide-react'
import ConnectionStatus from '../ui/ConnectionStatus'

const Header = () => {
  return (
    <header className="admin-header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Settings className="me-2" size={24} />
            <h1 className="mb-0">Panel de Administración Casino</h1>
          </div>
          <ConnectionStatus />
        </div>
      </div>
    </header>
  )
}

export default Header