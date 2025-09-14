-- Tabla optimizada para gestión de enlaces WhatsApp por grupos
-- Solo maneja enlaces de WhatsApp ya que se eliminó la gestión individual

-- Eliminar tabla existente si existe (para migración)
DROP TABLE IF EXISTS public.landing_phones;

-- Crear tabla simplificada
CREATE TABLE public.landing_phones (
    id SERIAL PRIMARY KEY,
    landing_number INTEGER NOT NULL UNIQUE CHECK (landing_number >= 1 AND landing_number <= 10),
    whatsapp_link TEXT NOT NULL,
    description TEXT,
    repository_group VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_landing_phones_landing_number ON public.landing_phones(landing_number);
CREATE INDEX idx_landing_phones_repository_group ON public.landing_phones(repository_group);
CREATE INDEX idx_landing_phones_active ON public.landing_phones(is_active);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_landing_phones_updated_at
    BEFORE UPDATE ON public.landing_phones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos organizados por grupos de repositorio
INSERT INTO public.landing_phones (landing_number, whatsapp_link, description, repository_group) VALUES
-- Grupo: 1xclub-casinos (landings 1, 5, 7)
(1, 'https://wa.me/5491123456789', '1xclub Casino - Landing 1', '1xclub-casinos'),
(5, 'https://wa.me/5491123456789', '1xclub Casino - Landing 5', '1xclub-casinos'),
(7, 'https://wa.me/5491123456789', '1xclub Casino - Landing 7', '1xclub-casinos'),

-- Grupo: 1xclub-wsp (landings 2, 6, 8)
(2, 'https://wa.me/5491123456790', '1xclub WhatsApp - Landing 2', '1xclub-wsp'),
(6, 'https://wa.me/5491123456790', '1xclub WhatsApp - Landing 6', '1xclub-wsp'),
(8, 'https://wa.me/5491123456790', '1xclub WhatsApp - Landing 8', '1xclub-wsp'),

-- Grupo: 24envivo-casinos (landings 3, 9)
(3, 'https://wa.me/5491123456791', '24envivo Casino - Landing 3', '24envivo-casinos'),
(9, 'https://wa.me/5491123456791', '24envivo Casino - Landing 9', '24envivo-casinos'),

-- Grupo: 24envivo-wsp (landings 4, 10)
(4, 'https://wa.me/5491123456792', '24envivo WhatsApp - Landing 4', '24envivo-wsp'),
(10, 'https://wa.me/5491123456792', '24envivo WhatsApp - Landing 10', '24envivo-wsp')
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
COMMENT ON TABLE public.landing_phones IS 'Tabla optimizada para gestión de enlaces WhatsApp por grupos de repositorio';
COMMENT ON COLUMN public.landing_phones.landing_number IS 'Número de landing (1-10)';
COMMENT ON COLUMN public.landing_phones.whatsapp_link IS 'Enlace directo de WhatsApp (único campo necesario)';
COMMENT ON COLUMN public.landing_phones.description IS 'Descripción del grupo y landing';
COMMENT ON COLUMN public.landing_phones.repository_group IS 'Grupo de repositorio (1xclub-casinos, 1xclub-wsp, 24envivo-casinos, 24envivo-wsp)';
COMMENT ON COLUMN public.landing_phones.is_active IS 'Indica si el número está activo';

-- Vista para facilitar consultas por grupo
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

COMMENT ON VIEW landing_phones_by_group IS 'Vista que agrupa información por repositorio para facilitar la gestión';