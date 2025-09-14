# Actualización del Sistema de Enlaces

## Corrección de Enlaces 1-6

Se ha identificado y corregido un problema con los enlaces 1-6 que no actualizaban correctamente el título ni el link. El problema estaba en la asignación incorrecta de los sitios para los enlaces 5-6.

### Problema Identificado

Los enlaces 7-10 funcionaban correctamente porque tenían la asignación correcta de sitios:
- Enlaces 7-8: Correctamente asignados a 1xclub-links-casinos y 1xclub-links-wsp
- Enlaces 9-10: Correctamente asignados a 24envivo-links-casinos y 24envivo-links-wsp

Sin embargo, los enlaces 5-6 estaban incorrectamente asignados:
- Enlace 5: Incorrectamente asignado a 24envivo-links-casinos (debería ser 1xclub-links-casinos)
- Enlace 6: Incorrectamente asignado a 24envivo-links-wsp (debería ser 1xclub-links-wsp)

### Solución Implementada

Se ha corregido la asignación de sitios para los enlaces 5-6 en la función `triggerDeploymentToAllSites` del archivo `SupabaseLinksTab.jsx`:

```javascript
const sites = [
  { name: '1xclub-links-casinos', subdomain: '1.registrogratis.online' },
  { name: '1xclub-links-wsp', subdomain: '2.registrogratis.online' },
  { name: '24envivo-links-casinos', subdomain: '3.registrogratis.online' },
  { name: '24envivo-links-wsp', subdomain: '4.registrogratis.online' },
  { name: '1xclub-links-casinos', subdomain: '5.registrogratis.online' }, // Corregido: 5 corresponde a 1xclub
  { name: '1xclub-links-wsp', subdomain: '6.registrogratis.online' }, // Corregido: 6 corresponde a 1xclub
  { name: '1xclub-links-casinos', subdomain: '7.registrogratis.online' },
  { name: '1xclub-links-wsp', subdomain: '8.registrogratis.online' },
  { name: '24envivo-links-casinos', subdomain: '9.registrogratis.online' },
  { name: '24envivo-links-wsp', subdomain: '10.registrogratis.online' }
]
```

Con esta corrección, todos los enlaces (1-10) ahora deberían actualizar correctamente tanto el título como el link cuando se realiza un despliegue.

## Problema Resuelto

Se ha solucionado el problema con los enlaces 1-6 que no actualizaban el título ni el link de WhatsApp cuando se realizaban cambios en el panel de administración.

## Cambios Realizados

1. **Implementación de Despliegue Real a Netlify**:
   - Se ha reemplazado la simulación de despliegue por una implementación real que se conecta a la API de Netlify.
   - Ahora, cuando se actualizan los enlaces globales, se inicia un despliegue en todos los sitios configurados.

2. **Configuración de Variables de Entorno**:
   - Se han agregado nuevas variables de entorno para los IDs de los sitios de Netlify:
     - `VITE_NETLIFY_SITE_ID_1XCLUB_CASINOS`
     - `VITE_NETLIFY_SITE_ID_1XCLUB_WSP`
     - `VITE_NETLIFY_SITE_ID_24ENVIVO_CASINOS`
     - `VITE_NETLIFY_SITE_ID_24ENVIVO_WSP`

3. **Mapeo de Sitios a IDs de Netlify**:
   - Se ha implementado una función `getNetlifySiteId` que mapea los nombres de los sitios a sus IDs en Netlify.

4. **Función de Despliegue Mejorada**:
   - Se ha implementado una función `deployToNetlify` que realiza una llamada a la API de Netlify para iniciar un despliegue.
   - La función pasa las variables de entorno `WHATSAPP_LINK` y `REGISTER_TITLE` al despliegue para que estén disponibles en los sitios.

## Configuración Necesaria

Para que el sistema funcione correctamente, es necesario configurar las siguientes variables de entorno en el archivo `.env`:

```
# Deployment Configuration
VITE_DEPLOY_TOKEN=your_netlify_personal_access_token

# Netlify Site IDs
VITE_NETLIFY_SITE_ID_1XCLUB_CASINOS=your_1xclub_casinos_site_id_here
VITE_NETLIFY_SITE_ID_1XCLUB_WSP=your_1xclub_wsp_site_id_here
VITE_NETLIFY_SITE_ID_24ENVIVO_CASINOS=your_24envivo_casinos_site_id_here
VITE_NETLIFY_SITE_ID_24ENVIVO_WSP=your_24envivo_wsp_site_id_here
```

### Importante: Mensajes de Simulación

Si ves mensajes como `Simulando despliegue para [sitio] (token o siteId no configurados)` en la consola, esto indica que:

1. No has configurado el token de despliegue (`VITE_DEPLOY_TOKEN`) con un valor válido, o
2. No has configurado los IDs de los sitios de Netlify con valores válidos

Esto es normal si estás en un entorno de desarrollo y no has configurado estas variables. El sistema simulará los despliegues en lugar de realizarlos realmente.

Para realizar despliegues reales, asegúrate de reemplazar los valores de placeholder en el archivo `.env` con los valores reales obtenidos de Netlify.

## Asignación de Enlaces

La asignación de enlaces a los repositorios es la siguiente:

- **1xclub-links-casinos**: 1.registrogratis.online, 5.registrogratis.online, 7.registrogratis.online
- **1xclub-links-wsp**: 2.registrogratis.online, 6.registrogratis.online, 8.registrogratis.online
- **24envivo-links-casinos**: 3.registrogratis.online, 9.registrogratis.online
- **24envivo-links-wsp**: 4.registrogratis.online, 10.registrogratis.online

