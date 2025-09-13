/**
 * Netlify Function: Obtener configuración actual
 * GET /.netlify/functions/get-config
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

  try {
    // Ruta al archivo de configuración compartida
    const configPath = path.join(process.cwd(), 'shared', 'config.cjs');
    
    // Verificar si el archivo existe
    if (!fs.existsSync(configPath)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Archivo de configuración no encontrado',
      message: 'El archivo shared/config.cjs no existe'
        })
      };
    }

    // Importar la configuración usando require
    delete require.cache[configPath]; // Limpiar cache para obtener la versión más reciente
    const { CONFIG } = require(configPath);
    
    if (!CONFIG) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Error al cargar configuración',
          message: 'No se pudo cargar el objeto CONFIG del archivo'
        })
      };
    }

    const config = CONFIG;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        config: config,
        lastModified: fs.statSync(configPath).mtime.toISOString()
      })
    };

  } catch (error) {
    console.error('Error getting config:', error);
    
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


