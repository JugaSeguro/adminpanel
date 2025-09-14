/**
 * Hook para manejar operaciones con GitHub API
 * Permite leer, actualizar y hacer commit de archivos en repositorios
 */

import { useState } from 'react'
import toast from 'react-hot-toast'

// Configuración de repositorios con tipos de estructura
const REPOSITORIES = {
  '1xclub-links-casinos': {
    owner: 'JugaSeguro',
    repo: 'casino7',
    filePath: 'src/App.jsx',
    type: 'casinos'  // Estructura compleja
  },
  '1xclub-links-wsp': {
    owner: 'JugaSeguro',
    repo: 'casino8', 
    filePath: 'src/App.jsx',
    type: 'wsp'      // Estructura simple
  },
  '24envivo-links-casinos': {
    owner: 'JugaSeguro',
    repo: 'casino9',
    filePath: 'src/App.jsx',
    type: 'casinos'  // Estructura compleja
  },
  '24envivo-links-wsp': {
    owner: 'JugaSeguro',
    repo: 'casino10',
    filePath: 'src/App.jsx',
    type: 'wsp'      // Estructura simple
  }
}

// Función para obtener el token de GitHub desde variables de entorno
const getGitHubToken = () => {
  // Siempre usar VITE_GITHUB_TOKEN (funciona en desarrollo y producción)
  return import.meta.env.VITE_GITHUB_TOKEN
}

// Cliente para GitHub API
const githubClient = async (endpoint, options = {}) => {
  const token = getGitHubToken()
  
  if (!token) {
    throw new Error('GitHub token no configurado. Por favor configura VITE_GITHUB_TOKEN en las variables de entorno.')
  }

  const url = `https://api.github.com${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Casino-Admin-Panel'
    },
    ...options
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `GitHub API Error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('GitHub API Error:', error)
    throw error
  }
}

// Función para leer un archivo de un repositorio
export const readRepositoryFile = async (siteName) => {
  const repo = REPOSITORIES[siteName]
  if (!repo) {
    throw new Error(`Repositorio no encontrado para ${siteName}`)
  }

  try {
    const fileData = await githubClient(`/repos/${repo.owner}/${repo.repo}/contents/${repo.filePath}`)
    
    // Decodificar el contenido base64 correctamente con UTF-8
    const base64Content = fileData.content.replace(/\s/g, '')
    const binaryString = atob(base64Content)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decoder = new TextDecoder('utf-8')
    const content = decoder.decode(bytes)
    
    return {
      content,
      sha: fileData.sha,
      path: fileData.path
    }
  } catch (error) {
    console.error(`Error leyendo archivo de ${siteName}:`, error)
    throw error
  }
}

