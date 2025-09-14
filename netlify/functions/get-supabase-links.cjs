const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://slrzlggigpiinswjfvxr.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c'

const supabase = createClient(supabaseUrl, supabaseKey)

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    const { httpMethod, queryStringParameters } = event

    switch (httpMethod) {
      case 'GET':
        return await handleGet(queryStringParameters, headers)
      
      case 'POST':
        return await handlePost(JSON.parse(event.body), headers)
      
      case 'PUT':
        return await handlePut(JSON.parse(event.body), headers)
      
      case 'DELETE':
        return await handleDelete(queryStringParameters, headers)
      
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método no permitido' })
        }
    }
  } catch (error) {
    console.error('Error en función Supabase:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      })
    }
  }
}

// Obtener enlaces
async function handleGet(params, headers) {
  try {
    let query = supabase.from('whatsapp_links').select('*')
    
    // Filtros opcionales
    if (params?.site_name) {
      query = query.eq('site_name', params.site_name)
    }
    
    if (params?.link_type) {
      query = query.eq('link_type', params.link_type)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: data || [],
        count: data?.length || 0
      })
    }
  } catch (error) {
    console.error('Error obteniendo enlaces:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    }
  }
}

// Crear enlace
async function handlePost(body, headers) {
  try {
    const { site_name, link_type, wa_link } = body
    
    // Validaciones
    if (!site_name || !link_type || !wa_link) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Faltan campos requeridos: site_name, link_type, wa_link' 
        })
      }
    }
    
    if (!wa_link.includes('wa.link/')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'El enlace debe ser un enlace válido de wa.link' 
        })
      }
    }
    
    const { data, error } = await supabase
      .from('whatsapp_links')
      .insert({
        site_name,
        link_type,
        wa_link,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) throw error
    
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: data[0],
        message: 'Enlace creado exitosamente'
      })
    }
  } catch (error) {
    console.error('Error creando enlace:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    }
  }
}

// Actualizar enlace
async function handlePut(body, headers) {
  try {
    const { id, site_name, link_type, wa_link } = body
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'ID del enlace es requerido' 
        })
      }
    }
    
    const updateData = {
      updated_at: new Date().toISOString()
    }
    
    if (site_name) updateData.site_name = site_name
    if (link_type) updateData.link_type = link_type
    if (wa_link) {
      if (!wa_link.includes('wa.link/')) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            success: false, 
            error: 'El enlace debe ser un enlace válido de wa.link' 
          })
        }
      }
      updateData.wa_link = wa_link
    }
    
    const { data, error } = await supabase
      .from('whatsapp_links')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Enlace no encontrado' 
        })
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: data[0],
        message: 'Enlace actualizado exitosamente'
      })
    }
  } catch (error) {
    console.error('Error actualizando enlace:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    }
  }
}

// Eliminar enlace
async function handleDelete(params, headers) {
  try {
    const { id } = params
    
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'ID del enlace es requerido' 
        })
      }
    }
    
    const { error } = await supabase
      .from('whatsapp_links')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Enlace eliminado exitosamente'
      })
    }
  } catch (error) {
    console.error('Error eliminando enlace:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    }
  }
}