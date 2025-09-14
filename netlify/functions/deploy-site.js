const fetch = require('node-fetch')

exports.handler = async (event, context) => {
  // Solo permitir métodos POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { siteId, siteName } = JSON.parse(event.body)
    
    if (!siteId || !siteName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'siteId and siteName are required' })
      }
    }

    const netlifyToken = process.env.NETLIFY_ACCESS_TOKEN
    
    if (!netlifyToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Netlify access token not configured' })
      }
    }

    // Trigger deployment via Netlify API
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/builds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clear_cache: true
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Netlify API error for ${siteName}:`, errorText)
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: `Failed to deploy ${siteName}`, 
          details: errorText 
        })
      }
    }

    const deployData = await response.json()
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: `Deployment triggered for ${siteName}`,
        deployId: deployData.id,
        siteName: siteName
      })
    }
  } catch (error) {
    console.error('Deploy function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    }
  }
}