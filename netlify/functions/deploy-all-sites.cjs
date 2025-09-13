/**
 * Netlify Function: Desplegar todos los sitios
 * POST /.netlify/functions/deploy-all-sites
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
    // Configuración de todos los sitios y sus build hooks
    const sites = {
      '1xclub-links-casinos': process.env.BUILD_HOOK_1XCLUB_CASINOS,
      '1xclub-links-wsp': process.env.BUILD_HOOK_1XCLUB_WSP,
      '24envivo-links-casinos': process.env.BUILD_HOOK_24ENVIVO_CASINOS,
      '24envivo-links-wsp': process.env.BUILD_HOOK_24ENVIVO_WSP
    };

    const deploymentResults = [];
    const errors = [];

    // Desplegar todos los sitios en paralelo
    const deployPromises = Object.entries(sites).map(async ([siteName, buildHook]) => {
      if (!buildHook) {
        const error = `No build hook configurado para ${siteName}`;
        errors.push({ siteName, error });
        return { siteName, success: false, error };
      }

      try {
        const result = await triggerBuildHook(buildHook, siteName);
        deploymentResults.push({
          siteName,
          success: true,
          buildId: result.buildId,
          timestamp: new Date().toISOString()
        });

        // Log individual
        await logDeployment(siteName, 'success', result.buildId);
        
        return { siteName, success: true, buildId: result.buildId };
      } catch (error) {
        const errorMsg = error.message;
        errors.push({ siteName, error: errorMsg });
        
        // Log del error
        await logDeployment(siteName, 'error', null, errorMsg);
        
        return { siteName, success: false, error: errorMsg };
      }
    });

    // Esperar a que terminen todos los despliegues
    const results = await Promise.allSettled(deployPromises);
    
    // Procesar resultados
    const successfulDeploys = deploymentResults.length;
    const failedDeploys = errors.length;
    const totalSites = Object.keys(sites).length;

    // Log del resumen
    await logMassDeployment(successfulDeploys, failedDeploys, deploymentResults, errors);

    // Determinar el código de respuesta
    let statusCode = 200;
    if (failedDeploys === totalSites) {
      statusCode = 500; // Todos fallaron
    } else if (failedDeploys > 0) {
      statusCode = 207; // Algunos fallaron (Multi-Status)
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: failedDeploys === 0,
        message: `Despliegue masivo completado: ${successfulDeploys} exitosos, ${failedDeploys} fallidos`,
        summary: {
          total: totalSites,
          successful: successfulDeploys,
          failed: failedDeploys
        },
        results: deploymentResults,
        errors: errors,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error in mass deployment:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error en el despliegue masivo',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

function triggerBuildHook(hookUrl, siteName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      trigger: 'mass-deployment',
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
              buildId: response.id || `build-${Date.now()}`,
              response: response
            });
          } catch (e) {
            resolve({
              success: true,
              buildId: `build-${Date.now()}`,
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

    // Timeout después de 45 segundos para despliegues masivos
    setTimeout(() => {
      req.destroy();
      reject(new Error('Timeout: La request tardó más de 45 segundos'));
    }, 45000);
  });
}

async function logDeployment(siteName, status, buildId, error = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    siteName: siteName,
    status: status,
    buildId: buildId,
    error: error,
    source: 'mass-deployment'
  };

  console.log('Individual deployment log:', JSON.stringify(logEntry));
}

async function logMassDeployment(successful, failed, results, errors) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'mass-deployment-summary',
    successful: successful,
    failed: failed,
    total: successful + failed,
    results: results,
    errors: errors,
    source: 'admin-panel'
  };

  console.log('Mass deployment summary:', JSON.stringify(logEntry));
  
  // Aquí se puede integrar con servicios de notificación
  // Por ejemplo: Slack, Discord, email, etc.
  
  // Ejemplo con Slack webhook:
  // if (process.env.SLACK_WEBHOOK) {
  //   const slackMessage = {
  //     text: `🚀 Despliegue masivo completado`,
  //     attachments: [{
  //       color: failed === 0 ? 'good' : 'warning',
  //       fields: [
  //         { title: 'Exitosos', value: successful, short: true },
  //         { title: 'Fallidos', value: failed, short: true },
  //         { title: 'Total', value: successful + failed, short: true }
  //       ]
  //     }]
  //   };
  //   
  //   try {
  //     await fetch(process.env.SLACK_WEBHOOK, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(slackMessage)
  //     });
  //   } catch (e) {
  //     console.error('Error sending Slack notification:', e);
  //   }
  // }
}


