# Auditoría de producción — 27/07/2026

## Resumen

La web pública responde correctamente y el dominio principal está asociado al proyecto de producción de Vercel. El repositorio contiene una estructura estática clara, páginas legales, páginas de solución, sitemap, robots y cabeceras de seguridad.

El riesgo principal detectado es el control de versiones entre GitHub y Vercel: la versión observada en producción no coincide con el último commit disponible en `main`.

## Inventario confirmado

### GitHub

- Repositorio: `Joosee003/gastrohelp-v2`
- Rama principal: `main`
- Último commit observado en `main`: `1782c26d3d4c2655075cbe19bf0f0566bf353237`
- Mensaje: `Corregir caché SEO, dominio canónico y favicon`

### Vercel — producción

- Proyecto: `gastro-boost-system`
- ID: `prj_fkbkDdF65JPRB0BvyeOeAkouOq4N`
- Despliegue observado: `dpl_EK7sE5VuwzuQba2aSwuV5cWC7gdB`
- Estado: `READY`
- Dominios:
  - `gastrohelp.es`
  - `www.gastrohelp.es`
- Versión declarada por la respuesta pública: `24963ec6d2978b0de2c06892f6de8ac70e639636`

### Vercel — previsualización

- Proyecto: `gastrohelp-v2-preview`
- ID: `prj_cxkCHEgPYQevAwkZIggJ843713NJ`
- Estado: `READY`
- Versión observada: `846a225a950f4bf07277d2cf5c7310b651ab951a`

## Hallazgos

### 1. Producción no está alineada con el último commit de `main`

La respuesta de producción identifica el commit `24963ec...`, mientras que `main` contiene commits posteriores. Esto significa que cambios ya aprobados en GitHub pueden no estar activos en el dominio.

**Prioridad:** alta.

**Acción:** conectar el proyecto de producción a la rama `main` o establecer un procedimiento explícito de promoción que registre siempre el commit desplegado.

### 2. El proyecto de previsualización está más atrasado

La previsualización observada corresponde al commit `846a225...`. No debe utilizarse para aprobar cambios recientes hasta actualizarla.

**Prioridad:** media.

### 3. Hay una capa de Cloudflare delante de Vercel

La respuesta pública incluye cabeceras de Cloudflare. Por tanto, un cambio correcto en Vercel puede tardar en reflejarse si existe una regla de caché externa.

**Prioridad:** media.

**Acción:** documentar quién controla Cloudflare y cómo se purga la caché después de cambios importantes de HTML, SEO, robots, sitemap o favicon.

### 4. El nombre interno de producción es antiguo

El proyecto se llama `gastro-boost-system`, mientras la marca y el repositorio son GastroHelp.

No afecta al dominio público, pero aumenta la posibilidad de editar o desplegar en el proyecto equivocado.

**Prioridad:** media.

**Acción:** renombrar el proyecto cuando se confirme que no rompe integraciones, o dejar una nota visible y definitiva en el runbook.

### 5. El README anterior no describía la web actual

La documentación anterior mencionaba archivos de una versión antigua y afirmaba que no existía build. El proyecto actual sí usa `build.mjs` y `dist`.

**Estado:** corregido en esta rama.

### 6. Falta una validación automática antes del build

Actualmente es posible crear una página y olvidar añadirla al build o al sitemap.

**Estado:** se incorpora `scripts/check-site.mjs` en esta rama.

## Comprobaciones correctas

- El dominio devuelve HTTP 200.
- Existe canonical hacia `https://gastrohelp.es/` en la portada.
- La portada incluye título, descripción, Open Graph y datos estructurados.
- `www.gastrohelp.es` está contemplado en la configuración de redirección.
- Existen cabeceras de seguridad básicas:
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-Frame-Options`
- `robots.txt` permite el rastreo general y declara el sitemap.
- `sitemap.xml` incluye páginas comerciales, operativas y legales.
- `llms.txt` organiza las principales rutas por temática.

## Riesgos de contenido que deben revisarse manualmente

- No presentar métricas ficticias de la demo como resultados reales de clientes.
- No publicar precios no aprobados en páginas indexables.
- No prometer posiciones, reservas o resultados garantizados.
- Revisar la redacción del sistema de reseñas para evitar la impresión de que GastroHelp publica reseñas en nombre del cliente o bloquea opiniones negativas.
- Completar los datos reales del titular en las páginas legales antes de ampliar inversión publicitaria.

## Orden recomendado

1. Desplegar y verificar el último commit aprobado de `main`.
2. Actualizar el proyecto de previsualización.
3. Ejecutar la validación automática en cada cambio.
4. Confirmar Search Console y enviar `sitemap.xml`.
5. Documentar Cloudflare y el procedimiento de purga.
6. Revisar visualmente todas las rutas del sitemap.
7. Añadir analítica únicamente con consentimiento y verificar el banner de cookies.

## Criterio de cierre

La web se considerará técnicamente controlada cuando:

- producción y `main` indiquen el mismo commit aprobado;
- la previsualización esté actualizada;
- `npm run check` y `npm run build` terminen sin errores;
- todas las rutas del sitemap respondan correctamente;
- el procedimiento de despliegue y recuperación esté probado;
- Search Console confirme la lectura del sitemap.
