-- Script de diagnóstico para landings 5-9
-- Verificar por qué no se actualizan los landings 5, 6, 7, 8, 9

-- 1. Verificar que existen los registros para landings 5-9
SELECT 
    'Verificación de existencia' as check_type,
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
WHERE landing_number IN (5, 6, 7, 8, 9)
ORDER BY landing_number;

-- 2. Verificar todos los registros de la tabla
SELECT 
    'Todos los registros' as check_type,
    landing_number, 
    repository_group, 
    description,
    whatsapp_link,
    is_active,
    updated_at
FROM landing_phones 
ORDER BY landing_number;

-- 3. Verificar permisos RLS (Row Level Security)
SELECT 
    'Información de tabla' as check_type,
    schemaname,
    tablename,
    rowsecurity,
    hasrls
FROM pg_tables 
WHERE tablename = 'landing_phones';

-- 4. Verificar políticas RLS activas
SELECT 
    'Políticas RLS' as check_type,
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

-- 5. Verificar estructura de la tabla
SELECT 
    'Estructura de tabla' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'landing_phones'
ORDER BY ordinal_position;

-- 6. Intentar actualización de prueba en landing 5
UPDATE landing_phones 
SET 
    description = 'TEST - Landing 5 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 5
RETURNING 
    landing_number,
    description,
    updated_at;

-- 7. Verificar si la actualización funcionó
SELECT 
    'Verificación post-actualización' as check_type,
    landing_number, 
    description,
    updated_at
FROM landing_phones 
WHERE landing_number = 5;

-- 8. Verificar logs de errores (si están disponibles)
-- Nota: Esto puede no funcionar en todos los entornos de Supabase
SELECT 
    'Información de sesión' as check_type,
    current_user as usuario_actual,
    session_user as usuario_sesion,
    current_database() as base_datos_actual;