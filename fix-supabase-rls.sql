-- Script para diagnosticar y solucionar problemas de RLS en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar si RLS está habilitado en la tabla landing_phones
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'landing_phones';

-- 2. Ver las políticas actuales de la tabla
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

-- 3. SOLUCIÓN: Deshabilitar RLS temporalmente para permitir actualizaciones
-- (Ejecutar solo si RLS está causando problemas)
ALTER TABLE public.landing_phones DISABLE ROW LEVEL SECURITY;

-- 4. ALTERNATIVA: Crear política permisiva para operaciones anónimas
-- (Usar esta opción si prefieres mantener RLS habilitado)
/*
CREATE POLICY "Allow anonymous updates on landing_phones" 
ON public.landing_phones 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anonymous select on landing_phones" 
ON public.landing_phones 
FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous insert on landing_phones" 
ON public.landing_phones 
FOR INSERT 
TO anon 
WITH CHECK (true);
*/

-- 5. Verificar que la tabla tiene los datos correctos
SELECT * FROM public.landing_phones ORDER BY landing_number;

-- 6. Probar una actualización manual
/*
UPDATE public.landing_phones 
SET 
    whatsapp_link = 'https://wa.me/1234567890?text=TestManual',
    description = 'Test manual desde SQL',
    updated_at = NOW()
WHERE landing_number = 1;
*/