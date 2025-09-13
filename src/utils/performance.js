// Utilidades de optimización de rendimiento

// Memoización inteligente para funciones costosas
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map()
  
  return (...args) => {
    const key = getKey(...args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    
    // Limpiar cache si se vuelve muy grande
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

// Debounce optimizado
export const debounce = (func, wait, immediate = false) => {
  let timeout
  let result
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) result = func.apply(this, args)
    }
    
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) result = func.apply(this, args)
    return result
  }
}

// Throttle para eventos frecuentes
export const throttle = (func, limit) => {
  let inThrottle
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Lazy loading de componentes con preload
export const createLazyComponent = (importFn, preloadTrigger = null) => {
  const LazyComponent = React.lazy(importFn)
  
  // Preload cuando sea necesario
  if (preloadTrigger) {
    preloadTrigger.then(() => {
      importFn()
    })
  }
  
  return LazyComponent
}

// Optimización de imágenes
export const createOptimizedImageUrl = (url, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    lazy = true
  } = options
  
  // Si es una URL de Netlify, usar su servicio de optimización
  if (url.includes('.netlify.app') || url.includes('netlify.com')) {
    const params = new URLSearchParams()
    if (width) params.append('w', width)
    if (height) params.append('h', height)
    params.append('q', quality)
    params.append('fm', format)
    
    return `${url}?${params.toString()}`
  }
  
  return url
}

// Medición de rendimiento
export class PerformanceTracker {
  constructor() {
    this.marks = new Map()
    this.measures = new Map()
  }
  
  mark(name) {
    const timestamp = performance.now()
    this.marks.set(name, timestamp)
    
    if (performance.mark) {
      performance.mark(name)
    }
  }
  
  measure(name, startMark, endMark) {
    const startTime = this.marks.get(startMark)
    const endTime = this.marks.get(endMark) || performance.now()
    
    if (startTime) {
      const duration = endTime - startTime
      this.measures.set(name, duration)
      
      if (performance.measure) {
        performance.measure(name, startMark, endMark)
      }
      
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return duration
    }
    
    return 0
  }
  
  clear() {
    this.marks.clear()
    this.measures.clear()
    
    if (performance.clearMarks) {
      performance.clearMarks()
    }
    if (performance.clearMeasures) {
      performance.clearMeasures()
    }
  }
  
  getReport() {
    return {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures)
    }
  }
}

// Singleton del tracker
export const performanceTracker = new PerformanceTracker()

// Detectar capacidades del dispositivo
export const getDeviceCapabilities = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  return {
    // Conectividad
    connectionType: connection?.effectiveType || 'unknown',
    isSlowConnection: connection ? connection.effectiveType.includes('2g') : false,
    
    // Hardware
    deviceMemory: navigator.deviceMemory || 4,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    
    // Características del navegador
    supportsWebP: (() => {
      const canvas = document.createElement('canvas')
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    })(),
    
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsServiceWorker: 'serviceWorker' in navigator,
    
    // Viewport
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  }
}

// Optimización de bundle splitting
export const shouldPreloadComponent = (componentName) => {
  const capabilities = getDeviceCapabilities()
  
  // No preload en conexiones lentas o dispositivos con poca memoria
  if (capabilities.isSlowConnection || capabilities.deviceMemory < 2) {
    return false
  }
  
  // Preload componentes críticos en desktop
  const criticalComponents = ['ConfigTab', 'DeployTab']
  if (capabilities.isDesktop && criticalComponents.includes(componentName)) {
    return true
  }
  
  return false
}

// Cache inteligente basado en capacidades
export const getCacheStrategy = () => {
  const capabilities = getDeviceCapabilities()
  
  if (capabilities.isSlowConnection) {
    return {
      maxAge: 600000, // 10 minutos
      maxEntries: 20,
      updateStrategy: 'cache-first'
    }
  }
  
  if (capabilities.deviceMemory < 2) {
    return {
      maxAge: 300000, // 5 minutos
      maxEntries: 10,
      updateStrategy: 'stale-while-revalidate'
    }
  }
  
  return {
    maxAge: 60000, // 1 minuto
    maxEntries: 50,
    updateStrategy: 'network-first'
  }
}
