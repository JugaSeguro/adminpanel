# Configuración del Sistema GitHub API

## Resumen
El panel de administración ahora usa la GitHub API para actualizar directamente los archivos de los repositorios, eliminando la dependencia de Netlify Functions y proporcionando un control más directo sobre los cambios.

## 1. Crear Token de GitHub

### Pasos detallados:

1. **Ir a GitHub.com** y hacer login
2. **Click en tu avatar** (esquina superior derecha) → **Settings**
3. **En el menú izquierdo** → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token** → **Generate new token (classic)**
6. **Configuración del token**:
   - **Note**: "Admin Panel - Casino Sites"
   - **Expiration**: 90 days (o No expiration si prefieres)
   - **Scopes**: Marca estas opciones:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

7. **Generate token** y **copia el token** (guárdalo bien, no se puede ver de nuevo)

## 2. Configurar Variables de Entorno

### Para desarrollo local:
1. Copia `env.example` a `.env.local`
2. Agrega tu token:
```bash
GITHUB_TOKEN=tu_token_de_github_aqui
```

### Para producción (Netlify):
1. Ve a tu panel de Netlify
2. **Site settings** → **Environment variables**
3. Agrega:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: tu token de GitHub

## 3. Configurar Repositorios

El sistema está configurado para trabajar con estos repositorios:
- `1xclub-links-casinos`
- `1xclub-links-wsp`
- `24envivo-links-casinos`
- `24envivo-links-wsp`

### Verificar configuración:
1. Asegúrate de que todos los repositorios existen
2. Verifica que el usuario `JugaSeguro` tiene acceso de escritura
3. Si usas un usuario diferente, actualiza `REPOSITORIES` en `useGitHubApi.js`

## 4. Cómo Funciona

### Flujo de actualización:
1. **Usuario modifica** texto en el panel
2. **GitHub API** lee el archivo actual del repositorio
3. **Sistema actualiza** el contenido específico
4. **GitHub API** hace commit y push de los cambios
5. **Netlify detecta** los cambios automáticamente
6. **Sitio se actualiza** con el nuevo contenido

### Archivos que se actualizan:
- `src/App.jsx` en cada repositorio
- Se actualizan específicamente:
  - Título principal (`mainTitle`)
  - Subtítulo (`subtitle`)
  - URL de WhatsApp (`whatsappUrl`)
  - URL de Telegram (`telegramUrl`)

## 5. Uso del Panel

### Nueva pestaña "GitHub":
1. **Seleccionar sitios**: Todos o sitios específicos
2. **Modificar contenido**: Título, subtítulo, enlaces
3. **Actualizar**: Los cambios se aplican inmediatamente

### Ventajas:
- ✅ **Más confiable** que Netlify Functions
- ✅ **Control de versiones** completo
- ✅ **Actualización directa** de archivos fuente
- ✅ **Despliegue automático** vía Netlify
- ✅ **Historial de cambios** en GitHub

## 6. Solución de Problemas

### Error: "GitHub token no configurado"
- Verifica que `GITHUB_TOKEN` está configurado
- En desarrollo: revisa `.env.local`
- En producción: revisa variables de Netlify

### Error: "Repositorio no encontrado"
- Verifica que el repositorio existe
- Confirma que el usuario tiene acceso
- Revisa la configuración en `useGitHubApi.js`

### Error: "No se encontró el patrón"
- El archivo puede haber cambiado de estructura
- Revisa los patrones de búsqueda en `updateTextInFile`
- Actualiza los patrones si es necesario

## 7. Estructura de Archivos

```
admin-panel/
├── src/
│   ├── hooks/
│   │   └── useGitHubApi.js          # Funciones de GitHub API
│   └── components/
│       └── tabs/
│           └── GitHubConfigTab.jsx  # Interfaz de GitHub
├── env.example                      # Variables de entorno
└── GITHUB_SETUP.md                 # Esta documentación
```

## 8. Próximos Pasos

1. **Configurar el token** de GitHub
2. **Probar la funcionalidad** en desarrollo
3. **Desplegar** a Netlify con las variables de entorno
4. **Verificar** que los cambios se propagan correctamente

## 9. Seguridad

- **Nunca** compartas tu token de GitHub
- **Usa** variables de entorno para almacenar el token
- **Revisa** regularmente los permisos del token
- **Rota** el token periódicamente si es necesario
