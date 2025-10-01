// SCRIPT DE PRUEBA PARA EJECUTAR EN LA CONSOLA DEL NAVEGADOR
// Abre el panel de administración, presiona F12 y pega este código

console.log('🔍 INICIANDO PRUEBAS DE ACTUALIZACIÓN DE LANDINGS 5-9');

// Función para probar actualización directa con Supabase
async function testDirectSupabaseUpdate() {
    console.log('\n📡 PROBANDO ACTUALIZACIÓN DIRECTA CON SUPABASE...');
    
    try {
        // Obtener el cliente de Supabase desde el contexto global o window
        const supabase = window.supabase || 
                        (window.React && window.React.useContext && 
                         document.querySelector('[data-supabase]')?.supabase);
        
        if (!supabase) {
            console.error('❌ No se pudo encontrar el cliente de Supabase');
            return false;
        }
        
        console.log('✅ Cliente de Supabase encontrado');
        
        // Probar actualización directa del landing 5
        const testData = {
            individual_title: `PRUEBA DIRECTA ${new Date().toISOString()}`,
            individual_whatsapp_link: 'https://wa.me/5491234567890',
            updated_at: new Date().toISOString()
        };
        
        console.log('📝 Datos de prueba:', testData);
        
        const { data, error } = await supabase
            .from('landing_phones')
            .update(testData)
            .eq('landing_number', 5)
            .select();
        
        if (error) {
            console.error('❌ Error en actualización directa:', error);
            return false;
        }
        
        console.log('✅ Actualización directa exitosa:', data);
        return true;
        
    } catch (err) {
        console.error('❌ Error en prueba directa:', err);
        return false;
    }
}

// Función para probar usando el hook useSupabase
async function testHookUpdate() {
    console.log('\n🎣 PROBANDO ACTUALIZACIÓN CON HOOK...');
    
    try {
        // Buscar el componente que usa useSupabase
        const reactFiberKey = Object.keys(document.querySelector('#root')).find(key => 
            key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
        );
        
        if (!reactFiberKey) {
            console.error('❌ No se pudo encontrar React Fiber');
            return false;
        }
        
        console.log('✅ React Fiber encontrado');
        
        // Intentar encontrar el contexto de Supabase
        const rootFiber = document.querySelector('#root')[reactFiberKey];
        
        // Esta es una aproximación - en un entorno real necesitarías acceso al hook
        console.log('⚠️ Prueba de hook requiere acceso directo al componente');
        return true;
        
    } catch (err) {
        console.error('❌ Error en prueba de hook:', err);
        return false;
    }
}

// Función para verificar el estado actual de los landings
async function checkCurrentState() {
    console.log('\n📊 VERIFICANDO ESTADO ACTUAL...');
    
    try {
        const supabase = window.supabase;
        if (!supabase) {
            console.error('❌ Cliente de Supabase no disponible');
            return;
        }
        
        const { data, error } = await supabase
            .from('landing_phones')
            .select('*')
            .in('landing_number', [5, 6, 7, 8, 9])
            .order('landing_number');
        
        if (error) {
            console.error('❌ Error al obtener estado:', error);
            return;
        }
        
        console.log('📋 Estado actual de landings 5-9:');
        data.forEach(landing => {
            console.log(`Landing ${landing.landing_number}:`, {
                title: landing.individual_title,
                link: landing.individual_whatsapp_link,
                active: landing.is_active,
                updated: landing.updated_at
            });
        });
        
    } catch (err) {
        console.error('❌ Error al verificar estado:', err);
    }
}

// Función para probar todas las actualizaciones
async function testAllLandings() {
    console.log('\n🚀 PROBANDO ACTUALIZACIÓN DE TODOS LOS LANDINGS 5-9...');
    
    const landings = [5, 6, 7, 8, 9];
    const results = [];
    
    for (const landingNum of landings) {
        try {
            const testData = {
                individual_title: `Prueba Landing ${landingNum} - ${new Date().toLocaleTimeString()}`,
                individual_whatsapp_link: `https://wa.me/549123456789${landingNum}`,
                updated_at: new Date().toISOString()
            };
            
            const supabase = window.supabase;
            const { data, error } = await supabase
                .from('landing_phones')
                .update(testData)
                .eq('landing_number', landingNum)
                .select();
            
            if (error) {
                console.error(`❌ Error en landing ${landingNum}:`, error);
                results.push({ landing: landingNum, success: false, error });
            } else {
                console.log(`✅ Landing ${landingNum} actualizado:`, data);
                results.push({ landing: landingNum, success: true, data });
            }
            
            // Pausa entre actualizaciones
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (err) {
            console.error(`❌ Excepción en landing ${landingNum}:`, err);
            results.push({ landing: landingNum, success: false, error: err });
        }
    }
    
    console.log('\n📊 RESUMEN DE RESULTADOS:');
    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} Landing ${result.landing}: ${result.success ? 'ÉXITO' : 'FALLO'}`);
    });
    
    return results;
}

// Función para verificar la configuración de Supabase
function checkSupabaseConfig() {
    console.log('\n⚙️ VERIFICANDO CONFIGURACIÓN DE SUPABASE...');
    
    try {
        const supabase = window.supabase;
        if (!supabase) {
            console.error('❌ Cliente de Supabase no encontrado en window.supabase');
            return;
        }
        
        console.log('✅ Cliente de Supabase disponible');
        console.log('🔗 URL:', supabase.supabaseUrl);
        console.log('🔑 Key (primeros 20 chars):', supabase.supabaseKey?.substring(0, 20) + '...');
        
        // Verificar si hay variables de entorno disponibles
        if (typeof import !== 'undefined' && import.meta && import.meta.env) {
            console.log('🌍 Variables de entorno:');
            console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
            console.log('  VITE_SUPABASE_ANON_KEY (primeros 20):', 
                       import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
        }
        
    } catch (err) {
        console.error('❌ Error al verificar configuración:', err);
    }
}

// Función principal para ejecutar todas las pruebas
async function runAllTests() {
    console.log('🎯 EJECUTANDO TODAS LAS PRUEBAS...\n');
    
    // 1. Verificar configuración
    checkSupabaseConfig();
    
    // 2. Verificar estado actual
    await checkCurrentState();
    
    // 3. Probar actualización directa
    await testDirectSupabaseUpdate();
    
    // 4. Probar todas las actualizaciones
    await testAllLandings();
    
    // 5. Verificar estado final
    console.log('\n🔍 ESTADO FINAL:');
    await checkCurrentState();
    
    console.log('\n✨ PRUEBAS COMPLETADAS');
}

// Exportar funciones para uso manual
window.testLandingUpdates = {
    runAllTests,
    testDirectSupabaseUpdate,
    testHookUpdate,
    checkCurrentState,
    testAllLandings,
    checkSupabaseConfig
};

console.log(`
🎯 FUNCIONES DISPONIBLES:
- runAllTests() - Ejecuta todas las pruebas
- testLandingUpdates.checkCurrentState() - Ver estado actual
- testLandingUpdates.testAllLandings() - Probar actualizaciones
- testLandingUpdates.checkSupabaseConfig() - Ver configuración

💡 PARA EMPEZAR: Ejecuta runAllTests()
`);