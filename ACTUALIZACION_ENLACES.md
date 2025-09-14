# Actualización del Sistema de Enlaces

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