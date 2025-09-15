import React, { useState, useEffect } from 'react'
import { Save, Phone, RefreshCw, Check, Users, User, Edit3 } from 'lucide-react'
import { useSupabase } from '../../hooks/useSupabase'

const LandingPhonesTab = () => {
  const { supabase } = useSupabase()
  const [landingPhones, setLandingPhones] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('1xclub-casinos')
  const [activeTab, setActiveTab] = useState('groups')
  const [editingIndividual, setEditingIndividual] = useState(null)
  const [individualData, setIndividualData] = useState({})

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

  // Actualizar configuración individual de una landing
  const updateIndividualLanding = async (landingNumber, title, whatsappLink, useIndividual) => {
    try {
      setIsUpdating(true)
      
      console.log(`🔄 Actualizando Landing ${landingNumber} individualmente...`)
      
      const { data, error } = await supabase
        .from('landing_phones')
        .update({
          individual_title: title.trim(),
          individual_whatsapp_link: whatsappLink.trim(),
          use_individual_settings: useIndividual,
          updated_at: new Date().toISOString()
        })
        .eq('landing_number', landingNumber)
        .select()
        
      if (error) {
        console.error(`❌ Error actualizando Landing ${landingNumber}:`, error)
        throw error
      }
      
      console.log(`✅ Landing ${landingNumber} actualizado individualmente:`, data)
      
      await fetchLandingPhones()
      setEditingIndividual(null)
      setIndividualData({})
      
      setSuccessMessage(`Landing ${landingNumber} actualizado exitosamente`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error actualizando landing individual:', err)
      alert('Error al actualizar landing: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Actualizar enlaces de WhatsApp por grupo
  const updateGroupPhones = async (groupKey, whatsappLink, description = '') => {
    try {
      setIsUpdating(true)
      const group = repositoryGroups[groupKey]
      
      if (!whatsappLink || whatsappLink.trim() === '') {
        alert('El enlace de WhatsApp es requerido')
        return
      }
      
      console.log(`🔄 Actualizando grupo ${group.name} con enlace: ${whatsappLink.trim()}`)
      
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
          .select()
          
        if (error) {
          console.error(`❌ Error actualizando Landing ${landingNumber}:`, error)
          throw error
        }
        
        console.log(`✅ Landing ${landingNumber} actualizado:`, data)
        return data
      })

      const results = await Promise.all(updates)
      console.log('📊 Resultados de actualización:', results)
      
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

  // Obtener todas las landings (1-10) para gestión individual
  const getAllLandings = () => {
    const allLandings = []
    for (let i = 1; i <= 10; i++) {
      const existing = landingPhones.find(p => p.landing_number === i)
      if (existing) {
        allLandings.push(existing)
      } else {
        allLandings.push({
          landing_number: i,
          individual_title: `Casino Landing ${i}`,
          individual_whatsapp_link: '',
          use_individual_settings: false,
          whatsapp_link: '',
          description: `Landing ${i}`,
          is_active: true,
          id: `temp-${i}`
        })
      }
    }
    return allLandings.sort((a, b) => a.landing_number - b.landing_number)
  }

  useEffect(() => {
    fetchLandingPhones()
  }, [])

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
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'groups'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestión por Grupos</span>
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'individual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Gestión Individual</span>
          </button>
        </div>

        {activeTab === 'groups' ? (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Gestión de Enlaces WhatsApp por Grupo de Repositorio</span>
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Configura enlaces de WhatsApp por grupo de repositorio. Cada grupo afecta automáticamente a sus landings correspondientes.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Filtrar por grupo:</label>
              <select 
                value={selectedGroup} 
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(repositoryGroups).map(([key, group]) => (
                  <option key={key} value={key}>
                    {group.name} ({group.landings.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            <div className={`p-4 rounded-lg border mb-6 ${repositoryGroups[selectedGroup].color}`}>
              <h4 className="font-medium mb-2">{repositoryGroups[selectedGroup].name}</h4>
              <p className="text-sm mb-3">{repositoryGroups[selectedGroup].description}</p>
              <p className="text-sm mb-3">Landings afectadas: {repositoryGroups[selectedGroup].landings.join(', ')}</p>
              
              <div className="space-y-3">
                <input
                  type="url"
                  placeholder="Enlace de WhatsApp (https://wa.me/...)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  id={`group-whatsapp-${selectedGroup}`}
                />
                <input
                  type="text"
                  placeholder="Descripción (opcional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-3 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
              >
                {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="truncate">{isUpdating ? 'Actualizando...' : `Actualizar ${repositoryGroups[selectedGroup].name}`}</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 mb-3">📊 Resumen del Grupo</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <span className="block text-slate-600 text-xs uppercase tracking-wide">Total de landings</span>
                  <span className="text-lg font-bold text-slate-800">{getFilteredPhones().length}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <span className="block text-slate-600 text-xs uppercase tracking-wide">Landings activas</span>
                  <span className="text-lg font-bold text-green-600">{getFilteredPhones().filter(p => p.is_active).length}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <span className="block text-slate-600 text-xs uppercase tracking-wide">Landings inactivas</span>
                  <span className="text-lg font-bold text-red-600">{getFilteredPhones().filter(p => !p.is_active).length}</span>
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
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Gestión Individual de Landings</span>
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Configura cada landing (1-10) de forma independiente con su propio título y enlace de WhatsApp.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getAllLandings().map((landing) => (
                <div key={landing.landing_number} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-800">Landing {landing.landing_number}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        landing.use_individual_settings
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {landing.use_individual_settings ? 'Individual' : 'Por Grupo'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingIndividual(landing.landing_number)
                          setIndividualData({
                            title: landing.individual_title || `Casino Landing ${landing.landing_number}`,
                            whatsappLink: landing.individual_whatsapp_link || '',
                            useIndividual: landing.use_individual_settings || false
                          })
                        }}
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingIndividual === landing.landing_number ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Título:</label>
                        <input
                          type="text"
                          value={individualData.title || ''}
                          onChange={(e) => setIndividualData({...individualData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ej: Casino Premium 1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp:</label>
                        <input
                          type="url"
                          value={individualData.whatsappLink || ''}
                          onChange={(e) => setIndividualData({...individualData, whatsappLink: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://wa.me/..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`use-individual-${landing.landing_number}`}
                          checked={individualData.useIndividual || false}
                          onChange={(e) => setIndividualData({...individualData, useIndividual: e.target.checked})}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`use-individual-${landing.landing_number}`} className="text-xs text-slate-700">
                          Usar configuración individual
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (individualData.title && individualData.whatsappLink) {
                              updateIndividualLanding(
                                landing.landing_number,
                                individualData.title,
                                individualData.whatsappLink,
                                individualData.useIndividual
                              )
                            } else {
                              alert('Por favor completa título y enlace de WhatsApp')
                            }
                          }}
                          disabled={isUpdating}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          <span>Guardar</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingIndividual(null)
                            setIndividualData({})
                          }}
                          className="px-3 py-2 bg-slate-300 text-slate-700 rounded text-xs hover:bg-slate-400"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-slate-600">Título:</span>
                        <p className="text-sm font-medium text-slate-800">
                          {landing.use_individual_settings && landing.individual_title
                            ? landing.individual_title
                            : landing.individual_title || `Casino Landing ${landing.landing_number}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-600">WhatsApp:</span>
                        <p className="text-sm text-slate-800 truncate">
                          {landing.use_individual_settings && landing.individual_whatsapp_link
                            ? landing.individual_whatsapp_link
                            : landing.whatsapp_link || 'No configurado'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-600">URL:</span>
                        <p className="text-xs text-blue-600">{landing.landing_number}.tudominio.com</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">📋 Instrucciones de Uso</h4>
        <div className="text-sm text-blue-800 space-y-3">
          {activeTab === 'groups' ? (
            <div>
              <p><strong>Gestión por Grupo:</strong> Selecciona un grupo para actualizar automáticamente todas sus landings con el mismo enlace de WhatsApp.</p>
            </div>
          ) : (
            <div>
              <p><strong>Gestión Individual:</strong> Configura cada landing (1-10) de forma independiente.</p>
              <p><strong>Detección automática:</strong> Las landings detectarán automáticamente su configuración basándose en el subdominio (1.tudominio.com, 2.tudominio.com, etc.).</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="font-semibold mb-2">🎰 Grupos Casino:</p>
              <ul className="space-y-2 text-xs">
                <li><strong>1xclub Casino:</strong> Landings 1, 5, 7<br/><span className="text-blue-600">(repo: 1xclub-links-casinos)</span></li>
                <li><strong>24envivo Casino:</strong> Landings 3, 9<br/><span className="text-blue-600">(repo: 24envivo-links-casinos)</span></li>
              </ul>
            </div>
            
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="font-semibold mb-2">💬 Grupos WhatsApp:</p>
              <ul className="space-y-2 text-xs">
                <li><strong>1xclub WhatsApp:</strong> Landings 2, 6, 8<br/><span className="text-blue-600">(repo: 1xclub-links-wsp)</span></li>
                <li><strong>24envivo WhatsApp:</strong> Landings 4, 10<br/><span className="text-blue-600">(repo: 24envivo-links-wsp)</span></li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-100 p-3 rounded-lg mt-4">
            <p className="font-semibold mb-2">🔄 Proceso:</p>
            {activeTab === 'groups' ? (
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Selecciona grupo</li>
                <li>Ingresa enlace de WhatsApp</li>
                <li>Clic en "Actualizar [Grupo]"</li>
                <li>Todas las landings del grupo se actualizan automáticamente</li>
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Clic en el ícono de edición de una landing</li>
                <li>Configura título y enlace de WhatsApp</li>
                <li>Activa "Usar configuración individual"</li>
                <li>Guarda los cambios</li>
                <li>La landing usará su configuración individual cuando se acceda por subdominio</li>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPhonesTab