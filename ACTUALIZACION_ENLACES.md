# Actualización del Sistema de Enlaces

## Corrección de Enlaces 1-6

Se ha identificado y corregido un problema con los enlaces 1-6 que no actualizaban correctamente el título ni el link. El problema estaba en la asignación incorrecta de los sitios para los enlaces 5-6.

### Problema Identificado

Los enlaces 7-10 funcionaban correctamente porque tenían la asignación correcta de sitios:
- Enlaces 7-8: Correctamente asignados a 1xclub-links-casinos y 1xclub-links-wsp
- Enlaces 9-10: Correctamente asignados a 24envivo-links-casinos y 24envivo-links-wsp

Sin embargo, los enlaces 5-6 estaban incorrectamente asignados:
- Enlace 5: Incorrectamente asignado a 1xclub-links-casinos (debería ser 24envivo-links-casinos)
- Enlace 6: Incorrectamente asignado a 1xclub-links-wsp (debería ser 24envivo-links-wsp)

### Solución Implementada

Se ha corregido la asignación de sitios para los enlaces 5-6 en la función `triggerDeploymentToAllSites` del archivo `SupabaseLinksTab.jsx`:

```javascript
const sites = [
  { name: '1xclub-links-casinos', subdomain: '1.registrogratis.online' },
  { name: '1xclub-links-wsp', subdomain: '2.registrogratis.online' },
  { name: '24envivo-links-casinos', subdomain: '3.registrogratis.online' },
  { name: '24envivo-links-wsp', subdomain: '4.registrogratis.online' },
  { name: '24envivo-links-casinos', subdomain: '5.registrogratis.online' }, // Corregido
  { name: '24envivo-links-wsp', subdomain: '6.registrogratis.online' }, // Corregido
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