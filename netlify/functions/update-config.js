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

    // Ruta al archivo de configuración
    const configPath = path.join(process.cwd(), 'shared', 'config.js');
    
    // Leer configuración actual
    let currentConfig = {};
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const configMatch = configContent.match(/export const CONFIG = ({[\s\S]*?});/);
      if (configMatch) {
        currentConfig = eval(`(${configMatch[1]})`);
      }
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

export const CONFIG = ${JSON.stringify(config, null, 2)};

// Función helper para obtener configuración por sitio
export function getSiteConfig(siteName) {
  const siteConfig = CONFIG.sites[siteName];
  if (!siteConfig) {
    console.error(\`Configuración no encontrada para sitio: \${siteName}\`);
    return getDefaultConfig(siteName);
  }
  return siteConfig;
}

// Configuración por defecto como fallback
export function getDefaultConfig(siteName) {
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
export function validateConfig(config) {
  const required = ['mainUrl', 'whatsappUrl', 'telegramUrl', 'brandName'];
  return required.every(field => config[field] && config[field].length > 0);
}

export default CONFIG;`;
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
