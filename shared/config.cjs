/**
 * Configuración centralizada para todos los proyectos de casino
 * Este archivo es editado automáticamente por el panel de administración
 * NO EDITAR MANUALMENTE - usar el panel admin
 * Última actualización: 2024-01-15T10:00:00.000Z
 */

const CONFIG = {
  "meta": {
    "lastUpdated": "2024-01-15T10:00:00.000Z",
    "version": "1.0.0"
  },
  "globalLinks": {
    "whatsappUrl": "https://wa.link/oy1xno",
    "telegramUrl": "https://t.me/jugadirecto",
    "xclubUrl": "https://1xclub.bet",
    "envivoUrl": "https://24envivo.com"
  },
  "sites": {
    "1xclub-links-casinos": {
      "brandName": "1XCLUB.BET",
      "siteName": "1xclub-links-casinos",
      "brandType": "1xclub",
      "mainUrl": "https://1xclub.bet",
      "whatsappUrl": "https://wa.link/oy1xno",
      "telegramUrl": "https://t.me/jugadirecto",
      "deployUrl": "https://7.registrogratis.online"
    },
    "1xclub-links-wsp": {
      "brandName": "1XCLUB.BET",
      "siteName": "1xclub-links-wsp",
      "brandType": "1xclub",
      "mainUrl": "https://1xclub.bet",
      "whatsappUrl": "https://wa.link/oy1xno",
      "telegramUrl": "https://t.me/jugadirecto",
      "deployUrl": "https://8.registrogratis.online"
    },
    "24envivo-links-casinos": {
      "brandName": "24ENVIVO.COM",
      "siteName": "24envivo-links-casinos",
      "brandType": "24envivo",
      "mainUrl": "https://24envivo.com",
      "whatsappUrl": "https://wa.link/oy1xno",
      "telegramUrl": "https://t.me/jugadirecto",
      "deployUrl": "https://9.registrogratis.online"
    },
    "24envivo-links-wsp": {
      "brandName": "24ENVIVO.COM",
      "siteName": "24envivo-links-wsp",
      "brandType": "24envivo",
      "mainUrl": "https://24envivo.com",
      "whatsappUrl": "https://wa.link/oy1xno",
      "telegramUrl": "https://t.me/jugadirecto",
      "deployUrl": "https://10.registrogratis.online"
    }
  },
  "texts": {
    "mainTitle": "Registrate gratis y pedi 2000 fichas para probar",
    "subtitle": "Crea tu cuenta rápido y seguro ✨",
    "registerButton": "REGISTRARSE GRATIS",
    "whatsappButton": "💬 Contactar por WhatsApp",
    "telegramButton": "📱 Unirse a Telegram",
    "features": [
      "🎰 +1000 juegos de casino",
      "🎲 Ruleta en vivo 24/7",
      "🃏 Blackjack profesional",
      "💰 Bonos diarios",
      "🔒 100% seguro y confiable",
      "📱 Juega desde tu celular"
    ]
  }
};

// Función helper para obtener configuración por sitio
function getSiteConfig(siteName) {
  const siteConfig = CONFIG.sites[siteName];
  if (!siteConfig) {
    console.error(`Configuración no encontrada para sitio: ${siteName}`);
    return getDefaultConfig(siteName);
  }
  return siteConfig;
}

// Configuración por defecto como fallback
function getDefaultConfig(siteName) {
  const isXclub = siteName.includes('1xclub');
  return {
    mainUrl: isXclub ? "https://1xclub.bet" : "https://24envivo.com",
    whatsappUrl: "https://wa.link/oy1xno",
    telegramUrl: "https://t.me/jugadirecto",
    brandName: isXclub ? "1XCLUB.BET" : "24ENVIVO.COM",
    siteName: siteName
  };
}

// Función para validar configuración
function validateConfig(config) {
  const required = ['mainUrl', 'whatsappUrl', 'telegramUrl', 'brandName'];
  return required.every(field => config[field] && config[field].length > 0);
}

// Exportar usando CommonJS
module.exports = {
  CONFIG,
  getSiteConfig,
  getDefaultConfig,
  validateConfig
};