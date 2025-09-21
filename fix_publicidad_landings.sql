-- Script de verificación y corrección para landings de publicidad
-- Asegura que todas las landings 1-10 estén correctamente configuradas

BEGIN;

-- 1. Verificar estado actual de todas las landings
SELECT 
    'Estado actual de todas las landings' as info,
    landing_number, 
    repository_group, 
    description,
    whatsapp_link,
    is_active,
    use_individual_settings
FROM landing_phones 
ORDER BY landing_number;

-- 2. Insertar o actualizar todas las landings con la configuración correcta
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
-- Grupo 1xclub-casinos (1, 7)
(1, '1xclub-casinos', '1xclub Casino - Landing 1', 'https://wa.me/5491234567890', true, 'Casino Landing 1', '', false, NOW(), NOW()),
(7, '1xclub-casinos', '1xclub Casino - Landing 7', 'https://wa.me/5491234567890', true, 'Casino Landing 7', '', false, NOW(), NOW()),

-- Grupo 1xclub-wsp (2, 8)
(2, '1xclub-wsp', '1xclub WhatsApp - Landing 2', 'https://wa.me/5491234567890', true, 'WhatsApp Landing 2', '', false, NOW(), NOW()),
(8, '1xclub-wsp', '1xclub WhatsApp - Landing 8', 'https://wa.me/5491234567890', true, 'WhatsApp Landing 8', '', false, NOW(), NOW()),

-- Grupo 24envivo-casinos (3, 9)
(3, '24envivo-casinos', '24envivo Casino - Landing 3', 'https://wa.me/5491234567890', true, 'Casino Landing 3', '', false, NOW(), NOW()),
(9, '24envivo-casinos', '24envivo Casino - Landing 9', 'https://wa.me/5491234567890', true, 'Casino Landing 9', '', false, NOW(), NOW()),

-- Grupo 24envivo-wsp (4, 10)
(4, '24envivo-wsp', '24envivo WhatsApp - Landing 4', 'https://wa.me/5491234567890', true, 'WhatsApp Landing 4', '', false, NOW(), NOW()),
(10, '24envivo-wsp', '24envivo WhatsApp - Landing 10', 'https://wa.me/5491234567890', true, 'WhatsApp Landing 10', '', false, NOW(), NOW()),

-- Nuevos grupos de publicidad
(5, '1xclub-publicidad-casinos', '1xclub Publicidad Casino - Landing 5', 'https://wa.me/5491234567890', true, 'Publicidad Casino 5', '', false, NOW(), NOW()),
(6, '1xclub-publicidad-wsp', '1xclub Publicidad WhatsApp - Landing 6', 'https://wa.me/5491234567890', true, 'Publicidad WhatsApp 6', '', false, NOW(), NOW())

ON CONFLICT (landing_number) DO UPDATE SET
    repository_group = EXCLUDED.repository_group,
    description = EXCLUDED.description,
    updated_at = NOW();

-- 3. Verificar que todas las landings están presentes
SELECT 
    'Verificación: Landings faltantes' as info,
    generate_series(1, 10) as expected_landing
WHERE generate_series(1, 10) NOT IN (
    SELECT landing_number FROM landing_phones WHERE is_active = true
);

-- 4. Mostrar configuración final por grupos
SELECT 
    'Configuración final por grupos' as info,
    repository_group,
    array_agg(landing_number ORDER BY landing_number) as landings,
    COUNT(*) as total_landings,
    MAX(updated_at) as last_updated
FROM landing_phones 
WHERE is_active = true
GROUP BY repository_group
ORDER BY repository_group;

-- 5. Verificar específicamente landings 5 y 6
SELECT 
    'Verificación específica landings 5 y 6' as info,
    landing_number,
    repository_group,
    description,
    individual_title,
    is_active
FROM landing_phones 
WHERE landing_number IN (5, 6)
ORDER BY landing_number;

-- 6. Recrear la vista optimizada
DROP VIEW IF EXISTS landing_phones_by_group;

CREATE VIEW landing_phones_by_group AS
SELECT 
    repository_group,
    COUNT(*) as total_landings,
    array_agg(landing_number ORDER BY landing_number) as landing_numbers,
    array_agg(description ORDER BY landing_number) as descriptions,
    string_agg(DISTINCT whatsapp_link, ', ') as whatsapp_links,
    MAX(updated_at) as last_updated,
    bool_and(is_active) as all_active
FROM landing_phones 
GROUP BY repository_group
ORDER BY repository_group;

-- 7. Verificación final completa
SELECT 
    'Resumen final' as info,
    COUNT(*) as total_landings,
    COUNT(CASE WHEN is_active THEN 1 END) as active_landings,
    COUNT(DISTINCT repository_group) as total_groups
FROM landing_phones;

COMMIT;

-- Mensaje de éxito
SELECT 'Migración completada exitosamente. Todas las landings están configuradas correctamente.' as resultado;