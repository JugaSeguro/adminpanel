/**
 * Script de prueba para verificar que las correcciones en los hooks funcionen
 * Ejecutar en la consola del navegador en cualquier landing
 */

// Función para probar la detección automática de landing
function testLandingDetection() {
  console.log('🔍 Probando detección automática de landing...');
  
  // Simular diferentes subdominios
  const testCases = [
    { hostname: 'landing5.example.com', expected: 5 },
    { hostname: 'landing9.example.com', expected: 9 },
    { hostname: 'landing1.example.com', expected: 1 },
    { hostname: 'other.example.com', expected: 1 } // fallback
  ];
  
  testCases.forEach(test => {
    // Simular el hostname
    Object.defineProperty(window.location, 'hostname', {
      writable: true,
      value: test.hostname
    });
    
    // Ejecutar la función de detección (copiada del hook)
    const detectLandingFromSubdomain = () => {
      const hostname = window.location.hostname;
      const match = hostname.match(/landing(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    };
    
    const result = detectLandingFromSubdomain();
    console.log(`  ${test.hostname} → Landing ${result} ${result === test.expected ? '✅' : '❌'}`);
  });
}

// Función para probar la consulta a Supabase
async function testSupabaseQuery(landingNumber) {
  console.log(`🔍 Probando consulta para landing ${landingNumber}...`);
  
  try {
    // Usar la configuración de Supabase del proyecto actual
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    
    const supabaseUrl = 'https://slrzlggigpiinswjfvxr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('landing_phones')
      .select('landing_number, individual_title, individual_whatsapp_link, use_individual_settings, is_active')
      .eq('landing_number', landingNumber)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return null;
    } else {
      console.log(`  ✅ Datos obtenidos:`, data);
      return data;
    }
  } catch (err) {
    console.log(`  ❌ Error de conexión: ${err.message}`);
    return null;
  }
}

// Función para probar todas las landings 5-9
async function testAllProblematicLandings() {
  console.log('🧪 Probando todas las landings problemáticas (5-9)...');
  
  for (let i = 5; i <= 9; i++) {
    await testSupabaseQuery(i);
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre consultas
  }
}

// Función para verificar el estado actual del hook en la página
function checkCurrentHookState() {
  console.log('🔍 Verificando estado actual del hook...');
  
  // Buscar elementos que muestren el título
  const titleElements = document.querySelectorAll('h1, .bonus-title h1, [class*="title"]');
  
  titleElements.forEach((el, index) => {
    console.log(`  Título ${index + 1}: "${el.textContent.trim()}"`);
  });
  
  // Verificar si hay errores en la consola
  const errors = window.console.error.toString();
  if (errors.includes('landing') || errors.includes('Supabase')) {
    console.log('  ⚠️ Posibles errores relacionados con landing/Supabase detectados');
  } else {
    console.log('  ✅ No se detectaron errores obvios');
  }
}

// Función principal de prueba
async function runAllTests() {
  console.log('🚀 Iniciando pruebas de corrección de hooks...\n');
  
  // 1. Probar detección de landing
  testLandingDetection();
  console.log('');
  
  // 2. Verificar estado actual
  checkCurrentHookState();
  console.log('');
  
  // 3. Probar consultas a Supabase
  await testAllProblematicLandings();
  console.log('');
  
  console.log('✅ Pruebas completadas. Revisa los resultados arriba.');
  console.log('💡 Si ves errores, es posible que necesites recargar la página para que los cambios surtan efecto.');
}

// Exportar funciones para uso manual
window.testHookFixes = {
  runAllTests,
  testLandingDetection,
  testSupabaseQuery,
  testAllProblematicLandings,
  checkCurrentHookState
};

console.log('📋 Script de prueba cargado. Ejecuta testHookFixes.runAllTests() para comenzar.');