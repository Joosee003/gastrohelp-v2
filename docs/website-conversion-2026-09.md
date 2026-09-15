# GastroHelp · Web comercial

La portada se centra en un recorrido: descubrir el restaurante, reservar y mantener la relación después de la visita. Se conserva el logo oficial y el azul de la marca. El motivo de la mesa abierta conecta con las demos de restaurantes sin sustituir el logo.

## Referencias estudiadas

- [Last.app](https://www.last.app/): protagonismo del producto y acceso visible a la demostración.
- [CoverManager](https://www.covermanager.com/es): explicación por necesidades del restaurante y captación de solicitudes de demo.
- [Agencia Gourmet](https://agenciagourmet.com/): presentación de servicios de marketing para hostelería.

No se trasladan a GastroHelp testimonios, cifras de clientes ni resultados de otras empresas. Las imágenes del panel son capturas de la demo pública. La imagen de ambiente pertenece al restaurante ficticio La Reserva.

## Formulario

El formulario envía nombre, restaurante, dirección/localidad, teléfono, email, interés y aceptación de privacidad al workflow `9sMuNfZq096uK7ZT`, en n8n GastroHelp. El código reproducible está en `automation/web-leads.js` y la URL pública en `marketing-config.js`.

El correo se dirige exclusivamente a `gastrohelpsmart@gmail.com` con la credencial SMTP existente. El visitante no puede cambiar el destinatario. Su email validado se utiliza como Reply-To. El correo es texto plano. La interfaz exige respuesta `ok: true` y el mismo identificador de solicitud antes de confirmar el envío. Una respuesta vacía o genérica no cuenta como éxito.

Se validan campos, límites, origen y aceptación de privacidad. Incluye un campo trampa, un tiempo mínimo de cumplimentación y límites básicos por minuto y día. El registro de solicitudes enviadas evita repeticiones durante 24 horas en uso normal. Los contadores y el registro usan datos estáticos de n8n; no constituyen un límite atómico ante peticiones concurrentes. Ante un fallo, el formulario conserva sus datos en pantalla y ofrece WhatsApp.

## Meta

La campaña y sus ajustes no forman parte de este cambio. Hay dos conjuntos visibles: `1249735508220800` (GastroHelp - Leads Restaurantes - Meta) y `26498433679825523` (GastroHelp). Hasta que el gestor confirme el correcto, `pixelId` permanece vacío y la web no carga Meta.

Una vez confirmado, se configura exclusivamente `pixelId` en `marketing-config.js`. El visitante debe aceptar antes de cargar el píxel. El consentimiento anterior v1 no se reutiliza para publicidad. “Rechazar” y “Aceptar” tienen igual peso visual, y la elección se revisa desde el pie de todas las páginas.

Eventos previstos: `PageView`, `Lead` tras envío confirmado y eventos personalizados para abrir/explorar demos o WhatsApp. No se mandan campos del formulario ni se configura coincidencia avanzada. La configuración automática de eventos se desactiva desde el código del sitio; no se modifica ningún ajuste de campaña en Meta.

## Publicación

Fuente: repositorio `Joosee003/gastrohelp-v2`. Proyecto de producción Vercel: `gastro-boost-system` (`prj_fkbkDdF65JPRB0BvyeOeAkouOq4N`). Este proyecto tiene un enlace Git distinto del repositorio de esta web; los cambios se publican mediante una carga explícita de los archivos de esta fuente. No asumir que un push publica el dominio.

Comprobación: `npm run build`, verificación de enlaces y recursos, revisión visual de escritorio y móvil, pestañas y ampliación de demos, consentimiento, validación del formulario y prueba de envío al correo comercial. El archivo `preview-mobile.html` es solo una herramienta del despliegue de revisión y no debe incluirse en producción.
