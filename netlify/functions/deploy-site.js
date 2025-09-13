/**
 * Netlify Function: Desplegar sitio individual
 * POST /.netlify/functions/deploy-site
 */

const https = require('https');

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
    const requestBody = JSON.parse(event.body);
    const { siteName } = requestBody;

    if (!siteName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Datos inválidos',
          message: 'Se requiere siteName'
        })
      };
    }

    // Mapeo de sitios a build hooks (estas serían variables de entorno en producción)
    const buildHooks = {
      '1xclub-links-casinos': process.env.BUILD_HOOK_1XCLUB_CASINOS,
      '1xclub-links-wsp': process.env.BUILD_HOOK_1XCLUB_WSP,
      '24envivo-links-casinos': process.env.BUILD_HOOK_24ENVIVO_CASINOS,
      '24envivo-links-wsp': process.env.BUILD_HOOK_24ENVIVO_WSP
    };

    const buildHookUrl = buildHooks[siteName];
    
    if (!buildHookUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Sitio no encontrado',
          message: `No hay build hook configurado para ${siteName}`
        })
      };
    }

    // Trigger build hook
    const deployResult = await triggerBuildHook(buildHookUrl, siteName);
    
    if (!deployResult.success) {
      throw new Error(deployResult.error);
    }

    // Log del despliegue
    await logDeployment(siteName, 'success', deployResult.buildId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Despliegue de ${siteName} iniciado correctamente`,
        siteName: siteName,
        buildId: deployResult.buildId,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error deploying site:', error);
    
    // Log del error
    await logDeployment(requestBody?.siteName || 'unknown', 'error', null, error.message);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en el despliegue',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

function triggerBuildHook(hookUrl, siteName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      trigger: 'admin-panel',
      site: siteName,
      timestamp: new Date().toISOString()
    });

    const url = new URL(hookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const response = JSON.parse(data);
            resolve({
              success: true,
              buildId: response.id || 'unknown',
              response: response
            });
          } catch (e) {
            resolve({
              success: true,
              buildId: 'unknown',
              response: data
            });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });

    req.write(postData);
    req.end();

    // Timeout después de 30 segundos
    setTimeout(() => {
      req.destroy();
      reject(new Error('Timeout: La request tardó más de 30 segundos'));
    }, 30000);
  });
}

async function logDeployment(siteName, status, buildId, error = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    siteName: siteName,
    status: status,
    buildId: buildId,
    error: error,
    source: 'admin-panel'
  };

  console.log('Deployment log:', JSON.stringify(logEntry));
  
  // Aquí se puede integrar con servicios de logging externos
  // Por ejemplo: DataDog, CloudWatch, Logtail, etc.
  
  // Ejemplo con webhook personalizado:
  // if (process.env.LOGGING_WEBHOOK) {
  //   try {
  //     await fetch(process.env.LOGGING_WEBHOOK, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(logEntry)
  //     });
  //   } catch (e) {
  //     console.error('Error sending log:', e);
  //   }
  // }
}


