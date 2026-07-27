# GastroHelp V2

Sitio comercial oficial de GastroHelp para restaurantes.

- Web pública: https://gastrohelp.es
- Demo del panel: https://panel.gastrohelp.es/demo
- Rama de producción: `main`
- Hosting: Vercel

## Arquitectura

El proyecto es un sitio estático en HTML, CSS y JavaScript. No utiliza un framework en ejecución.

El comando de construcción ejecuta `build.mjs`, limpia la carpeta `dist` y copia únicamente los archivos autorizados para producción.

```bash
npm run check
npm run build
```

## Archivos principales

- `index.html`: portada comercial.
- `app.js`: navegación, animaciones y preferencias de cookies.
- `home-v4.css` y `site-polish.css`: estilos activos de la portada.
- `build.mjs`: manifiesto de archivos que se copian a `dist`.
- `vercel.json`: construcción, redirecciones, cabeceras y caché.
- `robots.txt`, `sitemap.xml` y `llms.txt`: rastreo y descubrimiento.
- `aviso-legal.html`, `privacidad.html`, `cookies.html` y `seguridad.html`: páginas legales.
- `*-restaurantes.html`: páginas de soluciones y posicionamiento orgánico.
- `scripts/check-site.mjs`: validación previa al despliegue.

## Rutas limpias

Vercel tiene `cleanUrls: true`. Por ejemplo:

- `software-restaurantes.html` se publica como `/software-restaurantes`.
- `gestion-resenas-restaurantes.html` se publica como `/gestion-resenas-restaurantes`.

Las URLs públicas deben aparecer en `sitemap.xml`, `llms.txt` y, cuando corresponda, en el enlazado interno.

## Despliegue

Proyecto de producción actual en Vercel:

- Nombre interno: `gastro-boost-system`
- Dominios: `gastrohelp.es` y `www.gastrohelp.es`
- Directorio de salida: `dist`

Existe además un proyecto de previsualización llamado `gastrohelp-v2-preview`.

Antes de publicar:

1. Ejecutar `npm run check`.
2. Ejecutar `npm run build`.
3. Comprobar portada, páginas legales y principales páginas de solución.
4. Confirmar que `www.gastrohelp.es` redirige al dominio sin `www`.
5. Verificar `robots.txt`, `sitemap.xml` y `llms.txt`.
6. Confirmar que la versión desplegada corresponde al último commit aprobado de `main`.

## Reglas de mantenimiento

- No añadir una página sin incorporarla a `build.mjs`.
- No publicar una ruta comercial sin título, descripción y canonical.
- No introducir precios o garantías sin aprobación comercial.
- No guardar claves, tokens o credenciales en el repositorio.
- Mantener separados producción, previsualización y proyectos antiguos.

## Documentación

- `docs/PRODUCTION_AUDIT.md`: estado técnico y riesgos detectados.
- `docs/DEPLOYMENT_RUNBOOK.md`: procedimiento de despliegue y recuperación.
