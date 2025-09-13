import React, { useState, useEffect } from 'react'
import { Save, Type } from 'lucide-react'
import { useConfig, useUpdateTexts } from '../../hooks/useApi'
import useAppStore from '../../store/useStore'
import Button from '../ui/Button'
import { FormSkeleton } from '../ui/SkeletonLoader'

const TextsTab = () => {
  const { data: config, isLoading } = useConfig()
  const updateTexts = useUpdateTexts()
  const { setLoading, getFallbackConfig } = useAppStore()
  
  const [formData, setFormData] = useState({
    mainTitle: '',
    subtitle: '',
    description: '',
    bonusButton: '',
    registerButton: '',
    accessButton: '',
    chatButton: '',
    telegramText: ''
  })

  // Cargar datos del formulario cuando se obtiene la config
  useEffect(() => {
    if (config?.texts) {
      setFormData({
        mainTitle: config.texts.mainTitle || '',
        subtitle: config.texts.subtitle || '',
        description: config.texts.description || '',
        bonusButton: config.texts.buttons?.bonus || '',
        registerButton: config.texts.buttons?.register || '',
        accessButton: config.texts.buttons?.access || '',
        chatButton: config.texts.buttons?.chat || '',
        telegramText: config.texts.telegram || ''
      })
    } else {
      // Usar configuración fallback
      const fallback = getFallbackConfig()
      setFormData({
        mainTitle: fallback.texts.mainTitle,
        subtitle: fallback.texts.subtitle,
        description: fallback.texts.description,
        bonusButton: fallback.texts.buttons.bonus,
        registerButton: fallback.texts.buttons.register,
        accessButton: fallback.texts.buttons.access,
        chatButton: fallback.texts.buttons.chat,
        telegramText: fallback.texts.telegram
      })
    }
  }, [config, getFallbackConfig])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveTexts = async () => {
    try {
      setLoading(true, 'Guardando textos...')
      
      const textsData = {
        mainTitle: formData.mainTitle,
        subtitle: formData.subtitle,
        description: formData.description,
        buttons: {
          bonus: formData.bonusButton,
          register: formData.registerButton,
          access: formData.accessButton,
          chat: formData.chatButton
        },
        telegram: formData.telegramText
      }

      await updateTexts.mutateAsync(textsData)
      
    } catch (error) {
      console.error('Error saving texts:', error)
    } finally {
      setLoading(false)
    }
  }

  const textFields = [
    {
      id: 'mainTitle',
      label: 'Título Principal',
      type: 'text',
      placeholder: 'Registrate gratis y pedi 2000 fichas para probar',
      description: 'Título principal que aparece en todos los sitios'
    },
    {
      id: 'subtitle',
      label: 'Subtítulo',
      type: 'text',
      placeholder: 'Crea tu cuenta rápido y seguro ✨',
      description: 'Subtítulo que aparece debajo del título principal'
    },
    {
      id: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Regístrate totalmente gratis en la plataforma más segura de Argentina...',
      description: 'Descripción detallada de la promoción',
      rows: 3
    },
    {
      id: 'bonusButton',
      label: 'Texto Botón Bonus',
      type: 'text',
      placeholder: '🔥 ¡OBTENÉ TU MEGABONUS CON TU PRIMER RECARGA 🔥',
      description: 'Texto del botón principal de bonus'
    },
    {
      id: 'registerButton',
      label: 'Texto Botón Registro',
      type: 'text',
      placeholder: '¡REGISTRATE AHORA!',
      description: 'Texto del botón de registro'
    },
    {
      id: 'accessButton',
      label: 'Texto Botón Acceso',
      type: 'text',
      placeholder: '🎯 ACCEDER A {BRAND} 🎯',
      description: 'Usa {BRAND} para sustituir automáticamente por el nombre de la marca'
    },
    {
      id: 'chatButton',
      label: 'Texto Botón Chat',
      type: 'text',
      placeholder: 'Chatear con nosotros',
      description: 'Texto del botón de WhatsApp/chat'
    },
    {
      id: 'telegramText',
      label: 'Texto Telegram',
      type: 'text',
      placeholder: '📱 SEGUINOS EN TELEGRAM Y GANÁ PREMIOS DIARIOS 📱',
      description: 'Texto promocional para Telegram'
    }
  ]

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Configuración de Textos y Botones
          </h2>
        </div>
      </div>

      {/* Formulario de textos */}
      <div className="config-card p-4 md:p-6">
        <div className="space-y-4 md:space-y-6">
          {textFields.map((field) => (
            <div key={field.id} className="form-group">
              <label htmlFor={field.id} className="text-xs md:text-sm font-medium text-gray-700">
                {field.label}:
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={formData[field.id]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              )}
              
              {field.description && (
                <small className="text-gray-500 text-xs md:text-sm">
                  {field.description}
                </small>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview de variables */}
      <div className="config-card p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
          Variables Disponibles
        </h3>
        <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
            <div>
              <strong className="text-gray-700">{'{BRAND}'}</strong>
              <p className="text-gray-600">Se reemplaza por:</p>
              <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                <li>1XCLUB.BET (para sitios 1xclub)</li>
                <li>24ENVIVO.COM (para sitios 24envivo)</li>
              </ul>
            </div>
            <div>
              <strong className="text-gray-700">Emojis recomendados:</strong>
              <p className="text-gray-600 break-all">
                🔥 💰 🎰 🎯 ⚡ 💎 🏆 🚀 📱 ✨ 💸 🎊
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          onClick={handleSaveTexts}
          isLoading={updateTexts.isLoading}
          loadingText="Guardando..."
          icon={<Save className="w-4 h-4" />}
          className="text-sm md:text-base"
        >
          <span className="hidden sm:inline">Guardar Textos</span>
          <span className="sm:hidden">Guardar</span>
        </Button>
      </div>
    </div>
  )
}

export default TextsTab
