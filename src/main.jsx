import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'

// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importar estilos personalizados (después de Bootstrap para poder sobrescribir)
import './index.css'

// Configuración del QueryClient para mejor manejo de cache y conexiones
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000, // 30 segundos
      cacheTime: 300000, // 5 minutos
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1,
      retryDelay: 2000
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#212529',
            color: '#f8f9fa',
            border: '1px solid #343a40'
          },
          success: {
            iconTheme: {
              primary: '#198754',
              secondary: '#f8f9fa'
            }
          },
          error: {
            iconTheme: {
              primary: '#dc3545',
              secondary: '#f8f9fa'
            }
          }
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)