import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://slrzlggigpiinswjfvxr.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c'

// Cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [links, setLinks] = useState([])
  const [globalLinks, setGlobalLinks] = useState(null)

  // Obtener enlaces globales
  const getGlobalLinks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('global_link')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
      
      setGlobalLinks(data)
      return data
    } catch (err) {
      console.error('Error obteniendo enlaces globales:', err)
      setError(err.message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Mantener compatibilidad con código existente
  const getLinks = async () => {
    const globalData = await getGlobalLinks()
    if (globalData) {
      // Convertir formato global a formato legacy para compatibilidad
      const legacyFormat = [
        {
          id: globalData.id + '_whatsapp',
          site_name: 'global',
          link_type: 'whatsapp',
          wa_link: globalData.whatsapp_link,
          created_at: globalData.created_at,
          updated_at: globalData.updated_at
        },
        {
          id: globalData.id + '_telegram',
          site_name: 'global',
          link_type: 'telegram',
          wa_link: globalData.telegram_link,
          created_at: globalData.created_at,
          updated_at: globalData.updated_at
        },
        {
          id: globalData.id + '_website',
          site_name: 'global',
          link_type: 'website',
          wa_link: globalData.website_link,
          created_at: globalData.created_at,
          updated_at: globalData.updated_at
        }
      ]
      setLinks(legacyFormat)
      return legacyFormat
    }
    setLinks([])
    return []
  }

  // Actualizar enlaces globales
  const upsertGlobalLinks = async (linksData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('global_link')
        .upsert({
          id: globalLinks?.id || undefined,
          whatsapp_link: linksData.whatsapp_link,
          telegram_link: linksData.telegram_link,
          website_link: linksData.website_link,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      
      setGlobalLinks(data)
      await getLinks() // Actualizar formato legacy
      
      return data
    } catch (err) {
      console.error('Error guardando enlaces globales:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mantener compatibilidad con código existente
  const upsertLink = async (linkData) => {
    // Convertir formato legacy a formato global
    const currentGlobal = globalLinks || {
      whatsapp_link: '',
      telegram_link: '',
      website_link: ''
    }
    
    const updatedGlobal = { ...currentGlobal }
    
    if (linkData.linkType === 'whatsapp') {
      updatedGlobal.whatsapp_link = linkData.waLink
    } else if (linkData.linkType === 'telegram') {
      updatedGlobal.telegram_link = linkData.waLink
    } else if (linkData.linkType === 'website') {
      updatedGlobal.website_link = linkData.waLink
    }
    
    return await upsertGlobalLinks(updatedGlobal)
  }

  // Eliminar enlaces globales
  const deleteGlobalLinks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!globalLinks?.id) {
        throw new Error('No hay enlaces globales para eliminar')
      }
      
      const { error } = await supabase
        .from('global_link')
        .delete()
        .eq('id', globalLinks.id)
      
      if (error) throw error
      
      setGlobalLinks(null)
      setLinks([])
      
    } catch (err) {
      console.error('Error eliminando enlaces globales:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Mantener compatibilidad con código existente
  const deleteLink = async (id) => {
    // Para compatibilidad, eliminar todos los enlaces globales
    return await deleteGlobalLinks()
  }

  // Obtener enlace específico por tipo
  const getLinkByType = async (linkType) => {
    try {
      const globalData = await getGlobalLinks()
      if (!globalData) return null
      
      switch (linkType) {
        case 'whatsapp':
          return {
            id: globalData.id + '_whatsapp',
            site_name: 'global',
            link_type: 'whatsapp',
            wa_link: globalData.whatsapp_link,
            created_at: globalData.created_at,
            updated_at: globalData.updated_at
          }
        case 'telegram':
          return {
            id: globalData.id + '_telegram',
            site_name: 'global',
            link_type: 'telegram',
            wa_link: globalData.telegram_link,
            created_at: globalData.created_at,
            updated_at: globalData.updated_at
          }
        case 'website':
          return {
            id: globalData.id + '_website',
            site_name: 'global',
            link_type: 'website',
            wa_link: globalData.website_link,
            created_at: globalData.created_at,
            updated_at: globalData.updated_at
          }
        default:
          return null
      }
    } catch (err) {
      console.error('Error obteniendo enlace específico:', err)
      return null
    }
  }

  // Mantener compatibilidad con código existente
  const getLinkBySite = async (siteName, linkType) => {
    return await getLinkByType(linkType)
  }

  // Actualizar múltiples enlaces de una vez
  const updateMultipleLinks = async (linksData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Convertir array de enlaces legacy a formato global
      const globalData = {
        whatsapp_link: '',
        telegram_link: '',
        website_link: ''
      }
      
      linksData.forEach(linkData => {
        if (linkData.linkType === 'whatsapp') {
          globalData.whatsapp_link = linkData.waLink
        } else if (linkData.linkType === 'telegram') {
          globalData.telegram_link = linkData.waLink
        } else if (linkData.linkType === 'website') {
          globalData.website_link = linkData.waLink
        }
      })
      
      return await upsertGlobalLinks(globalData)
    } catch (err) {
      console.error('Error actualizando múltiples enlaces:', err)
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar enlaces al montar el componente
  useEffect(() => {
    getGlobalLinks()
  }, [])

  return {
    // Estado
    isLoading,
    error,
    links, // Formato legacy para compatibilidad
    globalLinks, // Nuevo formato global
    
    // Métodos nuevos
    getGlobalLinks,
    upsertGlobalLinks,
    deleteGlobalLinks,
    getLinkByType,
    
    // Métodos legacy para compatibilidad
    getLinks,
    upsertLink,
    deleteLink,
    getLinkBySite,
    updateMultipleLinks,
    
    // Cliente directo para operaciones avanzadas
    supabase
  }
}

export default useSupabase