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
    // Ruta al archivo de configuración compartida - probar diferentes rutas
    let configPath = path.join(process.cwd(), 'shared', 'config.cjs');
    
    // Si no existe, intentar con rutas alternativas
    if (!fs.existsSync(configPath)) {
      // Intentar con la ruta relativa desde la función
      configPath = path.join(__dirname, '..', '..', 'shared', 'config.cjs');
      
      // Si sigue sin existir, intentar con otra ruta común en Netlify
      if (!fs.existsSync(configPath)) {
        configPath = path.join(process.cwd(), '..', 'shared', 'config.cjs');
        
        // Si todavía no existe, devolver error pero con más información
        if (!fs.existsSync(configPath)) {
          console.error('Rutas probadas:', {
            path1: path.join(process.cwd(), 'shared', 'config.cjs'),
            path2: path.join(__dirname, '..', '..', 'shared', 'config.cjs'),
            path3: path.join(process.cwd(), '..', 'shared', 'config.cjs'),
            cwd: process.cwd(),
            dirname: __dirname
          });
          
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
              error: 'Archivo de configuración no encontrado',
              message: 'No se pudo encontrar el archivo config.cjs en ninguna ruta conocida',
              debug: {
                cwd: process.cwd(),
                dirname: __dirname
              }
            })
          };
        }
      }
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


