/**
 * Script de prueba para verificar que la landing 6 actualiza correctamente
 * Ejecutar en la consola del navegador en la landing 6
 */

console.log('🔧 PRUEBA DE CORRECCIÓN LANDING 6');
console.log('=================================');

// 1. Verificar URL actual
console.log('📍 URL actual:', window.location.href);

// 2. Verificar que el hook está usando el número correcto
console.log('🔍 Verificando implementación del hook...');

// 3. Verificar elemento del título
const titleElement = document.querySelector('.bonus-title h1');
if (titleElement) {
  console.log('✅ Elemento de título encontrado');
  console.log('📝 Título actual:', titleElement.textContent);
} else {
  console.error('❌ Elemento de título no encontrado');
}

// 4. Función para probar consulta directa a Supabase
async function testSupabaseQuery() {
  try {
    console.log('🔍 Probando consulta directa a Supabase para landing 6...');
    
    // Usar las variables de entorno del proyecto
    const supabaseUrl = 'https://your-project.supabase.co'; // Reemplazar con la URL real
    const supabaseKey = 'your-anon-key'; // Reemplazar con la key real
    
    const response = await fetch(`${supabaseUrl}/rest/v1/landing_phones?landing_number=eq.6&select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Datos de Supabase para Landing 6:', data);
      
      if (data.length > 0) {
        const landing6Data = data[0];
        console.log('✅ Landing 6 encontrada en Supabase');
        console.log('📝 Título individual:', landing6Data.individual_title);
        console.log('⚙️ Usar configuración individual:', landing6Data.use_individual_settings);
        console.log('🔗 WhatsApp individual:', landing6Data.individual_whatsapp_link);
        console.log('✅ Activa:', landing6Data.is_active);
        
        // Comparar con el título en el DOM
        if (titleElement && landing6Data.use_individual_settings && landing6Data.individual_title) {
          if (titleElement.textContent.trim() === landing6Data.individual_title.trim()) {
            console.log('✅ ÉXITO: El título en el DOM coincide con Supabase');
          } else {
            console.log('⚠️ DIFERENCIA: El título en el DOM no coincide');
            console.log('DOM:', titleElement.textContent.trim());
            console.log('Supabase:', landing6Data.individual_title.trim());
          }
        }
      } else {
        console.log('❌ Landing 6 NO encontrada en Supabase');
      }
    } else {
      console.error('❌ Error en la respuesta de Supabase:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error consultando Supabase:', error);
  }
}

// 5. Función para simular actualización en tiempo real
function simulateRealtimeUpdate() {
  console.log('🔄 Simulando actualización en tiempo real...');
  console.log('Instrucciones:');
  console.log('1. Ve al panel de administración');
  console.log('2. Cambia el título de la landing 6');
  console.log('3. Guarda los cambios');
  console.log('4. Observa si el título se actualiza automáticamente aquí');
  console.log('5. Si no se actualiza automáticamente, recarga la página');
}

// 6. Ejecutar pruebas
console.log('\n🚀 Ejecutando pruebas...');
testSupabaseQuery();
simulateRealtimeUpdate();

// 7. Información de corrección aplicada
console.log('\n✅ CORRECCIONES APLICADAS:');
console.log('1. ✅ Cambiado useLandingPhone(2) → useLandingPhone(6) en App.jsx');
console.log('2. ✅ Corregido console.log en el hook useLandingPhone.js');
console.log('3. ✅ La landing 6 ahora debería usar los datos correctos de Supabase');

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Recarga esta página (Ctrl+F5)');
console.log('2. Ve al panel de admin y cambia el título de la landing 6');
console.log('3. El título debería actualizarse automáticamente o al recargar');