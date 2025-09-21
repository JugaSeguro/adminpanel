-- Migración para separar landings 5 y 6 en grupos de publicidad
-- Fecha: $(date)
-- Descripción: Actualiza la estructura para mover landing 5 a 1xclub-publicidad-casinos y landing 6 a 1xclub-publicidad-wsp

BEGIN;

-- 1. Verificar registros existentes
SELECT 
    landing_number, 
    repository_group, 
    description,
    whatsapp_link,
    is_active
FROM landing_phones 
WHERE landing_number IN (5, 6)
ORDER BY landing_number;

-- 2. Actualizar landing 5 para el grupo de publicidad casino
UPDATE landing_phones 
SET 
    repository_group = '1xclub-publicidad-casinos',
    description = '1xclub Publicidad Casino - Landing 5',
    updated_at = NOW()
WHERE landing_number = 5;

-- 3. Actualizar landing 6 para el grupo de publicidad WhatsApp
UPDATE landing_phones 
SET 
    repository_group = '1xclub-publicidad-wsp',
    description = '1xclub Publicidad WhatsApp - Landing 6',
    updated_at = NOW()
WHERE landing_number = 6;

-- 4. Insertar registros si no existen (por si acaso)
INSERT INTO landing_phones (
    landing_number, 
    repository_group, 
    description, 
    whatsapp_link, 
    is_active,
    individual_title,
    individual_whatsapp_link,
    use_individual_settings
) VALUES 
(5, '1xclub-publicidad-casinos', '1xclub Publicidad Casino - Landing 5', 'https://wa.me/5491234567890', true, 'Casino Publicidad 5', '', false),
(6, '1xclub-publicidad-wsp', '1xclub Publicidad WhatsApp - Landing 6', 'https://wa.me/5491234567890', true, 'WhatsApp Publicidad 6', '', false)
ON CONFLICT (landing_number) DO NOTHING;

-- 5. Actualizar la vista landing_phones_by_group si existe
DROP VIEW IF EXISTS landing_phones_by_group;

CREATE VIEW landing_phones_by_group AS
SELECT 
    repository_group,
    COUNT(*) as total_landings,
    array_agg(landing_number ORDER BY landing_number) as landing_numbers,
    array_agg(description ORDER BY landing_number) as descriptions,
    MAX(updated_at) as last_updated
FROM landing_phones 
WHERE is_active = true
GROUP BY repository_group
ORDER BY repository_group;

-- 6. Verificar los cambios
SELECT 
    'Verificación final' as status,
    landing_number, 
    repository_group, 
    description,
    is_active
FROM landing_phones 
WHERE landing_number IN (5, 6)
ORDER BY landing_number;

-- 7. Mostrar resumen por grupos
SELECT 
    repository_group,
    array_agg(landing_number ORDER BY landing_number) as landings,
    COUNT(*) as total
FROM landing_phones 
WHERE is_active = true
GROUP BY repository_group
ORDER BY repository_group;

-- 8. Comentarios sobre la migración
COMMENT ON TABLE landing_phones IS 'Tabla de teléfonos/enlaces de WhatsApp por landing. Actualizada para incluir grupos de publicidad separados.';

COMMIT;

-- Instrucciones post-migración:
-- 1. Verificar que los registros se actualizaron correctamente
-- 2. Probar la funcionalidad en el panel de administración
-- 3. Verificar que las landings 5 y 6 aparecen en sus nuevos grupos
-- 4. Confirmar que las actualizaciones se reflejan en la interfaz