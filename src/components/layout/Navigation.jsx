import React from 'react'
import { Link, Edit, Globe, Rocket } from 'lucide-react'
import useAppStore from '../../store/useStore'

const Navigation = () => {
  const { activeTab, setActiveTab } = useAppStore()

  const tabs = [
    {
      id: 'config',
      label: 'URLs y Enlaces',
      icon: Link,
      description: 'Configurar enlaces globales'
    },
    {
      id: 'texts',
      label: 'Textos y Botones',
      icon: Edit,
      description: 'Personalizar contenido'
    },
    {
      id: 'sites',
      label: 'Estado de Sitios',
      icon: Globe,
      description: 'Monitorear sitios'
    },
    {
      id: 'deploy',
      label: 'Despliegue',
      icon: Rocket,
      description: 'Gestionar deploys'
    }
  ]

  return (
    <nav className="admin-nav">
      {tabs.map(({ id, label, icon: Icon, description }) => (
        <button
          key={id}
          className={`nav-btn ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          title={description}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default Navigation
