import { cp, mkdir, rm } from 'node:fs/promises';

const files = [
  'index.html',
  'styles.css',
  'app.js',
  'software-restaurantes.html',
  'sistema-reservas-restaurantes.html',
  'camarero-digital-restaurantes.html',
  'fidelizacion-restaurantes.html',
  'logo.svg',
  'favicon.svg',
  'og-card.svg',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml'
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await Promise.all(files.map((file) => cp(file, `dist/${file}`)));
console.log(`GastroHelp: ${files.length} archivos preparados para producción.`);
