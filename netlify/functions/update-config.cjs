/**
 * Netlify Function: Actualizar configuración
 * POST /.netlify/functions/update-config
 */

const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: 'Método no permitido',
        message: 'Solo se permite POST'
      })
    };
  }

  try {
    // Parsear el body de la request
    const requestBody = JSON.parse(event.body);
    
    // Validar que tenemos datos para actualizar
    if (!requestBody.sites && !requestBody.texts && !requestBody.globalLinks) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Datos inválidos',
          message: 'Se requiere sites, texts o globalLinks en el body'
        })
      };
    }

    // Ruta al archivo de configuración - probar diferentes rutas
    let configPath = path.join(process.cwd(), 'shared', 'config.cjs');
    
    // Si no existe, intentar con rutas alternativas
    if (!fs.existsSync(configPath)) {
      // Intentar con la ruta relativa desde la función
      configPath = path.join(__dirname, '..', '..', 'shared', 'config.cjs');
      
      // Si sigue sin existir, intentar con otra ruta común en Netlify
      if (!fs.existsSync(configPath)) {
        configPath = path.join(process.cwd(), '..', 'shared', 'config.cjs');
        
        // Si todavía no existe, crear el directorio y un archivo de configuración inicial
        if (!fs.existsSync(configPath)) {
          console.log('Creando archivo de configuración inicial...');
          
          // Determinar la mejor ruta para crear el archivo
          const sharedDir = path.join(process.cwd(), 'shared');
          try {
            // Intentar crear el directorio si no existe
            if (!fs.existsSync(sharedDir)) {
              fs.mkdirSync(sharedDir, { recursive: true });
            }
            configPath = path.join(sharedDir, 'config.cjs');
          } catch (err) {
            console.error('Error al crear directorio shared:', err);
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({
                error: 'Error al crear directorio de configuración',
                message: err.message
              })
            };
          }
        }
      }
    }
    
    // Leer configuración actual o inicializar una nueva
    let currentConfig = {};
    if (fs.existsSync(configPath)) {
      try {
        delete require.cache[configPath]; // Limpiar cache
        const { CONFIG } = require(configPath);
        if (CONFIG) {
          currentConfig = CONFIG;
        }
      } catch (err) {
        console.warn('Error al leer configuración existente, usando configuración por defecto:', err.message);
        // Inicializar con configuración por defecto si hay error
        currentConfig = getDefaultConfig();
      }
    } else {
      // Si no existe el archivo, inicializar con configuración por defecto
      currentConfig = getDefaultConfig();
    }

    // Actualizar configuración
    if (requestBody.globalLinks) {
      currentConfig.globalLinks = { ...currentConfig.globalLinks, ...requestBody.globalLinks };
    }

    if (requestBody.sites) {
      currentConfig.sites = { ...currentConfig.sites, ...requestBody.sites };
    }

    if (requestBody.texts) {
      currentConfig.texts = { ...currentConfig.texts, ...requestBody.texts };
    }

    // Actualizar metadatos
    currentConfig.meta = {
      ...currentConfig.meta,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin-panel'
    };

    // Generar el nuevo contenido del archivo
    const newConfigContent = generateConfigFile(currentConfig);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(configPath, newConfigContent, 'utf8');

    // Notificar a otros sistemas si es necesario
    await notifyConfigUpdate(currentConfig);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Configuración actualizada correctamente',
        config: currentConfig,
        updatedAt: currentConfig.meta.lastUpdated
      })
    };

  } catch (error) {
    console.error('Error updating config:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

function generateConfigFile(config) {
  return `/**
 * Configuración centralizada para todos los proyectos de casino
 * Este archivo es editado automáticamente por el panel de administración
 * NO EDITAR MANUALMENTE - usar el panel admin
 * Última actualización: ${config.meta?.lastUpdated || new Date().toISOString()}
 */

const CONFIG = ${JSON.stringify(config, null, 2)};

// Función helper para obtener configuración por sitio
function getSiteConfig(siteName) {
  const siteConfig = CONFIG.sites[siteName];
  if (!siteConfig) {
    console.error(\`Configuración no encontrada para sitio: \${siteName}\`);
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
};`;
}

// Función para obtener configuración por defecto
function getDefaultConfig() {
  return {
    meta: {
      lastUpdated: new Date().toISOString(),
      version: "1.0.0"
    },
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
        brandType: "1xclub",
        mainUrl: "https://1xclub.bet",
        whatsappUrl: "https://wa.link/oy1xno",
        telegramUrl: "https://t.me/jugadirecto",
        deployUrl: "https://7.registrogratis.online"
      },
      "1xclub-links-wsp": {
        brandName: "1XCLUB.BET",
        siteName: "1xclub-links-wsp",
        brandType: "1xclub",
        mainUrl: "https://1xclub.bet",
        whatsappUrl: "https://wa.link/oy1xno",
        telegramUrl: "https://t.me/jugadirecto",
        deployUrl: "https://8.registrogratis.online"
      },
      "24envivo-links-casinos": {
        brandName: "24ENVIVO.COM",
        siteName: "24envivo-links-casinos",
        brandType: "24envivo",
        mainUrl: "https://24envivo.com",
        whatsappUrl: "https://wa.link/oy1xno",
        telegramUrl: "https://t.me/jugadirecto",
        deployUrl: "https://9.registrogratis.online"
      },
      "24envivo-links-wsp": {
        brandName: "24ENVIVO.COM",
        siteName: "24envivo-links-wsp",
        brandType: "24envivo",
        mainUrl: "https://24envivo.com",
        whatsappUrl: "https://wa.link/oy1xno",
        telegramUrl: "https://t.me/jugadirecto",
        deployUrl: "https://10.registrogratis.online"
      }
    },
    texts: {
      mainTitle: "Registrate gratis y pedi 2000 fichas para probar",
      subtitle: "Crea tu cuenta rápido y seguro ✨",
      registerButton: "REGISTRARSE GRATIS",
      whatsappButton: "💬 Contactar por WhatsApp",
      telegramButton: "📱 Unirse a Telegram",
      features: [
        "🎰 +1000 juegos de casino",
        "🎲 Ruleta en vivo 24/7",
        "🃏 Blackjack profesional",
        "💰 Bonos diarios",
        "🔒 100% seguro y confiable",
        "📱 Juega desde tu celular"
      ]
    }
  };
}

async function notifyConfigUpdate(config) {
  // Aquí se pueden agregar notificaciones adicionales
  // Por ejemplo, webhooks, logs, etc.
  console.log('Config updated:', config.meta?.lastUpdated);
  
  // Ejemplo: enviar webhook a Slack, Discord, etc.
  // if (process.env.WEBHOOK_URL) {
  //   await fetch(process.env.WEBHOOK_URL, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       text: `Configuración de casino actualizada: ${config.meta?.lastUpdated}`
  //     })
  //   });
  // }
}
