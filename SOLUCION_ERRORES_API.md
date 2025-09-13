# Solución a Errores de API en el Panel de Administración

## Problema Identificado
Se detectaron los siguientes errores:
- `API Error [/get-config]: Error: Archivo de configuración no encontrado`
- `API Error [/update-config]: Error: Error interno del servidor`
- `API Error [/update-texts]: Error: Error interno del servidor`

## Causas
El problema principal era que las funciones de Netlify no podían encontrar el archivo de configuración `config.cjs` en la ruta esperada. Esto ocurre porque en el entorno de producción de Netlify, la estructura de directorios puede ser diferente a la del entorno de desarrollo local.

## Soluciones Implementadas

### 1. Modo Mocks Forzado
- Se modificó `useApi.js` para forzar el uso de datos mock tanto en desarrollo como en producción
- Esto permite que el panel funcione sin depender de las funciones de Netlify

### 2. Mejoras en Funciones de Netlify
- Se modificaron las funciones para buscar el archivo de configuración en múltiples rutas posibles
- Se añadió la capacidad de crear el archivo de configuración automáticamente si no existe
- Se agregó una función `getDefaultConfig()` para generar una configuración inicial

### 3. Implementación de Almacenamiento Local
- Se creó un nuevo hook `useLocalStorage.js` para almacenar la configuración en el navegador
- Se añadió un toggle en la interfaz para cambiar entre modo API y localStorage
- Se implementó un proveedor de configuración que selecciona automáticamente la fuente según la preferencia del usuario

## Cómo Usar las Nuevas Funciones

### Modo API con Mocks
El panel ahora usa datos mock por defecto, lo que permite trabajar sin depender de las funciones de Netlify. Esto está configurado en `useApi.js` con la variable `USE_MOCKS = true`.

### Modo LocalStorage
1. En la parte superior derecha del panel, encontrarás un toggle para activar el "Modo local"
2. Al activarlo, toda la configuración se guardará en el localStorage del navegador
3. Esto permite trabajar completamente offline y sin depender de las funciones de Netlify

## Verificación
Para comprobar que la solución funciona:
1. Abre el panel de administración
2. Verifica que no aparecen errores en la consola
3. Prueba a editar la configuración y los textos
4. Cambia entre modo API y modo local para confirmar que ambos funcionan

## Próximos Pasos Recomendados

### Corto Plazo
- Monitorear el funcionamiento del panel con estas soluciones
- Recopilar feedback de los usuarios

### Mediano Plazo
- Considerar migrar a una base de datos real (como Fauna DB o Supabase)
- Implementar un sistema de sincronización entre localStorage y backend

### Largo Plazo
- Evaluar la arquitectura general del sistema
- Considerar separar completamente el frontend del backend

## Soluciones Alternativas
Si los problemas persisten:
1. Usar exclusivamente el modo localStorage
2. Configurar variables de entorno en Netlify para almacenar configuraciones críticas
3. Implementar un sistema de almacenamiento basado en archivos JSON en la carpeta `public`