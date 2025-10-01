// Script de prueba para verificar actualizaciones de landings 5-9
// Ejecutar en la consola del navegador en el panel de administración

console.log('🧪 Iniciando pruebas de actualización de landings 5-9...')

// Función para probar actualización de un landing específico
async function testLandingUpdate(landingNumber) {
  console.log(`\n🔄 Probando actualización de Landing ${landingNumber}...`)
  
  try {
    // Obtener cliente de Supabase desde el contexto global
    const supabase = window.supabase || (window.useSupabase && window.useSupabase().supabase)
    
    if (!supabase) {
      console.error('❌ Cliente de Supabase no encontrado')
      return false
    }
    
    // 1. Verificar que el registro existe
    console.log(`📋 Verificando existencia de Landing ${landingNumber}...`)
    const { data: existing, error: checkError } = await supabase
      .from('landing_phones')
      .select('*')
      .eq('landing_number', landingNumber)
      .single()
    
    if (checkError) {
      console.error(`❌ Error verificando Landing ${landingNumber}:`, checkError)
      return false
    }
    
    console.log(`✅ Landing ${landingNumber} existe:`, existing)
    
    // 2. Intentar actualización
    const testTitle = `TEST UPDATE ${new Date().toISOString()}`
    const testLink = `https://wa.me/test${landingNumber}`
    
    console.log(`📝 Actualizando Landing ${landingNumber} con:`, {
      individual_title: testTitle,
      individual_whatsapp_link: testLink,
      use_individual_settings: true
    })
    
    const { data: updateData, error: updateError } = await supabase
      .from('landing_phones')
      .update({
        individual_title: testTitle,
        individual_whatsapp_link: testLink,
        use_individual_settings: true,
        updated_at: new Date().toISOString()
      })
      .eq('landing_number', landingNumber)
      .select()
    
    if (updateError) {
      console.error(`❌ Error actualizando Landing ${landingNumber}:`, updateError)
      console.error('Detalles del error:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint
      })
      return false
    }
    
    if (!updateData || updateData.length === 0) {
      console.error(`❌ Actualización no devolvió datos para Landing ${landingNumber}`)
      return false
    }
    
    console.log(`✅ Landing ${landingNumber} actualizado exitosamente:`, updateData[0])
    
    // 3. Verificar que la actualización se aplicó
    const { data: verifyData, error: verifyError } = await supabase
      .from('landing_phones')
      .select('*')
      .eq('landing_number', landingNumber)
      .single()
    
    if (verifyError) {
      console.error(`❌ Error verificando actualización de Landing ${landingNumber}:`, verifyError)
      return false
    }
    
    const wasUpdated = verifyData.individual_title === testTitle && 
                      verifyData.individual_whatsapp_link === testLink
    
    if (wasUpdated) {
      console.log(`✅ Verificación exitosa: Landing ${landingNumber} se actualizó correctamente`)
      return true
    } else {
      console.error(`❌ Verificación falló: Landing ${landingNumber} no se actualizó`)
      console.error('Datos esperados:', { title: testTitle, link: testLink })
      console.error('Datos actuales:', { 
        title: verifyData.individual_title, 
        link: verifyData.individual_whatsapp_link 
      })
      return false
    }
    
  } catch (error) {
    console.error(`❌ Error inesperado probando Landing ${landingNumber}:`, error)
    return false
  }
}

