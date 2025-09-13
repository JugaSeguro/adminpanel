/**
 * Netlify Function: Actualizar textos específicamente
 * POST /.netlify/functions/update-texts
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
    
    // Validar que tenemos textos para actualizar
    if (!requestBody.texts) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Datos inválidos',
          message: 'Se requiere objeto texts en el body'
        })
      };
    }

    // Ruta al archivo de configuración
    const configPath = path.join(process.cwd(), 'shared', 'config.cjs');
    
    // Leer configuración actual
    let currentConfig = {};
    if (fs.existsSync(configPath)) {
      delete require.cache[configPath]; // Limpiar cache
      const { CONFIG } = require(configPath);
      if (CONFIG) {
        currentConfig = CONFIG;
      }
    }

    // Validar y sanitizar textos
    const sanitizedTexts = sanitizeTexts(requestBody.texts);

    // Actualizar solo la sección de textos
    currentConfig.texts = {
      ...currentConfig.texts,
      ...sanitizedTexts
    };

    // Actualizar metadatos
    currentConfig.meta = {
      ...currentConfig.meta,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin-panel-texts'
    };

    // Generar el nuevo contenido del archivo
    const newConfigContent = generateConfigFile(currentConfig);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(configPath, newConfigContent, 'utf8');

    // Log de la actualización
    console.log('Texts updated:', {
      timestamp: currentConfig.meta.lastUpdated,
      fieldsUpdated: Object.keys(sanitizedTexts)
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Textos actualizados correctamente',
        texts: currentConfig.texts,
        updatedAt: currentConfig.meta.lastUpdated,
        fieldsUpdated: Object.keys(sanitizedTexts)
      })
    };

  } catch (error) {
    console.error('Error updating texts:', error);
    
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

function sanitizeTexts(texts) {
  const sanitized = {};
  
  // Lista de campos de texto permitidos
  const allowedFields = [
    'mainTitle',
    'subtitle', 
    'description',
    'telegram'
  ];

  // Sanitizar campos de texto simples
  allowedFields.forEach(field => {
    if (texts[field] && typeof texts[field] === 'string') {
      sanitized[field] = texts[field].trim().substring(0, 500); // Limitar longitud
    }
  });

  // Sanitizar botones (objeto anidado)
  if (texts.buttons && typeof texts.buttons === 'object') {
    sanitized.buttons = {};
    const allowedButtons = ['bonus', 'register', 'access', 'chat'];
    
    allowedButtons.forEach(button => {
      if (texts.buttons[button] && typeof texts.buttons[button] === 'string') {
        sanitized.buttons[button] = texts.buttons[button].trim().substring(0, 200);
      }
    });
  }

  return sanitized;
}

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


