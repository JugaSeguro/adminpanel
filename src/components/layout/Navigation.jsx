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
      <div className="container-fluid">
        <ul className="nav nav-tabs border-0">
          {tabs.map(({ id, label, icon: Icon, description }) => (
            <li className="nav-item" key={id}>
              <button
                className={`nav-link ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
                title={description}
              >
                <Icon size={16} className="me-2" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation