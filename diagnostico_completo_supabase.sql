-- DIAGNÓSTICO COMPLETO DE SUPABASE
-- Script para verificar toda la configuración actual

-- ========================================
-- 1. VERIFICAR ESTRUCTURA DE LA TABLA
-- ========================================
SELECT 'ESTRUCTURA DE TABLA' as seccion;

 landing_phones;

-- ========================================
-- 2. VERIFICAR TODOS LOS REGISTROS ACTUALES
-- ========================================
SELECT 'TODOS LOS REGISTROS' as seccion;

SELECT 
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
FROM landing_phones 
ORDER BY landing_number;

-- ========================================
-- 3. VERIFICAR ESTADO DE RLS
-- ========================================
SELECT 'ESTADO RLS' as seccion;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'landing_phones';

-- ========================================
-- 4. VERIFICAR POLÍTICAS RLS ACTIVAS
-- ========================================
SELECT 'POLÍTICAS RLS' as seccion;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'landing_phones';

-- ========================================
-- 5. VERIFICAR PERMISOS DE TABLA
-- ========================================
SELECT 'PERMISOS DE TABLA' as seccion;

SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'landing_phones';

-- ========================================
-- 6. VERIFICAR ROLES Y USUARIOS
-- ========================================
SELECT 'ROLES DISPONIBLES' as seccion;

SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres');

-- ========================================
-- 7. PROBAR OPERACIONES COMO USUARIO ANÓNIMO
-- ========================================
SELECT 'PRUEBA COMO ANON' as seccion;

-- Simular contexto de usuario anónimo
SET ROLE anon;

-- Intentar SELECT
SELECT 'SELECT como anon' as operacion, COUNT(*) as registros
FROM landing_phones;

-- Intentar UPDATE (esto debería fallar si RLS está mal configurado)
BEGIN;
UPDATE landing_phones 
SET individual_title = 'PRUEBA ANON ' || NOW()
WHERE landing_number = 5;
ROLLBACK;

-- Volver al rol original
RESET ROLE;

-- ========================================
-- 8. PROBAR OPERACIONES COMO USUARIO AUTENTICADO
-- ========================================
SELECT 'PRUEBA COMO AUTHENTICATED' as seccion;

-- Simular contexto de usuario autenticado
SET ROLE authenticated;

-- Intentar SELECT
SELECT 'SELECT como authenticated' as operacion, COUNT(*) as registros
FROM landing_phones;

-- Intentar UPDATE
BEGIN;
UPDATE landing_phones 
SET individual_title = 'PRUEBA AUTH ' || NOW()
WHERE landing_number = 5;
ROLLBACK;

-- Volver al rol original
RESET ROLE;

-- ========================================
-- 9. VERIFICAR CONFIGURACIÓN DE SUPABASE
-- ========================================
SELECT 'CONFIGURACIÓN SUPABASE' as seccion;

-- Verificar extensiones instaladas
SELECT 
    name,
    installed_version,
    comment
FROM pg_available_extensions 
WHERE name IN ('supabase_vault', 'pgsodium', 'pg_graphql');

-- ========================================
-- 10. VERIFICAR TRIGGERS Y FUNCIONES
-- ========================================
SELECT 'TRIGGERS EN TABLA' as seccion;

SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'landing_phones';

-- ========================================
-- 11. VERIFICAR ÍNDICES
-- ========================================
SELECT 'ÍNDICES DE TABLA' as seccion;

SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'landing_phones';

-- ========================================
-- 12. PRUEBA DE ACTUALIZACIÓN REAL
-- ========================================
SELECT 'PRUEBA ACTUALIZACIÓN REAL' as seccion;

-- Guardar estado actual del landing 5
CREATE TEMP TABLE backup_landing_5 AS 
SELECT * FROM landing_phones WHERE landing_number = 5;

-- Intentar actualización
UPDATE landing_phones 
SET 
    individual_title = 'PRUEBA REAL ' || NOW(),
    individual_whatsapp_link = 'https://wa.me/test',
    updated_at = NOW()
WHERE landing_number = 5;

-- Verificar si se aplicó
SELECT 
    'Después de UPDATE' as momento,
    landing_number,
    individual_title,
    individual_whatsapp_link,
    updated_at
FROM landing_phones 
WHERE landing_number = 5;

-- Restaurar estado original
UPDATE landing_phones 
SET 
    individual_title = (SELECT individual_title FROM backup_landing_5),
    individual_whatsapp_link = (SELECT individual_whatsapp_link FROM backup_landing_5),
    updated_at = (SELECT updated_at FROM backup_landing_5)
WHERE landing_number = 5;

-- ========================================
-- 13. VERIFICAR CONFIGURACIÓN DE CONEXIÓN
-- ========================================
SELECT 'INFORMACIÓN DE CONEXIÓN' as seccion;

SELECT 
    current_user as usuario_actual,
    session_user as usuario_sesion,
    current_database() as base_datos,
    inet_server_addr() as ip_servidor,
    inet_server_port() as puerto_servidor,
    version() as version_postgresql;

-- ========================================
-- 14. VERIFICAR CONFIGURACIÓN DE PARÁMETROS
-- ========================================
SELECT 'PARÁMETROS IMPORTANTES' as seccion;

SELECT 
    name,
    setting,
    unit,
    context
FROM pg_settings 
WHERE name IN (
    'log_statement',
    'log_min_messages',
    'row_security',
    'shared_preload_libraries'
);

-- ========================================
-- 15. VERIFICAR LOGS DE ERRORES RECIENTES
-- ========================================
SELECT 'VERIFICACIÓN FINAL' as seccion;

-- Mostrar información de la sesión actual
SELECT 
    'Información de sesión' as tipo,
    current_timestamp as timestamp_actual,
    current_user as usuario,
    current_database() as database;

-- ========================================
-- COMANDOS DE CORRECCIÓN SUGERIDOS
-- ========================================

/*
-- Si RLS está causando problemas, ejecutar:
ALTER TABLE landing_phones DISABLE ROW LEVEL SECURITY;

-- O crear políticas más permisivas:
DROP POLICY IF EXISTS "Allow all operations" ON landing_phones;
CREATE POLICY "Allow all operations" 
ON landing_phones 
FOR ALL 
TO anon, authenticated, service_role
USING (true) 
WITH CHECK (true);

-- Asegurar permisos básicos:
GRANT ALL ON landing_phones TO anon;
GRANT ALL ON landing_phones TO authenticated;
GRANT ALL ON landing_phones TO service_role;

-- Si hay problemas con secuencias:
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
*/