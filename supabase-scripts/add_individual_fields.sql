-- Script para añadir campos individuales a la tabla landing_phones
-- Esto permite gestionar cada landing (1-10) de forma independiente

-- Añadir nuevas columnas para gestión individual
ALTER TABLE landing_phones 
ADD COLUMN IF NOT EXISTS individual_title TEXT,
ADD COLUMN IF NOT EXISTS individual_whatsapp_link TEXT,
ADD COLUMN IF NOT EXISTS use_individual_settings BOOLEAN DEFAULT false;

-- Crear índice para mejorar rendimiento en consultas por landing_number
CREATE INDEX IF NOT EXISTS idx_landing_phones_landing_number 
ON landing_phones(landing_number);

-- Crear índice para consultas por configuración individual
CREATE INDEX IF NOT EXISTS idx_landing_phones_individual_settings 
ON landing_phones(use_individual_settings);

-- Insertar datos iniciales para los 10 landings individuales si no existen
INSERT INTO landing_phones (landing_number, individual_title, individual_whatsapp_link, use_individual_settings, repository_group, whatsapp_link, description, is_active)
SELECT 
    generate_series(1, 10) as landing_number,
    'Casino Landing ' || generate_series(1, 10) as individual_title,
    'https://wa.me/1234567890?text=Hola%20desde%20landing%20' || generate_series(1, 10) as individual_whatsapp_link,
    false as use_individual_settings,
    'grupo1' as repository_group,
    'https://wa.me/1234567890' as whatsapp_link,
    'Landing individual ' || generate_series(1, 10) as description,
    true as is_active
WHERE NOT EXISTS (
    SELECT 1 FROM landing_phones WHERE landing_number BETWEEN 1 AND 10
);

-- Actualizar registros existentes para asegurar que tengan valores por defecto
UPDATE landing_phones 
SET 
    individual_title = COALESCE(individual_title, 'Casino Landing ' || landing_number),
    individual_whatsapp_link = COALESCE(individual_whatsapp_link, whatsapp_link),
    use_individual_settings = COALESCE(use_individual_settings, false)
WHERE landing_number BETWEEN 1 AND 10;

-- Comentarios sobre el uso:
-- individual_title: Título personalizado para cada landing (ej: "Casino Premium 1")
-- individual_whatsapp_link: Link de WhatsApp específico para cada landing
-- use_individual_settings: true = usar configuración individual, false = usar configuración por grupos

-- Verificar los cambios
SELECT 
    landing_number,
    individual_title,
    individual_whatsapp_link,
    use_individual_settings,
    repository_group,
    whatsapp_link,
    is_active
FROM landing_phones 
WHERE landing_number BETWEEN 1 AND 10
ORDER BY landing_number;