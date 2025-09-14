import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://slrzlggigpiinswjfvxr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSupabase() {
  console.log('🔍 Iniciando diagnóstico de Supabase...')
  
  try {
    // 1. Verificar conexión
    console.log('\n1. Verificando conexión...')
    const { data: testData, error: testError } = await supabase
      .from('landing_phones')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error de conexión:', testError)
      return
    }
    console.log('✅ Conexión exitosa')
    
    // 2. Verificar datos existentes
    console.log('\n2. Verificando datos existentes...')
    const { data: allData, error: selectError } = await supabase
      .from('landing_phones')
      .select('*')
      .order('landing_number', { ascending: true })
    
    if (selectError) {
      console.error('❌ Error al leer datos:', selectError)
      return
    }
    
    console.log(`✅ Encontrados ${allData?.length || 0} registros:`)
    allData?.forEach(record => {
      console.log(`  - Landing ${record.landing_number}: ${record.whatsapp_link || 'Sin enlace'} (${record.is_active ? 'Activo' : 'Inactivo'})`)
    })
    
    // 3. Probar actualización
    console.log('\n3. Probando actualización...')
    const testLanding = allData?.[0]
    if (!testLanding) {
      console.log('❌ No hay registros para probar actualización')
      return
    }
    
    const testLink = 'https://wa.me/1234567890?text=Test'
    const { data: updateData, error: updateError } = await supabase
      .from('landing_phones')
      .update({
        whatsapp_link: testLink,
        description: 'Test de actualización',
        updated_at: new Date().toISOString()
      })
      .eq('landing_number', testLanding.landing_number)
      .select()
    
    if (updateError) {
      console.error('❌ Error al actualizar:', updateError)
      console.log('Detalles del error:')
      console.log('- Código:', updateError.code)
      console.log('- Mensaje:', updateError.message)
      console.log('- Detalles:', updateError.details)
      console.log('- Hint:', updateError.hint)
      return
    }
    
    console.log('✅ Actualización exitosa:')
    console.log('Datos actualizados:', updateData)
    
    // 4. Verificar que el cambio se guardó
    console.log('\n4. Verificando que el cambio se guardó...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('landing_phones')
      .select('*')
      .eq('landing_number', testLanding.landing_number)
      .single()
    
    if (verifyError) {
      console.error('❌ Error al verificar:', verifyError)
      return
    }
    
    if (verifyData.whatsapp_link === testLink) {
      console.log('✅ El cambio se guardó correctamente')
    } else {
      console.log('❌ El cambio NO se guardó')
      console.log('Esperado:', testLink)
      console.log('Actual:', verifyData.whatsapp_link)
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar diagnóstico
debugSupabase()