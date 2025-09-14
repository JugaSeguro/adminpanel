# Migración de Tabla Landing Phones a Estructura por Grupos

## Resumen de Cambios

La tabla `landing_phones` ha sido optimizada para gestión exclusiva por grupos, eliminando la edición individual y simplificando la estructura.

## Cambios Principales

### ❌ Campos Eliminados
- `phone_number` - Ya no se necesita, solo usamos enlaces de WhatsApp

### ✅ Campos Agregados
- `repository_group` - Identifica el grupo de repositorio (1xclub-casinos, 1xclub-wsp, etc.)

### 🔧 Campos Modificados
- `whatsapp_link` - Ahora es NOT NULL (único campo requerido)
- `description` - Actualizada para reflejar grupo y landing

## Opciones de Migración

### Opción 1: Migración Incremental (Recomendada)
```sql
-- Ejecutar: migrate_to_group_structure.sql
```
**Ventajas:**
- ✅ Conserva datos existentes
- ✅ Migración segura sin pérdida de información
- ✅ Permite rollback si es necesario

**Usar cuando:**
- Ya tienes datos en producción
- Quieres conservar configuraciones existentes
- Necesitas una migración segura

### Opción 2: Recreación Completa
```sql
-- Ejecutar: create_landing_phones_table_optimized.sql
```
**Ventajas:**
- ✅ Estructura completamente limpia
- ✅ Datos de ejemplo optimizados
- ✅ Sin residuos de estructura anterior

**Usar cuando:**
- Es un entorno de desarrollo/testing
- No tienes datos importantes que conservar
- Quieres empezar desde cero

## Nueva Estructura de Grupos

```
1xclub-casinos    → Landings: 1, 5, 7
1xclub-wsp        → Landings: 2, 6, 8
24envivo-casinos  → Landings: 3, 9
24envivo-wsp      → Landings: 4, 10
```

## Beneficios de la Nueva Estructura

### 🚀 Rendimiento
- Menos campos = consultas más rápidas
- Índice por grupo para búsquedas eficientes
- Vista agregada para estadísticas

### 🎯 Simplicidad
- Solo enlaces de WhatsApp (único campo necesario)
- Gestión exclusiva por grupos
- Interfaz más limpia y enfocada

### 📊 Mejor Organización
- Campo `repository_group` para agrupación clara
- Vista `landing_phones_by_group` para estadísticas
- Descripciones consistentes por grupo

## Vista Agregada Incluida

La migración incluye una vista útil:

```sql
SELECT * FROM landing_phones_by_group;
```

Muestra:
- Total de landings por grupo
- Landings activas/inactivas
- Números de landing en cada grupo
- Última actualización

## Instrucciones de Ejecución

### Para Migración Incremental:
1. Hacer backup de la tabla actual
2. Ejecutar `migrate_to_group_structure.sql` en Supabase
3. Verificar que los datos se migraron correctamente
4. Probar la funcionalidad en el panel de administración

### Para Recreación Completa:
1. Hacer backup si es necesario
2. Ejecutar `create_landing_phones_table_optimized.sql` en Supabase
3. Verificar que la tabla se creó correctamente
4. Probar la funcionalidad en el panel de administración

## Verificación Post-Migración

```sql
-- Verificar estructura
\d public.landing_phones

-- Verificar datos por grupo
SELECT * FROM landing_phones_by_group;

-- Verificar que todos los grupos tienen datos
SELECT repository_group, COUNT(*) 
FROM public.landing_phones 
GROUP BY repository_group;
```

## Rollback (Solo para Migración Incremental)

Si necesitas revertir la migración:

```sql
-- Agregar de vuelta phone_number si es necesario
ALTER TABLE public.landing_phones 
ADD COLUMN phone_number VARCHAR(20);

-- Eliminar repository_group
ALTER TABLE public.landing_phones 
DROP COLUMN repository_group;

-- Eliminar vista
DROP VIEW IF EXISTS landing_phones_by_group;
```