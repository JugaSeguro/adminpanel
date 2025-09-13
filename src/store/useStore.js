import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store para el estado de la aplicación
const useAppStore = create(
  persist(
    (set, get) => ({
      // Estado de la UI
      activeTab: 'config',
      isLoading: false,
      loadingMessage: 'Procesando...',
      
      // Logs de despliegue
      deployLogs: [],
      
      // Configuración fallback
      fallbackConfig: {
        globalLinks: {
          whatsappUrl: "https://wa.link/oy1xno",
          telegramUrl: "https://t.me/jugadirecto",
          xclubUrl: "https://1xclub.bet",
          envivoUrl: "https://24envivo.com"
        },
        sites: {
          "1xclub-links-casinos": {
            brandName: "1XCLUB.BET",
            siteName: "1xclub-links-casinos",
            brandType: "1xclub"
          },
          "1xclub-links-wsp": {
            brandName: "1XCLUB.BET",
            siteName: "1xclub-links-wsp",
            brandType: "1xclub"
          },
          "24envivo-links-casinos": {
            brandName: "24ENVIVO.COM",
            siteName: "24envivo-links-casinos",
            brandType: "24envivo"
          },
          "24envivo-links-wsp": {
            brandName: "24ENVIVO.COM",
            siteName: "24envivo-links-wsp",
            brandType: "24envivo"
          }
        },
        texts: {
          mainTitle: "Registrate gratis y pedi 2000 fichas para probar",
          subtitle: "Crea tu cuenta rápido y seguro ✨",
          description: "Regístrate totalmente gratis en la plataforma más segura de Argentina. Contamos con más de 12000 Slots, la mejor deportiva y el mejor casino en vivo.",
          buttons: {
            bonus: "🔥 ¡OBTENÉ TU MEGABONUS CON TU PRIMER RECARGA 🔥",
            register: "¡REGISTRATE AHORA!",
            access: "🎯 ACCEDER A {BRAND} 🎯",
            chat: "Chatear con nosotros"
          },
          telegram: "📱 SEGUINOS EN TELEGRAM Y GANÁ PREMIOS DIARIOS 📱"
        }
      },

      // Acciones de UI
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setLoading: (isLoading, message = 'Procesando...') => 
        set({ isLoading, loadingMessage: message }),

      // Manejo de logs de despliegue
      addDeployLog: (message) => 
        set((state) => ({
          deployLogs: [
            ...state.deployLogs,
            {
              id: Date.now(),
              message,
              timestamp: new Date().toLocaleTimeString()
            }
          ].slice(-50) // Mantener solo los últimos 50 logs
        })),

      clearDeployLogs: () => set({ deployLogs: [] }),

      // Utilidades
      getFallbackConfig: () => get().fallbackConfig,
      
      // Reset del store
      reset: () => set({
        activeTab: 'config',
        isLoading: false,
        loadingMessage: 'Procesando...',
        deployLogs: []
      })
    }),
    {
      name: 'casino-admin-store',
      partialize: (state) => ({
        activeTab: state.activeTab,
        deployLogs: state.deployLogs
      })
    }
  )
)

export default useAppStore
