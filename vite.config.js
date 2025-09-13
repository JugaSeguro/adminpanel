import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'react-hot-toast'],
          state: ['zustand', '@tanstack/react-query']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err.message)
            // Enviar respuesta mock en caso de error
            if (!res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ 
                error: 'Netlify functions not available in development',
                message: 'This is a development environment. Netlify functions are not running.',
                status: 'development'
              }))
            }
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.path)
          })
        },
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, '/.netlify/functions')
      }
    }
  }
})
