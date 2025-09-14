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
    
    // Decodificar el contenido base64
    const content = atob(fileData.content)
    
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

// Función para actualizar un archivo en un repositorio
export const updateRepositoryFile = async (siteName, newContent, commitMessage) => {
  const repo = REPOSITORIES[siteName]
  if (!repo) {
    throw new Error(`Repositorio no encontrado para ${siteName}`)
  }

  try {
    // Primero leer el archivo para obtener el SHA
    const fileData = await readRepositoryFile(siteName)
    
    // Codificar el contenido en base64
    const encodedContent = btoa(newContent)
    
    // Actualizar el archivo
    const updateData = await githubClient(`/repos/${repo.owner}/${repo.repo}/contents/${repo.filePath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: commitMessage,
        content: encodedContent,
        sha: fileData.sha
      })
    })
    
    return updateData
  } catch (error) {
    console.error(`Error actualizando archivo de ${siteName}:`, error)
    throw error
  }
}

// Función para actualizar texto específico en un archivo
export   const updateTextInFile = async (siteName, textType, newText) => {
  try {
    // Leer el archivo actual
    const fileData = await readRepositoryFile(siteName)
    let content = fileData.content
    
    // DEBUG: Mostrar contenido del archivo para diagnóstico
    console.log(`📁 Contenido de ${siteName} (primeras 500 caracteres):`)
    console.log(content.substring(0, 500))
    console.log('--- FIN PREVIEW ---')
    
    // Obtener tipo de estructura del repositorio
    const repoInfo = REPOSITORIES[siteName]
    const structureType = repoInfo?.type || 'wsp'
    
    // Patrones según el tipo de estructura
    const patterns = {
      mainTitle: {
        'casinos': /{currentConfig\.texts\?\.mainTitle \|\| ".*?"}/g,  // Estructura compleja con configuración dinámica
        'wsp': /<h1[^>]*>.*?<\/h1>/g  // Estructura simple con HTML directo
      },
      subtitle: {
        'casinos': /{currentConfig\.texts\?\.subtitle \|\| ".*?"}/g,   // Estructura compleja
        'wsp': /<p[^>]*>Crea tu cuenta rápido y seguro ✨<\/p>/g  // Estructura simple
      },
      whatsappUrl: {
        'casinos': /https:\/\/wa\.link\/[^"'\s]+/g,  // Ambos tipos usan el mismo patrón
        'wsp': /https:\/\/wa\.link\/[^"'\s]+/g
      },
      telegramUrl: {
        'casinos': /https:\/\/t\.me\/[^"'\s]+/g,  // Ambos tipos usan el mismo patrón
        'wsp': /https:\/\/t\.me\/[^"'\s]+/g
      }
    }
    
    const pattern = patterns[textType]?.[structureType]
    if (!pattern) {
      throw new Error(`Tipo de texto no soportado: ${textType} para estructura ${structureType}`)
    }
    
    // DEBUG: Mostrar patrón que se va a usar
    console.log(`🔍 Buscando patrón para ${textType} en estructura ${structureType}:`, pattern)
    
    // DEBUG: Probar si el patrón encuentra algo
    const matches = content.match(pattern)
    console.log(`🎯 Coincidencias encontradas:`, matches ? matches.length : 0)
    if (matches) {
      console.log(`📋 Primeras coincidencias:`, matches.slice(0, 3))
    }
    
    // Realizar el reemplazo
    let newContent
    if (textType === 'mainTitle') {
      if (siteName === '24envivo-links-casinos') {
        newContent = content.replace(pattern, `{currentConfig.texts?.mainTitle || "${newText}"}`)
      } else {
        newContent = content.replace(pattern, `<h1>${newText}</h1>`)
      }
    } else if (textType === 'subtitle') {
      if (siteName === '24envivo-links-casinos') {
        newContent = content.replace(pattern, `{currentConfig.texts?.subtitle || "${newText}"}`)
      } else {
        newContent = content.replace(pattern, `<p>${newText}</p>`)
      }
    } else if (textType === 'whatsappUrl') {
      newContent = content.replace(pattern, newText)
    } else if (textType === 'telegramUrl') {
      newContent = content.replace(pattern, newText)
    }
    
    if (!newContent || newContent === content) {
      throw new Error(`No se encontró el patrón para actualizar ${textType} en ${siteName}`)
    }
    
    // Actualizar el archivo
    const commitMessage = `Actualizar ${textType} en ${siteName}: ${newText.substring(0, 50)}...`
    await updateRepositoryFile(siteName, newContent, commitMessage)
    
    return {
      success: true,
      message: `${textType} actualizado correctamente en ${siteName}`,
      siteName,
      textType,
      newText
    }
    
  } catch (error) {
    console.error(`Error actualizando ${textType} en ${siteName}:`, error)
    throw error
  }
}

// Hook para usar las funciones de GitHub
export const useGitHubApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateText = async (siteName, textType, newText) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await updateTextInFile(siteName, textType, newText)
      toast.success(result.message)
      return result
    } catch (err) {
      const errorMessage = `Error actualizando ${textType} en ${siteName}: ${err.message}`
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateAllSites = async (textType, newText) => {
    setIsLoading(true)
    setError(null)
    
    const results = []
    const errors = []
    
    for (const siteName of Object.keys(REPOSITORIES)) {
      try {
        const result = await updateTextInFile(siteName, textType, newText)
        results.push(result)
      } catch (err) {
        errors.push({ siteName, error: err.message })
      }
    }
    
    setIsLoading(false)
    
    if (errors.length > 0) {
      const errorMessage = `Errores en ${errors.length} sitios: ${errors.map(e => e.siteName).join(', ')}`
      setError(errorMessage)
      toast.error(errorMessage)
    } else {
      toast.success(`Actualizado correctamente en todos los sitios`)
    }
    
    return { results, errors }
  }

  return {
    updateText,
    updateAllSites,
    isLoading,
    error,
    repositories: Object.keys(REPOSITORIES)
  }
}

export default useGitHubApi
