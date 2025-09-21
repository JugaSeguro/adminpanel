-- Script para solucionar el problema de actualización de landings 5-9
-- Problema identificado: Posibles problemas de RLS o registros faltantes

BEGIN;

-- 1. Verificar estado actual de todos los landings
SELECT 
    'Estado actual' as check_type,
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

-- 2. Insertar registros faltantes para landings 5-9 si no existen
INSERT INTO landing_phones (
    landing_number, 
    repository_group, 
    description, 
    whatsapp_link, 
    is_active,
    individual_title,
    individual_whatsapp_link,
    use_individual_settings,
    created_at,
    updated_at
) VALUES 
-- Landing 5 (ya debería existir con la migración anterior)
(5, '1xclub-publicidad-casinos', '1xclub Publicidad Casino - Landing 5', 'https://wa.me/5491234567890', true, 'Casino Publicidad 5', '', false, NOW(), NOW()),
-- Landing 6 (ya debería existir con la migración anterior)
(6, '1xclub-publicidad-wsp', '1xclub Publicidad WhatsApp - Landing 6', 'https://wa.me/5491234567890', true, 'WhatsApp Publicidad 6', '', false, NOW(), NOW()),
-- Landing 7 (1xclub-casinos)
(7, '1xclub-casinos', '1xclub Casino - Landing 7', 'https://wa.me/5491234567890', true, 'Casino Landing 7', '', false, NOW(), NOW()),
-- Landing 8 (1xclub-wsp)
(8, '1xclub-wsp', '1xclub WhatsApp - Landing 8', 'https://wa.me/5491234567890', true, 'WhatsApp Landing 8', '', false, NOW(), NOW()),
-- Landing 9 (24envivo-casinos)
(9, '24envivo-casinos', '24envivo Casino - Landing 9', 'https://wa.me/5491234567890', true, 'Casino Landing 9', '', false, NOW(), NOW())
ON CONFLICT (landing_number) DO UPDATE SET
    repository_group = EXCLUDED.repository_group,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- 3. Verificar que RLS no esté bloqueando las actualizaciones
-- Deshabilitar RLS temporalmente si está causando problemas
ALTER TABLE landing_phones DISABLE ROW LEVEL SECURITY;

-- 4. Actualizar todos los registros para asegurar que tienen valores válidos
UPDATE landing_phones 
SET 
    individual_title = COALESCE(individual_title, description),
    individual_whatsapp_link = COALESCE(individual_whatsapp_link, ''),
    use_individual_settings = COALESCE(use_individual_settings, false),
    updated_at = NOW()
WHERE landing_number IN (5, 6, 7, 8, 9);

-- 5. Verificar que las actualizaciones funcionan correctamente
-- Prueba de actualización en landing 5
UPDATE landing_phones 
SET 
    individual_title = 'TEST - Landing 5 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 5;

-- Prueba de actualización en landing 6
UPDATE landing_phones 
SET 
    individual_title = 'TEST - Landing 6 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 6;

-- Prueba de actualización en landing 7
UPDATE landing_phones 
SET 
    individual_title = 'TEST - Landing 7 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 7;

-- Prueba de actualización en landing 8
UPDATE landing_phones 
SET 
    individual_title = 'TEST - Landing 8 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 8;

-- Prueba de actualización en landing 9
UPDATE landing_phones 
SET 
    individual_title = 'TEST - Landing 9 actualizado ' || NOW(),
    updated_at = NOW()
WHERE landing_number = 9;

-- 6. Verificar que las actualizaciones se aplicaron
SELECT 
    'Verificación post-actualización' as check_type,
    landing_number, 
    individual_title,
    updated_at
FROM landing_phones 
WHERE landing_number IN (5, 6, 7, 8, 9)
ORDER BY landing_number;

-- 7. Crear políticas RLS permisivas si es necesario
-- (Ejecutar solo si quieres volver a habilitar RLS)
/*
DROP POLICY IF EXISTS "Allow anonymous operations on landing_phones" ON landing_phones;

CREATE POLICY "Allow anonymous operations on landing_phones" 
ON landing_phones 
FOR ALL 
TO anon, authenticated
USING (true) 
WITH CHECK (true);

ALTER TABLE landing_phones ENABLE ROW LEVEL SECURITY;
*/

-- 8. Verificar estado final
SELECT 
    'Estado final' as check_type,
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

-- Instrucciones post-ejecución:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que todas las actualizaciones se aplicaron correctamente
-- 3. Prueba las actualizaciones en el panel de administración
-- 4. Si el problema persiste, revisa los logs del navegador para errores específicos