// Función para probar todos los landings problemáticos
async function testAllProblematicLandings() {
  console.log('\n🧪 Probando todos los landings problemáticos (5-9)...')
  
  const results = {}
  
  for (const landingNumber of [5, 6, 7, 8, 9]) {
    results[landingNumber] = await testLandingUpdate(landingNumber)
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n📊 Resumen de resultados:')
  Object.entries(results).forEach(([landing, success]) => {
    console.log(`Landing ${landing}: ${success ? '✅ ÉXITO' : '❌ FALLO'}`)
  })
  
  const successCount = Object.values(results).filter(Boolean).length
  const totalCount = Object.keys(results).length
  
  console.log(`\n🎯 Resultado final: ${successCount}/${totalCount} landings funcionando correctamente`)
  
  if (successCount === totalCount) {
    console.log('🎉 ¡Todos los landings están funcionando!')
  } else {
    console.log('⚠️ Algunos landings tienen problemas. Revisa los errores arriba.')
  }
  
  return results
}

// Función para verificar configuración de Supabase
function checkSupabaseConfig() {
  console.log('\n🔧 Verificando configuración de Supabase...')
  
  const supabase = window.supabase || (window.useSupabase && window.useSupabase().supabase)
  
  if (!supabase) {
    console.error('❌ Cliente de Supabase no encontrado en window')
    return false
  }
  
  console.log('✅ Cliente de Supabase encontrado')
  console.log('🔗 URL:', supabase.supabaseUrl)
  console.log('🔑 Key (primeros 20 chars):', supabase.supabaseKey?.substring(0, 20) + '...')
  
  return true
}

// Función para verificar permisos RLS
async function checkRLSPermissions() {
  console.log('\n🔒 Verificando permisos RLS...')
  
  try {
    const supabase = window.supabase || (window.useSupabase && window.useSupabase().supabase)
    
    if (!supabase) {
      console.error('❌ Cliente de Supabase no encontrado')
      return false
    }
    
    // Intentar SELECT simple
    const { data: selectData, error: selectError } = await supabase
      .from('landing_phones')
      .select('landing_number, individual_title')
      .limit(1)
    
    if (selectError) {
      console.error('❌ Error en SELECT:', selectError)
      return false
    }
    
    console.log('✅ SELECT funciona correctamente')
    
    // Intentar UPDATE en landing 1 (que sabemos que funciona)
    const { data: updateData, error: updateError } = await supabase
      .from('landing_phones')
      .update({ updated_at: new Date().toISOString() })
      .eq('landing_number', 1)
      .select()
    
    if (updateError) {
      console.error('❌ Error en UPDATE (Landing 1):', updateError)
      return false
    }
    
    console.log('✅ UPDATE funciona en Landing 1')
    
    // Intentar UPDATE en landing 5
    const { data: update5Data, error: update5Error } = await supabase
      .from('landing_phones')
      .update({ updated_at: new Date().toISOString() })
      .eq('landing_number', 5)
      .select()
    
    if (update5Error) {
      console.error('❌ Error en UPDATE (Landing 5):', update5Error)
      console.error('🔍 Este es el problema específico con landings 5-9')
      return false
    }
    
    console.log('✅ UPDATE funciona en Landing 5')
    
    return true
    
  } catch (error) {
    console.error('❌ Error verificando permisos RLS:', error)
    return false
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 Ejecutando todas las pruebas...')
  
  // 1. Verificar configuración
  const configOk = checkSupabaseConfig()
  if (!configOk) return
  
  // 2. Verificar permisos RLS
  const rlsOk = await checkRLSPermissions()
  if (!rlsOk) {
    console.log('\n💡 Solución sugerida: Ejecuta el script diagnostico_completo_supabase.sql')
    return
  }
  
  // 3. Probar actualizaciones
  const results = await testAllProblematicLandings()
  
  return results
}

// Exportar funciones para uso manual
window.testLandingUpdate = testLandingUpdate
window.testAllProblematicLandings = testAllProblematicLandings
window.checkSupabaseConfig = checkSupabaseConfig
window.checkRLSPermissions = checkRLSPermissions
window.runAllTests = runAllTests

console.log(`
🧪 Script de pruebas cargado. Funciones disponibles:

1. runAllTests() - Ejecutar todas las pruebas
2. testLandingUpdate(5) - Probar landing específico
3. testAllProblematicLandings() - Probar landings 5-9
4. checkSupabaseConfig() - Verificar configuración
5. checkRLSPermissions() - Verificar permisos RLS

Ejecuta: runAllTests()
`)

// Auto-ejecutar si se desea
// runAllTests()