## Cómo Obtener los IDs de Netlify

1. Inicia sesión en tu cuenta de Netlify.
2. Ve a la página de tu sitio.
3. El ID del sitio se encuentra en la URL: `https://app.netlify.com/sites/{nombre-del-sitio}/overview`.
4. También puedes encontrarlo en la configuración del sitio, en la sección "Site information".

## Cómo Obtener un Token de Acceso Personal de Netlify

1. Inicia sesión en tu cuenta de Netlify.
2. Ve a la página de configuración de usuario: `https://app.netlify.com/user/applications`.
3. En la sección "Personal access tokens", haz clic en "New access token".
4. Dale un nombre descriptivo y selecciona los permisos necesarios (al menos necesitas permisos para desplegar sitios).
5. Haz clic en "Generate token" y copia el token generado.
6. Pega el token en la variable de entorno `VITE_DEPLOY_TOKEN` en el archivo `.env`.

## Configuración de Variables de Entorno de Supabase en Netlify

Para que los sitios del 1 al 6 funcionen correctamente con Supabase, es necesario configurar las siguientes variables de entorno en cada sitio de Netlify:

### Variables Requeridas

- **VITE_SUPABASE_ANON_KEY**: Clave anónima de Supabase
- **VITE_SUPABASE_URL**: URL de tu proyecto de Supabase

### Sitios que Requieren Configuración

Estas variables deben configurarse en los siguientes sitios de Netlify:

1. **1xclub-links-casinos** (subdominios: 1, 5, 7)
2. **1xclub-links-wsp** (subdominios: 2, 6, 8)
3. **24envivo-links-casinos** (subdominios: 3, 9)
4. **24envivo-links-wsp** (subdominios: 4, 10)

### Pasos para Configurar las Variables en Netlify

#### Para VITE_SUPABASE_ANON_KEY:

1. Inicia sesión en tu cuenta de Netlify
2. Navega al sitio específico (ej: 1xclub-links-casinos)
3. Ve a **Site settings** > **Environment variables**
4. Haz clic en **Add a variable**
5. Configura:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Values**: Pega tu clave anónima de Supabase
   - **Scopes**: Selecciona "All scopes"
   - **Deploy contexts**: Selecciona "Same value in all deploy contexts"
6. Haz clic en **Create variable**

#### Para VITE_SUPABASE_URL:

1. En el mismo sitio, haz clic en **Add a variable** nuevamente
2. Configura:
   - **Key**: `VITE_SUPABASE_URL`
   - **Values**: Pega la URL de tu proyecto de Supabase (ej: `https://tu-proyecto.supabase.co`)
   - **Scopes**: Selecciona "All scopes"
   - **Deploy contexts**: Selecciona "Same value in all deploy contexts"
3. Haz clic en **Create variable**

### Importante

- **Repite este proceso para cada uno de los 6 sitios** (1xclub-links-casinos, 1xclub-links-wsp, 24envivo-links-casinos, 24envivo-links-wsp)
- Las variables deben tener **exactamente los mismos valores** en todos los sitios
- Después de configurar las variables, es recomendable hacer un nuevo despliegue del sitio para que los cambios tomen efecto

### Cómo Obtener los Valores de Supabase

1. Inicia sesión en tu cuenta de Supabase
2. Ve a tu proyecto
3. Navega a **Settings** > **API**
4. Copia:
   - **URL**: Este será tu `VITE_SUPABASE_URL`
   - **anon public**: Esta será tu `VITE_SUPABASE_ANON_KEY`

## Solución al Problema de Enlaces 1-6 No Actualizando

### Problema Identificado

Se detectó que los enlaces 1-6 no estaban actualizando el título ni el link cuando se realizaban cambios desde Supabase, mientras que los enlaces 7-10 sí funcionaban correctamente.

### Causa del Problema

La causa raíz era que los sitios correspondientes a los enlaces 1-6 tenían configuradas variables de entorno de Supabase con valores placeholder en lugar de los valores reales:

- **1xclub-links-casinos** (subdominios 1, 5, 7)
- **1xclub-links-wsp** (subdominios 2, 6, 8)
- **24envivo-links-casinos** (subdominios 3, 9)
- **24envivo-links-wsp** (subdominios 4, 10)

Los archivos `.env` de estos sitios contenían:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Esto impedía que los sitios se conectaran correctamente a Supabase para obtener las actualizaciones.

### Solución Implementada

Se actualizaron los archivos `.env` de todos los sitios (1-6) con los valores reales de Supabase:

```
VITE_SUPABASE_URL=https://slrzlggigpiinswjfvxr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnpsZ2dpZ3BpaW5zd2pmdnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTkyOTQsImV4cCI6MjA3MzQzNTI5NH0.sIx1NtdC92TJYOumnDPs-J6zDFz6vjQamOmfxa0AK5c
```

### Archivos Actualizados

1. `1xclub-links-casinos/.env`
2. `1xclub-links-wsp/.env`
3. `24envivo-links-casinos/.env`
4. `24envivo-links-wsp/.env`

### Resultado Esperado

Con esta corrección, todos los enlaces (1-10) ahora deberían:
- Conectarse correctamente a Supabase
- Actualizar el título y link automáticamente cuando se realizan cambios desde el panel de administración
- Sincronizar los datos en tiempo real

### Nota Importante

Para que los cambios tomen efecto, es necesario:
1. Reiniciar los servidores de desarrollo si están corriendo
2. Realizar un nuevo despliegue en Netlify de cada sitio
3. Verificar que las variables de entorno también estén configuradas en Netlify (como se explica en la sección anterior)