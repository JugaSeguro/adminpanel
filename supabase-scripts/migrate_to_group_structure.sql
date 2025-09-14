-- Script de migración para optimizar la tabla existente
-- Convierte la estructura actual a gestión por grupos

-- 1. Agregar columna repository_group si no existe
ALTER TABLE public.landing_phones 
ADD COLUMN IF NOT EXISTS repository_group VARCHAR(50);

-- 2. Actualizar repository_group basado en landing_number
UPDATE public.landing_phones SET repository_group = CASE
    WHEN landing_number IN (1, 5, 7) THEN '1xclub-casinos'
    WHEN landing_number IN (2, 6, 8) THEN '1xclub-wsp'
    WHEN landing_number IN (3, 9) THEN '24envivo-casinos'
    WHEN landing_number IN (4, 10) THEN '24envivo-wsp'
    ELSE 'unknown'
END
WHERE repository_group IS NULL;

-- 3. Hacer repository_group NOT NULL después de actualizar
ALTER TABLE public.landing_phones 
ALTER COLUMN repository_group SET NOT NULL;

-- 4. Crear índice para repository_group
CREATE INDEX IF NOT EXISTS idx_landing_phones_repository_group 
ON public.landing_phones(repository_group);

-- 5. Eliminar columna phone_number ya que solo usamos whatsapp_link
ALTER TABLE public.landing_phones 
DROP COLUMN IF EXISTS phone_number;

-- 6. Hacer whatsapp_link NOT NULL ya que es el único campo necesario
ALTER TABLE public.landing_phones 
ALTER COLUMN whatsapp_link SET NOT NULL;

-- 7. Actualizar descripciones para que sean más claras por grupo
UPDATE public.landing_phones SET description = CASE
    WHEN repository_group = '1xclub-casinos' THEN '1xclub Casino - Landing ' || landing_number
    WHEN repository_group = '1xclub-wsp' THEN '1xclub WhatsApp - Landing ' || landing_number
    WHEN repository_group = '24envivo-casinos' THEN '24envivo Casino - Landing ' || landing_number
    WHEN repository_group = '24envivo-wsp' THEN '24envivo WhatsApp - Landing ' || landing_number
    ELSE description
END;

-- 8. Crear vista para facilitar consultas por grupo
CREATE OR REPLACE VIEW landing_phones_by_group AS
SELECT 
    repository_group,
    COUNT(*) as total_landings,
    COUNT(CASE WHEN is_active THEN 1 END) as active_landings,
    COUNT(CASE WHEN NOT is_active THEN 1 END) as inactive_landings,
    array_agg(landing_number ORDER BY landing_number) as landing_numbers,
    MAX(updated_at) as last_updated
FROM public.landing_phones
GROUP BY repository_group;

-- 9. Actualizar comentarios de la tabla
COMMENT ON TABLE public.landing_phones IS 'Tabla optimizada para gestión de enlaces WhatsApp por grupos de repositorio';
COMMENT ON COLUMN public.landing_phones.whatsapp_link IS 'Enlace directo de WhatsApp (único campo necesario)';
COMMENT ON COLUMN public.landing_phones.repository_group IS 'Grupo de repositorio (1xclub-casinos, 1xclub-wsp, 24envivo-casinos, 24envivo-wsp)';
COMMENT ON VIEW landing_phones_by_group IS 'Vista que agrupa información por repositorio para facilitar la gestión';

-- 10. Verificar la migración
SELECT 
    'Migración completada' as status,
    COUNT(*) as total_records,
    COUNT(DISTINCT repository_group) as total_groups
FROM public.landing_phones;

-- Mostrar resumen por grupo
SELECT * FROM landing_phones_by_group ORDER BY repository_group;