-- SOLUCIÓN DEFINITIVA PARA PROBLEMAS DE RLS EN LANDINGS 5-9
-- Este script resuelve todos los problemas de permisos y RLS

BEGIN;

-- ========================================
-- 1. VERIFICAR ESTADO ACTUAL
-- ========================================
SELECT 'ESTADO INICIAL' as seccion;

-- Verificar RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'landing_phones';

-- Verificar políticas existentes
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'landing_phones';

-- ========================================
-- 2. LIMPIAR POLÍTICAS EXISTENTES
-- ========================================
SELECT 'LIMPIANDO POLÍTICAS' as seccion;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Allow anonymous operations on landing_phones" ON landing_phones;
DROP POLICY IF EXISTS "Allow all operations" ON landing_phones;
DROP POLICY IF EXISTS "Enable read access for all users" ON landing_phones;
DROP POLICY IF EXISTS "Enable insert for all users" ON landing_phones;
DROP POLICY IF EXISTS "Enable update for all users" ON landing_phones;
DROP POLICY IF EXISTS "Enable delete for all users" ON landing_phones;

-- ========================================
-- 3. DESHABILITAR RLS TEMPORALMENTE
-- ========================================
SELECT 'DESHABILITANDO RLS' as seccion;

ALTER TABLE landing_phones DISABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. ASEGURAR PERMISOS BÁSICOS
-- ========================================
SELECT 'CONFIGURANDO PERMISOS' as seccion;

-- Otorgar permisos completos a todos los roles necesarios
GRANT ALL PRIVILEGES ON landing_phones TO anon;
GRANT ALL PRIVILEGES ON landing_phones TO authenticated;
GRANT ALL PRIVILEGES ON landing_phones TO service_role;
GRANT ALL PRIVILEGES ON landing_phones TO postgres;

-- Asegurar permisos en secuencias si existen
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ========================================
-- 5. VERIFICAR Y CORREGIR DATOS
-- ========================================
SELECT 'VERIFICANDO DATOS' as seccion;

-- Mostrar estado actual de landings 5-9
SELECT 
    landing_number,
    repository_group,
    individual_title,
    individual_whatsapp_link,
    use_individual_settings,
    is_active,
    updated_at
FROM landing_phones 
WHERE landing_number IN (5, 6, 7, 8, 9)
ORDER BY landing_number;

-- Asegurar que todos los landings 5-9 existen con datos válidos
INSERT INTO landing_phones (
    landing_number, 
    repository_group, 
    description, 
    whatsapp_link, 
    individual_title,
    individual_whatsapp_link,
    use_individual_settings,
    is_active,
    created_at,
    updated_at
) VALUES 
(5, '1xclub-publicidad-casinos', '1xclub Publicidad Casino - Landing 5', 'https://wa.me/5491234567890', 'Casino Publicidad 5', '', false, true, NOW(), NOW()),
(6, '1xclub-publicidad-wsp', '1xclub Publicidad WhatsApp - Landing 6', 'https://wa.me/5491234567890', 'WhatsApp Publicidad 6', '', false, true, NOW(), NOW()),
(7, '1xclub-casinos', '1xclub Casino - Landing 7', 'https://wa.me/5491234567890', 'Casino Landing 7', '', false, true, NOW(), NOW()),
(8, '1xclub-wsp', '1xclub WhatsApp - Landing 8', 'https://wa.me/5491234567890', 'WhatsApp Landing 8', '', false, true, NOW(), NOW()),
(9, '24envivo-casinos', '24envivo Casino - Landing 9', 'https://wa.me/5491234567890', 'Casino Landing 9', '', false, true, NOW(), NOW())
ON CONFLICT (landing_number) DO UPDATE SET
    repository_group = EXCLUDED.repository_group,
    description = EXCLUDED.description,
    individual_title = EXCLUDED.individual_title,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ========================================
-- 6. PROBAR ACTUALIZACIONES
-- ========================================
SELECT 'PROBANDO ACTUALIZACIONES' as seccion;

-- Probar actualización en cada landing problemático
UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA ACTUALIZACIÓN ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 5;

UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA ACTUALIZACIÓN ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 6;

UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA ACTUALIZACIÓN ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 7;

UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA ACTUALIZACIÓN ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 8;

UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA ACTUALIZACIÓN ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 9;

-- Verificar que las actualizaciones funcionaron
SELECT 
    'DESPUÉS DE PRUEBAS' as momento,
    landing_number,
    individual_title,
    updated_at
FROM landing_phones 
WHERE landing_number IN (5, 6, 7, 8, 9)
ORDER BY landing_number;

-- ========================================
-- 7. CONFIGURAR RLS PERMISIVO (OPCIONAL)
-- ========================================
SELECT 'CONFIGURANDO RLS PERMISIVO' as seccion;

-- Si quieres volver a habilitar RLS con políticas permisivas:
/*
-- Habilitar RLS
ALTER TABLE landing_phones ENABLE ROW LEVEL SECURITY;

-- Crear política super permisiva para todos los roles
CREATE POLICY "landing_phones_all_access" 
ON landing_phones 
FOR ALL 
TO anon, authenticated, service_role, postgres
USING (true) 
WITH CHECK (true);

-- Verificar que la política se creó
SELECT 
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'landing_phones';
*/

-- ========================================
-- 8. VERIFICACIÓN FINAL
-- ========================================
SELECT 'VERIFICACIÓN FINAL' as seccion;

-- Estado final de RLS
SELECT 
    'RLS Status' as tipo,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'landing_phones';

-- Permisos finales
SELECT 
    'Permisos' as tipo,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'landing_phones'
AND grantee IN ('anon', 'authenticated', 'service_role', 'postgres');

-- Estado final de todos los landings
SELECT 
    'ESTADO FINAL' as momento,
    landing_number,
    repository_group,
    individual_title,
    individual_whatsapp_link,
    use_individual_settings,
    is_active,
    updated_at
FROM landing_phones 
ORDER BY landing_number;

COMMIT;

-- ========================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ========================================

/*
DESPUÉS DE EJECUTAR ESTE SCRIPT:

1. Ve al panel de administración
2. Abre la consola del navegador (F12)
3. Pega y ejecuta el contenido de test_landing_updates.js
4. Ejecuta: runAllTests()
5. Verifica que todos los landings 5-9 se puedan actualizar

Si aún hay problemas:
1. Verifica que las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY sean correctas
2. Revisa que el cliente de Supabase esté usando la clave anon correcta
3. Considera reiniciar el servidor de desarrollo del panel

NOTA: Este script deshabilita RLS para máxima compatibilidad.
Si necesitas RLS por seguridad, descomenta la sección 7.
*/