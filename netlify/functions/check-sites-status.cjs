/**
 * Netlify Function: Verificar estado de todos los sitios
 * GET /.netlify/functions/check-sites-status
 */

const https = require('https');
const http = require('http');

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
    // URLs fijas de los sitios
    const sites = {
      '1xclub-links-casinos': 'https://1.registrogratis.online',
      '1xclub-links-wsp': 'https://2.registrogratis.online',
      '24envivo-links-casinos': 'https://3.registrogratis.online',
      '24envivo-links-wsp': 'https://4.registrogratis.online'
    };

    const statusResults = {};

    // Verificar estado de cada sitio en paralelo
    const checkPromises = Object.entries(sites).map(async ([siteName, url]) => {
      try {
        const status = await checkSiteStatus(url);
        statusResults[siteName] = {
          online: status.online,
          responseTime: status.responseTime,
          statusCode: status.statusCode,
          lastChecked: new Date().toISOString(),
          url: url,
          lastDeploy: await getLastDeployTime(siteName) // Esto vendría de Netlify API
        };
      } catch (error) {
        statusResults[siteName] = {
          online: false,
          error: error.message,
          lastChecked: new Date().toISOString(),
          url: url,
          lastDeploy: 'Error al obtener'
        };
      }
    });

    await Promise.allSettled(checkPromises);

    // Calcular estadísticas generales
    const totalSites = Object.keys(sites).length;
    const onlineSites = Object.values(statusResults).filter(site => site.online).length;
    const offlineSites = totalSites - onlineSites;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        summary: {
          total: totalSites,
          online: onlineSites,
          offline: offlineSites,
          healthPercentage: Math.round((onlineSites / totalSites) * 100)
        },
        sites: statusResults,
        lastChecked: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error checking sites status:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error verificando estado de sitios',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

function checkSiteStatus(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Casino-Admin-Status-Checker/1.0'
      }
    };

    const req = client.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      const online = res.statusCode >= 200 && res.statusCode < 400;
      
      resolve({
        online: online,
        statusCode: res.statusCode,
        responseTime: responseTime
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Connection error: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });

    req.end();
  });
}

async function getLastDeployTime(siteName) {
  // En una implementación real, esto consultaría la API de Netlify
  // para obtener información del último deploy
  try {
    // Ejemplo de como sería con la API de Netlify:
    // const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    //   headers: { 'Authorization': `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}` }
    // });
    // const deploys = await response.json();
    // return deploys[0]?.created_at || 'Nunca';
    
    // Por ahora retornamos un placeholder
    return 'Información no disponible';
  } catch (error) {
    console.error(`Error getting deploy time for ${siteName}:`, error);
    return 'Error al obtener';
  }
}


