import { access, readFile } from "node:fs/promises";

const errors = [];
const warnings = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function routeFromFile(file) {
  if (file === "index.html") return "/";
  return `/${file.replace(/\.html$/, "")}`;
}

function canonicalFromHtml(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? null;
}

function descriptionFromHtml(html) {
  return html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] ?? null;
}

const buildSource = await readFile("build.mjs", "utf8");
const listBlock = buildSource.match(/const\s+files\s*=\s*\[([\s\S]*?)\];/);

if (!listBlock) {
  fail("No se ha podido leer la lista de archivos de build.mjs.");
} else {
  const buildFiles = [...listBlock[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);

  if (!buildFiles.includes("index.html")) fail("index.html no está incluido en build.mjs.");
  if (!buildFiles.includes("robots.txt")) fail("robots.txt no está incluido en build.mjs.");
  if (!buildFiles.includes("sitemap.xml")) fail("sitemap.xml no está incluido en build.mjs.");
  if (!buildFiles.includes("llms.txt")) fail("llms.txt no está incluido en build.mjs.");

  for (const file of buildFiles) {
    if (!(await exists(file))) fail(`Falta el archivo declarado para producción: ${file}`);
  }

  const htmlFiles = buildFiles.filter((file) => file.endsWith(".html"));

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const expectedRoute = routeFromFile(file);
    const expectedCanonical = `https://gastrohelp.es${expectedRoute}`;

    if (!/<html\s+[^>]*lang=["']es["']/i.test(html)) {
      fail(`${file}: falta lang=\"es\".`);
    }

    if (!/<title>[^<]+<\/title>/i.test(html)) {
      fail(`${file}: falta un título HTML.`);
    }

    const description = descriptionFromHtml(html);
    if (!description) {
      fail(`${file}: falta la meta description.`);
    } else if (description.length < 70 || description.length > 180) {
      warn(`${file}: la meta description tiene ${description.length} caracteres.`);
    }

    const canonical = canonicalFromHtml(html);
    if (!canonical) {
      fail(`${file}: falta canonical.`);
    } else if (canonical !== expectedCanonical) {
      fail(`${file}: canonical ${canonical} no coincide con ${expectedCanonical}.`);
    }

    if (/\bnoindex\b/i.test(html)) {
      fail(`${file}: contiene noindex dentro de un archivo de producción.`);
    }
  }

  const sitemap = await readFile("sitemap.xml", "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/gastrohelp\.es[^<]*)<\/loc>/g)].map(
    (match) => match[1],
  );

  if (sitemapUrls.length === 0) fail("sitemap.xml no contiene URLs de gastrohelp.es.");

  const sitemapRoutes = new Set(
    sitemapUrls.map((url) => {
      const parsed = new URL(url);
      return parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/$/, "");
    }),
  );

  for (const file of htmlFiles) {
    const route = routeFromFile(file);
    if (!sitemapRoutes.has(route)) {
      warn(`${file}: la ruta ${route} no aparece en sitemap.xml.`);
    }
  }

  for (const route of sitemapRoutes) {
    const source = route === "/" ? "index.html" : `${route.slice(1)}.html`;
    if (!buildFiles.includes(source)) {
      fail(`sitemap.xml publica ${route}, pero ${source} no está incluido en build.mjs.`);
    }
  }

  const robots = await readFile("robots.txt", "utf8");
  if (!/Sitemap:\s*https:\/\/gastrohelp\.es\/sitemap\.xml/i.test(robots)) {
    fail("robots.txt no declara el sitemap oficial.");
  }

  const llms = await readFile("llms.txt", "utf8");
  const llmsUrls = [...llms.matchAll(/https:\/\/gastrohelp\.es([^\s)#]*)/g)].map(
    (match) => match[1] || "/",
  );

  for (const rawRoute of llmsUrls) {
    const route = rawRoute === "/" ? "/" : rawRoute.replace(/\/$/, "");
    if (!sitemapRoutes.has(route)) {
      warn(`llms.txt incluye ${route}, pero no aparece en sitemap.xml.`);
    }
  }
}

for (const message of warnings) console.warn(`AVISO: ${message}`);
for (const message of errors) console.error(`ERROR: ${message}`);

if (errors.length > 0) {
  console.error(`\nValidación fallida: ${errors.length} error(es) y ${warnings.length} aviso(s).`);
  process.exit(1);
}

console.log(`Validación correcta: 0 errores y ${warnings.length} aviso(s).`);
