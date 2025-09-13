import { useState, useCallback, useMemo, useRef, useEffect } from 'react'

// Hook optimizado para formularios con debouncing
export const useFormState = (initialState, debounceMs = 300) => {
  const [state, setState] = useState(initialState)
  const [debouncedState, setDebouncedState] = useState(initialState)
  const timeoutRef = useRef(null)

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }))
    
    // Debounce para el estado optimizado
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedState(prev => ({ ...prev, ...updates }))
    }, debounceMs)
  }, [debounceMs])

  const resetState = useCallback(() => {
    setState(initialState)
    setDebouncedState(initialState)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [initialState])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    state,
    debouncedState,
    updateState,
    resetState
  }
}

// Hook para cache de datos con invalidación inteligente
export const useSmartCache = (key, fetcher, options = {}) => {
  const {
    ttl = 300000, // 5 minutos
    staleWhileRevalidate = true,
    maxRetries = 3
  } = options

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(0)
  const retryCountRef = useRef(0)

  const isStale = useMemo(() => {
    return Date.now() - lastFetch > ttl
  }, [lastFetch, ttl])

  const fetchData = useCallback(async (force = false) => {
    if (!force && !isStale && data) return data

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      setLastFetch(Date.now())
      retryCountRef.current = 0
      return result
    } catch (err) {
      setError(err)
      retryCountRef.current += 1
      
      // Retry automático con backoff exponencial
      if (retryCountRef.current <= maxRetries) {
        const delay = Math.min(1000 * (2 ** retryCountRef.current), 10000)
        setTimeout(() => fetchData(force), delay)
      }
      
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, isStale, data, maxRetries])

  const invalidate = useCallback(() => {
    setLastFetch(0)
    setData(null)
  }, [])

  // Auto-fetch si los datos están stale y staleWhileRevalidate está habilitado
  useEffect(() => {
    if (staleWhileRevalidate && isStale && data) {
      fetchData(false)
    }
  }, [fetchData, isStale, data, staleWhileRevalidate])

  return {
    data,
    isLoading,
    error,
    isStale,
    fetch: fetchData,
    invalidate
  }
}

// Hook para manejar intersección y lazy loading
export const useIntersectionObserver = (callback, options = {}) => {
  const [ref, setRef] = useState(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callbackRef.current(entry)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return setRef
}

// Hook para performance monitoring
export const usePerformanceMonitor = (name) => {
  const startTimeRef = useRef(null)
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now()
  }, [])
  
  const end = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      startTimeRef.current = null
      return duration
    }
    return 0
  }, [name])
  
  const measure = useCallback((fn) => {
    start()
    const result = fn()
    end()
    return result
  }, [start, end])
  
  return { start, end, measure }
}
