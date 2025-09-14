/**
 * Hook para manejar operaciones con GitHub API
 * Permite leer, actualizar y hacer commit de archivos en repositorios
 */

import { useState } from 'react'
import toast from 'react-hot-toast'

// Configuración de repositorios
const REPOSITORIES = {
  '1xclub-links-casinos': {
    owner: 'JugaSeguro', // Cambia por tu usuario de GitHub
    repo: '1xclub-links-casinos',
    filePath: 'src/App.jsx'
  },
  '1xclub-links-wsp': {
    owner: 'JugaSeguro',
    repo: '1xclub-links-wsp', 
    filePath: 'src/App.jsx'
  },
  '24envivo-links-casinos': {
    owner: 'JugaSeguro',
    repo: '24envivo-links-casinos',
    filePath: 'src/App.jsx'
  },
  '24envivo-links-wsp': {
    owner: 'JugaSeguro',
    repo: '24envivo-links-wsp',
    filePath: 'src/App.jsx'
  }
}

// Función para obtener el token de GitHub desde variables de entorno
const getGitHubToken = () => {
  // En desarrollo, usar variable de entorno
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_GITHUB_TOKEN
  }
  // En producción, usar variable de Netlify
  return import.meta.env.GITHUB_TOKEN
}

// Cliente para GitHub API
const githubClient = async (endpoint, options = {}) => {
  const token = getGitHubToken()
  
  if (!token) {
    throw new Error('GitHub token no configurado. Por favor configura GITHUB_TOKEN en las variables de entorno.')
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
export const updateTextInFile = async (siteName, textType, newText) => {
  try {
    // Leer el archivo actual
    const fileData = await readRepositoryFile(siteName)
    let content = fileData.content
    
    // Patrones de búsqueda y reemplazo según el tipo de texto
    const patterns = {
      mainTitle: {
        '1xclub-links-casinos': /<h1[^>]*>.*?<\/h1>/g,
        '1xclub-links-wsp': /<h1[^>]*>.*?<\/h1>/g,
        '24envivo-links-casinos': /{currentConfig\.texts\?\.mainTitle \|\| ".*?"}/g,
        '24envivo-links-wsp': /<h1[^>]*>.*?<\/h1>/g
      },
      subtitle: {
        '1xclub-links-casinos': /<p[^>]*>Crea tu cuenta rápido y seguro ✨<\/p>/g,
        '1xclub-links-wsp': /<p[^>]*>Crea tu cuenta rápido y seguro ✨<\/p>/g,
        '24envivo-links-casinos': /{currentConfig\.texts\?\.subtitle \|\| ".*?"}/g,
        '24envivo-links-wsp': /<p[^>]*>Crea tu cuenta rápido y seguro ✨<\/p>/g
      },
      whatsappUrl: {
        '1xclub-links-casinos': /https:\/\/wa\.link\/[^"'\s]+/g,
        '1xclub-links-wsp': /https:\/\/wa\.link\/[^"'\s]+/g,
        '24envivo-links-casinos': /https:\/\/wa\.link\/[^"'\s]+/g,
        '24envivo-links-wsp': /https:\/\/wa\.link\/[^"'\s]+/g
      },
      telegramUrl: {
        '1xclub-links-casinos': /https:\/\/t\.me\/[^"'\s]+/g,
        '1xclub-links-wsp': /https:\/\/t\.me\/[^"'\s]+/g,
        '24envivo-links-casinos': /https:\/\/t\.me\/[^"'\s]+/g,
        '24envivo-links-wsp': /https:\/\/t\.me\/[^"'\s]+/g
      }
    }
    
    const pattern = patterns[textType]?.[siteName]
    if (!pattern) {
      throw new Error(`Tipo de texto no soportado: ${textType}`)
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
