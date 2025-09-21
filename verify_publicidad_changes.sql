-- Script de verificación para confirmar que los cambios de publicidad se aplicaron correctamente
-- Ejecutar después de la migración para validar la configuración

-- 1. Verificar que todas las landings 1-10 existen
SELECT 
    'Verificación de existencia de landings 1-10' as check_type,
    CASE 
        WHEN COUNT(*) = 10 THEN 'PASS: Todas las landings están presentes'
        ELSE 'FAIL: Faltan ' || (10 - COUNT(*)) || ' landings'
    END as result
FROM landing_phones 
WHERE landing_number BETWEEN 1 AND 10 AND is_active = true;

-- 2. Verificar la configuración específica de landing 5
SELECT 
    'Verificación de landing 5' as check_type,
    CASE 
        WHEN repository_group = '1xclub-publicidad-casinos' THEN 'PASS: Landing 5 en grupo correcto'
        ELSE 'FAIL: Landing 5 en grupo incorrecto: ' || repository_group
    END as result,
    description,
    repository_group
FROM landing_phones 
WHERE landing_number = 5;

-- 3. Verificar la configuración específica de landing 6
SELECT 
    'Verificación de landing 6' as check_type,
    CASE 
        WHEN repository_group = '1xclub-publicidad-wsp' THEN 'PASS: Landing 6 en grupo correcto'
        ELSE 'FAIL: Landing 6 en grupo incorrecto: ' || repository_group
    END as result,
    description,
    repository_group
FROM landing_phones 
WHERE landing_number = 6;

-- 4. Verificar que los grupos anteriores ya no contienen landings 5 y 6
SELECT 
    'Verificación de grupos anteriores' as check_type,
    repository_group,
    array_agg(landing_number ORDER BY landing_number) as landings,
    CASE 
        WHEN repository_group = '1xclub-casinos' AND NOT (5 = ANY(array_agg(landing_number))) THEN 'PASS: Landing 5 removido de 1xclub-casinos'
        WHEN repository_group = '1xclub-wsp' AND NOT (6 = ANY(array_agg(landing_number))) THEN 'PASS: Landing 6 removido de 1xclub-wsp'
        WHEN repository_group IN ('1xclub-casinos', '1xclub-wsp') THEN 'FAIL: Landings 5 o 6 aún en grupos anteriores'
        ELSE 'INFO: Otros grupos'
    END as result
FROM landing_phones 
WHERE is_active = true
GROUP BY repository_group
ORDER BY repository_group;

-- 5. Verificar la estructura completa de grupos
SELECT 
    'Estructura final de grupos' as info,
    repository_group,
    array_agg(landing_number ORDER BY landing_number) as landings,
    COUNT(*) as total_landings
FROM landing_phones 
WHERE is_active = true
GROUP BY repository_group
ORDER BY repository_group;

-- 6. Verificar que la vista funciona correctamente
SELECT 
    'Verificación de vista landing_phones_by_group' as check_type,
    CASE 
        WHEN COUNT(*) >= 6 THEN 'PASS: Vista contiene todos los grupos esperados'
        ELSE 'FAIL: Vista incompleta, solo ' || COUNT(*) || ' grupos'
    END as result
FROM landing_phones_by_group;

-- 7. Mostrar contenido de la vista
SELECT 
    'Contenido de vista landing_phones_by_group' as info,
    repository_group,
    landing_numbers,
    total_landings,
    all_active
FROM landing_phones_by_group
ORDER BY repository_group;

-- 8. Verificación final de integridad
SELECT 
    'Verificación final de integridad' as check_type,
    CASE 
        WHEN 
            (SELECT COUNT(*) FROM landing_phones WHERE landing_number = 5 AND repository_group = '1xclub-publicidad-casinos') = 1
            AND
            (SELECT COUNT(*) FROM landing_phones WHERE landing_number = 6 AND repository_group = '1xclub-publicidad-wsp') = 1
            AND
            (SELECT COUNT(*) FROM landing_phones WHERE is_active = true) = 10
        THEN 'PASS: Migración completada exitosamente'
        ELSE 'FAIL: Problemas detectados en la migración'
    END as result;

-- Resumen de la configuración esperada:
-- 1xclub-casinos: [1, 7]
-- 1xclub-wsp: [2, 8]  
-- 1xclub-publicidad-casinos: [5]
-- 1xclub-publicidad-wsp: [6]
-- 24envivo-casinos: [3, 9]
-- 24envivo-wsp: [4, 10]