// Función para actualizar un archivo en un repositorio con reintentos automáticos
export const updateRepositoryFile = async (siteName, newContent, commitMessage, maxRetries = 3) => {
  const repo = REPOSITORIES[siteName]
  if (!repo) {
    throw new Error(`Repositorio no encontrado para ${siteName}`)
  }

  let lastError = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Leer el archivo actual para obtener el SHA más reciente
      const fileData = await readRepositoryFile(siteName)
      
      // Codificar el contenido correctamente en UTF-8 y luego Base64
      const encoder = new TextEncoder()
      const utf8Bytes = encoder.encode(newContent)
      const encodedContent = btoa(String.fromCharCode(...utf8Bytes))
      
      console.log(`🔄 Intento ${attempt}/${maxRetries} actualizando ${siteName} con SHA: ${fileData.sha.substring(0, 8)}...`)
      
      // Actualizar el archivo
      const updateData = await githubClient(`/repos/${repo.owner}/${repo.repo}/contents/${repo.filePath}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent,
          sha: fileData.sha
        })
      })
      
      console.log(`✅ Archivo actualizado exitosamente en ${siteName}`)
      return updateData
      
    } catch (error) {
      lastError = error
      console.warn(`⚠️ Intento ${attempt} falló para ${siteName}:`, error.message)
      
      // Si es un error de SHA mismatch y no es el último intento, esperar un poco y reintentar
      if (error.message.includes('does not match') && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000) // Backoff exponencial
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        break // No reintentar para otros tipos de errores
      }
    }
  }
  
  console.error(`❌ Error actualizando archivo de ${siteName} después de ${maxRetries} intentos:`, lastError)
  throw lastError
}

// Función para actualizar SOLO links de WhatsApp en un archivo
export const updateWhatsAppLink = async (siteName, newWhatsAppUrl) => {
  try {
    // Leer el archivo actual
    const fileData = await readRepositoryFile(siteName)
    let content = fileData.content
    
    console.log(`📁 Actualizando WhatsApp en ${siteName}`)
    
    // Obtener tipo de estructura del repositorio
    const repoInfo = REPOSITORIES[siteName]
    const structureType = repoInfo?.type || 'wsp'
    
    // Patrón para encontrar links de WhatsApp
    const whatsappPattern = /https:\/\/wa\.link\/[^"'\s]+/g
    
    // DEBUG: Mostrar coincidencias encontradas
    const matches = content.match(whatsappPattern)
    console.log(`🎯 Links de WhatsApp encontrados en ${siteName}:`, matches ? matches.length : 0)
    if (matches) {
      console.log(`📋 Links actuales:`, matches.slice(0, 3))
    }
    
    // Reemplazar TODOS los links de WhatsApp encontrados
    const newContent = content.replace(whatsappPattern, newWhatsAppUrl)
    
    if (!newContent || newContent === content) {
      throw new Error(`No se encontraron links de WhatsApp para actualizar en ${siteName}`)
    }
    
    // Actualizar el archivo
    const commitMessage = `Actualizar link de WhatsApp en ${siteName}: ${newWhatsAppUrl}`
    await updateRepositoryFile(siteName, newContent, commitMessage)
    
    return {
      success: true,
      message: `WhatsApp actualizado correctamente en ${siteName}`,
      siteName,
      newWhatsAppUrl,
      matchesCount: matches ? matches.length : 0
    }
    
  } catch (error) {
    console.error(`Error actualizando WhatsApp en ${siteName}:`, error)
    throw error
  }
}

// Hook simplificado para actualizar SOLO links de WhatsApp
export const useGitHubApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateAllWhatsAppLinks = async (newWhatsAppUrl) => {
    setIsLoading(true)
    setError(null)
    
    const results = []
    const errors = []
    const siteNames = Object.keys(REPOSITORIES)
    
    console.log(`🚀 Iniciando actualización de WhatsApp en ${siteNames.length} sitios...`)
    console.log(`🔗 Nuevo link: ${newWhatsAppUrl}`)
    
    // Procesar sitios de manera secuencial para evitar conflictos de concurrencia
    for (let i = 0; i < siteNames.length; i++) {
      const siteName = siteNames[i]
      console.log(`📝 Procesando sitio ${i + 1}/${siteNames.length}: ${siteName}`)
      
      try {
        const result = await updateWhatsAppLink(siteName, newWhatsAppUrl)
        results.push(result)
        console.log(`✅ ${siteName}: ${result.matchesCount} links actualizados`)
      } catch (err) {
        const errorInfo = { siteName, error: err.message }
        errors.push(errorInfo)
        console.error(`❌ ${siteName}: ${err.message}`)
        
        // Mostrar toast individual para cada error
        toast.error(`${siteName}: ${err.message}`, { duration: 4000 })
      }
      
      // Pequeña pausa entre sitios para reducir la carga en GitHub API
      if (i < siteNames.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    setIsLoading(false)
    
    // Resumen final
    const successCount = results.length
    const errorCount = errors.length
    const totalLinksUpdated = results.reduce((sum, result) => sum + result.matchesCount, 0)
    
    if (errorCount > 0) {
      const errorMessage = `Completado con errores: ${successCount} exitosos, ${errorCount} fallidos`
      setError(errorMessage)
      
      if (successCount > 0) {
        toast.success(`${successCount} sitios actualizados (${totalLinksUpdated} links)`, { duration: 3000 })
      }
    } else {
      toast.success(`🎉 Actualizado correctamente: ${totalLinksUpdated} links en ${successCount} sitios`)
    }
    
    console.log(`📊 Resumen: ${successCount} sitios exitosos, ${errorCount} errores, ${totalLinksUpdated} links actualizados`)
    return { results, errors, totalLinksUpdated }
  }

  return {
    updateAllWhatsAppLinks,
    isLoading,
    error,
    repositories: Object.keys(REPOSITORIES)
  }
}

export default useGitHubApi
