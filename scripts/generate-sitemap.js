const fs = require('fs');
const path = require('path');

// Función para generar sitemap dinámico
function generateSitemap(domain = 'http://localhost:4200', basePath = '/interamericana') {
  const baseUrl = `${domain}${basePath}`;
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    // Página principal
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    // Página de productos principal
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    // Categorías principales de productos (por prioridad SEO)
    // PRIORIDAD ALTA: Escobillas
    {
      loc: `${baseUrl}/products/escobillas`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/products/escobillas-grafito`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/products/escobillas-carbon`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    // PRIORIDAD MEDIA-ALTA: Rodamientos
    {
      loc: `${baseUrl}/products/rodamientos`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    },
    // PRIORIDAD MEDIA: Farolas y Luces
    {
      loc: `${baseUrl}/products/farolas`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/products/luces-carro`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/products/farolas-para-carros`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/products/balastros`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    // Páginas de búsqueda
    {
      loc: `${baseUrl}/search`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    // Página de tiendas
    {
      loc: `${baseUrl}/storefront`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${baseUrl}/storelist`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7'
    },
    // Páginas informativas
    {
      loc: `${baseUrl}/terms_conditions`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      loc: `${baseUrl}/data_protection`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      loc: `${baseUrl}/help_pqr`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.4'
    },
    {
      loc: `${baseUrl}/payment_information`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: `${baseUrl}/assisted_buy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    }
  ];

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

`;

  urls.forEach(url => {
    sitemapXml += `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>

`;
  });

  sitemapXml += `</urlset>`;

  return sitemapXml;
}

function generateRobotsTxt(domain = 'http://localhost:4200', basePath = '/interamericana') {
  const baseUrl = `${domain}${basePath}`;

  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and checkout pages
Disallow: /admin-panel/
Disallow: /auth/
Disallow: /checkout/

# Allow product pages and categories
Allow: /products/
Allow: /storefront/
Allow: /search/

# Allow main pages
Allow: /home
Allow: /`;
}

// Leer argumentos de línea de comandos
const args = process.argv.slice(2);
const domain = args[0] || 'http://localhost:4200';
const basePath = args[1] || '/interamericana';

// Generar archivos
const sitemap = generateSitemap(domain, basePath);
const robots = generateRobotsTxt(domain, basePath);

// Escribir archivos
const distPath = path.join(__dirname, '../dist/interamericana');
const srcPath = path.join(__dirname, '../src');

// Crear directorio si no existe
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Escribir en src para desarrollo
fs.writeFileSync(path.join(srcPath, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(srcPath, 'robots.txt'), robots);

// Escribir en dist para producción
fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(distPath, 'robots.txt'), robots);

console.log(`✅ Sitemap y robots.txt generados para: ${domain}${basePath}`);
console.log(`📁 Archivos creados en: src/ y dist/interamericana/`);
