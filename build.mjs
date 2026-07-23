import { cp, mkdir, rm } from "node:fs/promises";

const files = [
  "index.html",
  "home-v4.css",
  "enhancements-v2.css",
  "styles.css",
  "landing.css",
  "site-polish.css",
  "app.js",
  "brand-logo-2026.svg",
  "brand-icon-2026.svg",
  "logo-gastrohelp.jpg",
  "og-card.svg",
  "og-card.png",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "legal.css",
  "aviso-legal.html",
  "privacidad.html",
  "cookies.html",
  "seguridad.html",
  "software-restaurantes.html",
  "sistema-reservas-restaurantes.html",
  "camarero-digital-restaurantes.html",
  "fidelizacion-restaurantes.html",
  "gestion-clientes-restaurantes.html",
  "gestion-sala-restaurantes.html",
  "gestion-resenas-restaurantes.html",
  "rentabilidad-restaurantes.html",
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await Promise.all(files.map((file) => cp(file, `dist/${file}`)));
console.log(`GastroHelp: ${files.length} archivos preparados para producción.`);
