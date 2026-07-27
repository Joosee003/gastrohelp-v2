# Runbook de despliegue y recuperación

## Objetivo

Publicar GastroHelp sin perder control sobre la versión activa, el dominio, el SEO ni la capacidad de volver atrás.

## Entornos

### Producción

- Proyecto Vercel: `gastro-boost-system`
- Proyecto ID: `prj_fkbkDdF65JPRB0BvyeOeAkouOq4N`
- Dominios: `gastrohelp.es` y `www.gastrohelp.es`
- Rama aprobada: `main`

### Previsualización

- Proyecto Vercel: `gastrohelp-v2-preview`
- Proyecto ID: `prj_cxkCHEgPYQevAwkZIggJ843713NJ`
- Uso: revisión antes de producción

## Antes del despliegue

1. Confirmar que el cambio está en una rama separada.
2. Revisar que no contiene claves, tokens, contraseñas ni datos privados.
3. Ejecutar:

```bash
npm run check
npm run build
```

4. Revisar como mínimo:
   - portada;
   - navegación móvil;
   - WhatsApp y correo;
   - demo del panel;
   - aviso legal, privacidad, cookies y seguridad;
   - robots, sitemap y llms;
   - páginas modificadas.
5. Registrar el commit que se va a publicar.

## Promoción a producción

1. Aprobar y fusionar el pull request en `main`.
2. Comprobar que Vercel inicia un despliegue desde el mismo commit.
3. Esperar estado `READY`.
4. Confirmar que el dominio principal apunta al nuevo despliegue.
5. Comprobar la versión servida mediante las cabeceras o los datos del despliegue.
6. Si Cloudflare está activo, purgar únicamente las rutas modificadas o la caché completa cuando cambien HTML global, robots, sitemap, canonical o favicon.

## Comprobación posterior

Abrir:

- `https://gastrohelp.es/`
- `https://www.gastrohelp.es/`
- `https://gastrohelp.es/robots.txt`
- `https://gastrohelp.es/sitemap.xml`
- `https://gastrohelp.es/llms.txt`
- `https://gastrohelp.es/aviso-legal`
- `https://gastrohelp.es/privacidad`
- `https://panel.gastrohelp.es/demo`

Verificar:

- HTTP 200 en las páginas públicas;
- redirección de `www` hacia el dominio principal;
- ausencia de `noindex` en producción;
- canonical correcto;
- carga de CSS, JavaScript, logo y tarjeta social;
- funcionamiento del contacto por WhatsApp;
- inexistencia de errores visibles en consola;
- coincidencia entre commit aprobado y despliegue.

## Recuperación

Si el despliegue tiene un fallo:

1. No editar archivos directamente en producción.
2. Volver a asignar los dominios al último despliegue `READY` conocido.
3. Purgar la caché de Cloudflare si continuara sirviendo la versión defectuosa.
4. Abrir una incidencia con:
   - commit defectuoso;
   - despliegue afectado;
   - rutas afectadas;
   - capturas o error;
   - hora de detección;
   - solución aplicada.
5. Corregir en una rama nueva y repetir el proceso completo.

## Cambios SEO de alto riesgo

Requieren revisión especial:

- canonical;
- redirecciones;
- dominio principal;
- robots;
- sitemap;
- títulos y descripciones globales;
- eliminación o cambio de rutas;
- contenido legal;
- caché de HTML;
- datos estructurados.

## Registro mínimo de cada publicación

- Fecha y hora.
- Responsable.
- Commit.
- Pull request.
- Despliegue Vercel.
- Rutas modificadas.
- Resultado de `npm run check`.
- Resultado de comprobación posterior.
- Necesidad de purga de Cloudflare.
- Incidencias y rollback, si existen.
