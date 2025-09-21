# Migración de Landings de Publicidad

## Resumen de Cambios

Esta migración separa las landings 5 y 6 en nuevos grupos de publicidad independientes:

- **Landing 5**: Movido de `1xclub-casinos` → `1xclub-publicidad-casinos`
- **Landing 6**: Movido de `1xclub-wsp` → `1xclub-publicidad-wsp`

## Estructura Final de Grupos

| Grupo | Landings | Repositorio |
|-------|----------|-------------|
| 1xclub Casino | 1, 7 | 1xclub-links-casinos |
| 1xclub WhatsApp | 2, 8 | 1xclub-links-wsp |
| **1xclub Publicidad Casino** | **5** | **1xclub-publicidad-casinos** |
| **1xclub Publicidad WhatsApp** | **6** | **1xclub-publicidad-wsp** |
| 24envivo Casino | 3, 9 | 24envivo-links-casinos |
| 24envivo WhatsApp | 4, 10 | 24envivo-links-wsp |

## Archivos Modificados

### 1. Panel de Administración
- ✅ `src/components/tabs/LandingPhonesTab.jsx`
  - Actualizada configuración `repositoryGroups`
  - Agregados nuevos grupos de publicidad
  - Actualizada sección de instrucciones

### 2. Scripts SQL Creados
- ✅ `migrate_to_publicidad_structure.sql` - Script principal de migración
- ✅ `fix_publicidad_landings.sql` - Script de corrección completa
- ✅ `verify_publicidad_changes.sql` - Script de verificación

## Pasos para Aplicar los Cambios

### Paso 1: Verificar el Panel de Administración
Los cambios en el frontend ya están aplicados. El panel ahora muestra:
- Nuevos grupos de publicidad con colores distintivos
- Landing 5 en grupo "1xclub Publicidad Casino" (morado)
- Landing 6 en grupo "1xclub Publicidad WhatsApp" (rosa)

### Paso 2: Ejecutar Migración de Base de Datos

#### Opción A: Migración Principal (Recomendada)
```sql
-- Ejecutar en tu cliente SQL (psql, pgAdmin, etc.)
\i migrate_to_publicidad_structure.sql
```

#### Opción B: Corrección Completa (Si hay problemas)
```sql
-- Si necesitas una corrección más completa
\i fix_publicidad_landings.sql
```

### Paso 3: Verificar los Cambios
```sql
-- Ejecutar script de verificación
\i verify_publicidad_changes.sql
```

### Paso 4: Probar en el Panel de Administración
1. Abrir el panel de administración
2. Ir a la pestaña "Landing Phones"
3. Verificar que aparecen los nuevos grupos:
   - "1xclub Publicidad Casino" con landing 5
   - "1xclub Publicidad WhatsApp" con landing 6
4. Probar actualizar enlaces en los nuevos grupos
5. Verificar que las actualizaciones se guardan correctamente

## Verificaciones Post-Migración

### ✅ Checklist de Verificación
- [ ] Landing 5 aparece solo en "1xclub Publicidad Casino"
- [ ] Landing 6 aparece solo en "1xclub Publicidad WhatsApp"
- [ ] Grupos anteriores ya no contienen landings 5 y 6
- [ ] Todas las landings 1-10 están presentes y activas
- [ ] La interfaz muestra los nuevos grupos con colores correctos
- [ ] Las actualizaciones de enlaces funcionan correctamente

### Consultas de Verificación Rápida
```sql
-- Ver configuración actual
SELECT landing_number, repository_group, description 
FROM landing_phones 
WHERE landing_number IN (5, 6);

-- Ver todos los grupos
SELECT repository_group, array_agg(landing_number ORDER BY landing_number) 
FROM landing_phones 
WHERE is_active = true 
GROUP BY repository_group;
```

## Rollback (Si es necesario)

Si necesitas revertir los cambios:

```sql
-- Revertir landing 5 a grupo original
UPDATE landing_phones 
SET repository_group = '1xclub-casinos', 
    description = '1xclub Casino - Landing 5'
WHERE landing_number = 5;

-- Revertir landing 6 a grupo original  
UPDATE landing_phones 
SET repository_group = '1xclub-wsp',
    description = '1xclub WhatsApp - Landing 6' 
WHERE landing_number = 6;
```

## Soporte

Si encuentras algún problema durante la migración:

1. Ejecuta el script de verificación para identificar el problema
2. Usa el script de corrección completa si hay inconsistencias
3. Verifica que todos los archivos estén en su lugar
4. Reinicia el servidor del panel de administración si es necesario

## Notas Técnicas

- Los nuevos grupos tienen colores distintivos (morado y rosa)
- La vista `landing_phones_by_group` se actualiza automáticamente
- Los triggers de `updated_at` siguen funcionando
- RLS (Row Level Security) se mantiene habilitado
- Compatibilidad completa con la funcionalidad existente