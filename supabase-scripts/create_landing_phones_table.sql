-- Crear tabla para manejar números de teléfono por landing
-- Esta tabla permite asignar números específicos a cada landing (1-10)

CREATE TABLE IF NOT EXISTS public.landing_phones (
    id SERIAL PRIMARY KEY,
    landing_number INTEGER NOT NULL UNIQUE CHECK (landing_number >= 1 AND landing_number <= 10),
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_link TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por número de landing
CREATE INDEX IF NOT EXISTS idx_landing_phones_landing_number ON public.landing_phones(landing_number);
CREATE INDEX IF NOT EXISTS idx_landing_phones_active ON public.landing_phones(is_active);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_landing_phones_updated_at ON public.landing_phones;
CREATE TRIGGER update_landing_phones_updated_at
    BEFORE UPDATE ON public.landing_phones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo organizados por repositorio
-- 1xclub-links-casinos (subdominios 1, 5, 7)
INSERT INTO public.landing_phones (landing_number, phone_number, whatsapp_link, description) VALUES
(1, '+5491123456789', 'https://wa.me/5491123456789', '1xclub-links-casinos - Subdominio 1'),
(5, '+5491123456793', 'https://wa.me/5491123456793', '1xclub-links-casinos - Subdominio 5'),
(7, '+5491123456795', 'https://wa.me/5491123456795', '1xclub-links-casinos - Subdominio 7'),

-- 1xclub-links-wsp (subdominios 2, 6, 8)
(2, '+5491123456790', 'https://wa.me/5491123456790', '1xclub-links-wsp - Subdominio 2'),
(6, '+5491123456794', 'https://wa.me/5491123456794', '1xclub-links-wsp - Subdominio 6'),
(8, '+5491123456796', 'https://wa.me/5491123456796', '1xclub-links-wsp - Subdominio 8'),

-- 24envivo-links-casinos (subdominios 3, 9)
(3, '+5491123456791', 'https://wa.me/5491123456791', '24envivo-links-casinos - Subdominio 3'),
(9, '+5491123456797', 'https://wa.me/5491123456797', '24envivo-links-casinos - Subdominio 9'),

-- 24envivo-links-wsp (subdominios 4, 10)
(4, '+5491123456792', 'https://wa.me/5491123456792', '24envivo-links-wsp - Subdominio 4'),
(10, '+5491123456798', 'https://wa.me/5491123456798', '24envivo-links-wsp - Subdominio 10')
ON CONFLICT (landing_number) DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.landing_phones ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios anónimos
CREATE POLICY "Allow anonymous read access" ON public.landing_phones
    FOR SELECT
    TO anon
    USING (is_active = true);

-- Política para permitir todas las operaciones a usuarios autenticados
CREATE POLICY "Allow authenticated full access" ON public.landing_phones
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE public.landing_phones IS 'Tabla para manejar números de teléfono específicos por landing';
COMMENT ON COLUMN public.landing_phones.landing_number IS 'Número de landing (1-10)';
COMMENT ON COLUMN public.landing_phones.phone_number IS 'Número de teléfono con formato internacional';
COMMENT ON COLUMN public.landing_phones.whatsapp_link IS 'Enlace directo de WhatsApp';
COMMENT ON COLUMN public.landing_phones.description IS 'Descripción del uso de este número';
COMMENT ON COLUMN public.landing_phones.is_active IS 'Indica si el número está activo';