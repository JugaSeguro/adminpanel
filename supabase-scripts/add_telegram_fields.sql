-- Script para agregar campos de Telegram a la tabla landing_phones
-- Esto permitirá gestionar enlaces de Telegram de forma similar a WhatsApp

-- Agregar campos de Telegram a la tabla existente
ALTER TABLE public.landing_phones 
ADD COLUMN IF NOT EXISTS telegram_link TEXT,
ADD COLUMN IF NOT EXISTS individual_telegram_link TEXT,
ADD COLUMN IF NOT EXISTS use_individual_telegram BOOLEAN DEFAULT false;

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_landing_phones_telegram 
ON public.landing_phones(use_individual_telegram);

-- Actualizar registros existentes con valores por defecto de Telegram
UPDATE public.landing_phones 
SET 
    telegram_link = COALESCE(telegram_link, 'https://t.me/jugadirecto'),
    individual_telegram_link = COALESCE(individual_telegram_link, ''),
    use_individual_telegram = COALESCE(use_individual_telegram, false)
WHERE telegram_link IS NULL OR individual_telegram_link IS NULL OR use_individual_telegram IS NULL;

-- Verificar que los campos se agregaron correctamente
SELECT 
    landing_number,
    telegram_link,
    individual_telegram_link,
    use_individual_telegram,
    is_active
FROM public.landing_phones 
ORDER BY landing_number;

-- Comentarios sobre los nuevos campos:
-- telegram_link: Link de Telegram por defecto para grupos (similar a whatsapp_link)
-- individual_telegram_link: Link de Telegram específico para cada landing individual
-- use_individual_telegram: true = usar individual_telegram_link, false = usar telegram_link por grupos