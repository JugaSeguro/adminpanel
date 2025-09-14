import React, { useState, useEffect } from 'react'
import { Save, Phone, RefreshCw, Check } from 'lucide-react'
import { useSupabase } from '../../hooks/useSupabase'

const LandingPhonesTab = () => {
  const { supabase } = useSupabase()
  const [landingPhones, setLandingPhones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // Eliminadas variables de edición individual ya que solo se usa gestión por grupos
  const [isUpdating, setIsUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('1xclub-casinos')

  // Definir grupos de repositorios
  const repositoryGroups = {
    '1xclub-casinos': {
      name: '1xclub Casino',
      landings: [1, 5, 7],
      description: 'Landings de casino para 1xclub',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    '1xclub-wsp': {
      name: '1xclub WhatsApp',
      landings: [2, 6, 8],
      description: 'Landings de WhatsApp para 1xclub',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    '24envivo-casinos': {
      name: '24envivo Casino',
      landings: [3, 9],
      description: 'Landings de casino para 24envivo',
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    },
    '24envivo-wsp': {
      name: '24envivo WhatsApp',
      landings: [4, 10],
      description: 'Landings de WhatsApp para 24envivo',
      color: 'bg-orange-50 border-orange-200 text-orange-800'
    }
  }

  // Cargar números de teléfono por landing
  const fetchLandingPhones = async () => {
    try {
      setIsLoading(true)
      console.log('📥 Cargando números de landing...')
      
      const { data, error } = await supabase
        .from('landing_phones')
        .select('*')
        .order('landing_number', { ascending: true })

      if (error) {
        console.error('❌ Error cargando datos:', error)
        throw error
      }

      console.log(`✅ Cargados ${data?.length || 0} registros:`, data)
      setLandingPhones(data || [])
    } catch (err) {
      console.error('Error cargando números de landing:', err)
      alert('Error al cargar números: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar números por grupo seleccionado
  const getFilteredPhones = () => {
    const group = repositoryGroups[selectedGroup]
    return landingPhones.filter(phone => group.landings.includes(phone.landing_number))
  }

  // Actualizar enlaces de WhatsApp por grupo
  const updateGroupPhones = async (groupKey, whatsappLink, description = '') => {
    try {
      setIsUpdating(true)
      const group = repositoryGroups[groupKey]
      
      // Validar enlace de WhatsApp
      if (!whatsappLink || whatsappLink.trim() === '') {
        alert('El enlace de WhatsApp es requerido')
        return
      }
      
      console.log(`🔄 Actualizando grupo ${group.name} con enlace: ${whatsappLink.trim()}`)
      
      // Actualizar todos los enlaces del grupo
      const updates = group.landings.map(async (landingNumber) => {
        const autoDescription = description || `${group.name} - Landing ${landingNumber}`
        
        console.log(`📝 Actualizando Landing ${landingNumber}...`)
        
        const { data, error } = await supabase
          .from('landing_phones')
          .update({
            whatsapp_link: whatsappLink.trim(),
            description: autoDescription,
            updated_at: new Date().toISOString()
          })
          .eq('landing_number', landingNumber)
          .select() // Importante: agregar .select() para obtener los datos actualizados
          
        if (error) {
          console.error(`❌ Error actualizando Landing ${landingNumber}:`, error)
          throw error
        }
        
        console.log(`✅ Landing ${landingNumber} actualizado:`, data)
        return data
      })

      const results = await Promise.all(updates)
      console.log('📊 Resultados de actualización:', results)
      
      // Verificar que las actualizaciones se guardaron
      const updatedCount = results.filter(result => result && result.length > 0).length
      
      if (updatedCount === 0) {
        throw new Error('Las actualizaciones no se guardaron. Posible problema de permisos RLS en Supabase.')
      }
      
      await fetchLandingPhones()
      
      setSuccessMessage(`Grupo ${group.name} actualizado exitosamente (${updatedCount}/${group.landings.length} landings)`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error actualizando grupo:', err)
      
      let errorMessage = 'Error al actualizar grupo: ' + err.message
      
      // Detectar problemas comunes
      if (err.message.includes('RLS') || err.message.includes('policy') || err.message.includes('permission')) {
        errorMessage += '\n\n🔒 Problema de permisos detectado. Soluciones:\n'
        errorMessage += '1. Ejecuta el script fix-supabase-rls.sql en Supabase\n'
        errorMessage += '2. O deshabilita RLS temporalmente: ALTER TABLE landing_phones DISABLE ROW LEVEL SECURITY;'
      }
      
      alert(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchLandingPhones()
  }, [])

  // Funciones de edición individual eliminadas - solo se usa gestión por grupos

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-600">Cargando números de teléfono...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Título y descripción */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center space-x-2">
          <Phone className="w-5 h-5" />
          <span>Gestión de Enlaces WhatsApp por Grupo de Repositorio</span>
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          Configura enlaces de WhatsApp por grupo de repositorio. Cada grupo afecta automáticamente a sus landings correspondientes.
        </p>

        {/* Selector de grupo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Filtrar por grupo:</label>
          <select 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(repositoryGroups).map(([key, group]) => (
              <option key={key} value={key}>{group.name} ({group.landings.join(', ')})</option>
            ))}
          </select>
        </div>

        {/* Gestión por grupos */}
        <div className={`p-4 rounded-lg border mb-6 ${repositoryGroups[selectedGroup].color}`}>
            <h4 className="font-medium mb-2">{repositoryGroups[selectedGroup].name}</h4>
            <p className="text-sm mb-3">{repositoryGroups[selectedGroup].description}</p>
            <p className="text-sm mb-3">Landings afectadas: {repositoryGroups[selectedGroup].landings.join(', ')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="url"
                placeholder="Enlace de WhatsApp (https://wa.me/...)"
                className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                id={`group-whatsapp-${selectedGroup}`}
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                className="px-3 py-2 border border-slate-300 rounded text-sm bg-white"
                id={`group-description-${selectedGroup}`}
              />
            </div>
            
            <button
              onClick={() => {
                const whatsappInput = document.getElementById(`group-whatsapp-${selectedGroup}`)
                const descriptionInput = document.getElementById(`group-description-${selectedGroup}`)
                
                if (whatsappInput.value.trim()) {
                  updateGroupPhones(
                    selectedGroup, 
                    whatsappInput.value.trim(),
                    descriptionInput.value.trim()
                  )
                  whatsappInput.value = ''
                  descriptionInput.value = ''
                } else {
                  alert('Por favor ingresa un enlace de WhatsApp')
                }
              }}
              disabled={isUpdating}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center space-x-2"
            >
              {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isUpdating ? 'Actualizando...' : `Actualizar ${repositoryGroups[selectedGroup].name}`}</span>
            </button>
        </div>

        {/* Resumen de números del grupo */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-800 mb-2">📊 Resumen del Grupo</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Total de landings:</span>
              <span className="ml-2 font-medium text-slate-800">{getFilteredPhones().length}</span>
            </div>
            <div>
              <span className="text-slate-600">Landings activas:</span>
              <span className="ml-2 font-medium text-green-600">{getFilteredPhones().filter(p => p.is_active).length}</span>
            </div>
            <div>
              <span className="text-slate-600">Landings inactivas:</span>
              <span className="ml-2 font-medium text-red-600">{getFilteredPhones().filter(p => !p.is_active).length}</span>
            </div>
          </div>
          
          {getFilteredPhones().length > 0 && (
            <div className="mt-3">
              <span className="text-slate-600 text-sm">Números de landing en este grupo:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {getFilteredPhones().map((phone) => (
                  <span 
                    key={phone.id} 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      phone.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Landing {phone.landing_number}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {getFilteredPhones().length === 0 && (
            <div className="text-center py-4 text-slate-500">
              <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay enlaces para {repositoryGroups[selectedGroup]?.name}</p>
              <p className="text-xs">Ejecuta el script SQL para crear la tabla y datos iniciales</p>
            </div>
          )}
        </div>
      </div>

      {/* Diagnóstico de problemas */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">🔧 Diagnóstico de Problemas</h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <p><strong>Si los cambios no se guardan:</strong></p>
          <ol className="list-decimal list-inside ml-2 space-y-1">
            <li>Abre la consola del navegador (F12) para ver logs detallados</li>
            <li>Ve a Supabase Dashboard → SQL Editor</li>
            <li>Ejecuta: <code className="bg-yellow-100 px-1 rounded">SELECT * FROM pg_policies WHERE tablename = 'landing_phones';</code></li>
            <li>Si hay políticas RLS, ejecuta: <code className="bg-yellow-100 px-1 rounded">ALTER TABLE public.landing_phones DISABLE ROW LEVEL SECURITY;</code></li>
          </ol>
          <p className="mt-2"><strong>Archivo de ayuda:</strong> <code className="bg-yellow-100 px-1 rounded">fix-supabase-rls.sql</code> contiene todos los comandos necesarios.</p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📋 Instrucciones de Uso por Grupos</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Gestión por Grupo:</strong> Selecciona un grupo para actualizar automáticamente todas sus landings con el mismo enlace de WhatsApp.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p><strong>🎰 Grupos Casino:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li><strong>1xclub Casino:</strong> Landings 1, 5, 7 (repo: 1xclub-links-casinos)</li>
                <li><strong>24envivo Casino:</strong> Landings 3, 9 (repo: 24envivo-links-casinos)</li>
              </ul>
            </div>
            
            <div>
              <p><strong>💬 Grupos WhatsApp:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li><strong>1xclub WhatsApp:</strong> Landings 2, 6, 8 (repo: 1xclub-links-wsp)</li>
                <li><strong>24envivo WhatsApp:</strong> Landings 4, 10 (repo: 24envivo-links-wsp)</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-3"><strong>Proceso:</strong> 1) Selecciona grupo → 2) Ingresa enlace de WhatsApp → 3) Clic en "Actualizar [Grupo]" → 4) Todas las landings del grupo se actualizan automáticamente</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPhonesTab