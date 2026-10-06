import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  constructor() { }

  private getBaseUrl(): string {
    return `${environment.domain}${environment.basePath}`;
  }

  generateSitemapXml(): string {
    const baseUrl = this.getBaseUrl();
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
      // Categorías principales de productos
      {
        loc: `${baseUrl}/products/escobillas`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/escobillas-grafito`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/escobillas-carbon`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/rodamientos`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/farolas`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/luces-carro`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/balastros`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/products/repuestos-carro`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.8'
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

  generateRobotsTxt(): string {
    const baseUrl = this.getBaseUrl();

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

  // Método para generar URLs dinámicamente desde productos de la API
  addProductUrls(products: any[]): string {
    const baseUrl = this.getBaseUrl();
    const currentDate = new Date().toISOString().split('T')[0];
    let productUrls = '';

    products.forEach(product => {
      if (product.id_product && product.type) {
        productUrls += `    <url>
        <loc>${baseUrl}/products/${product.type}/${product.id_product}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>

`;
      }
    });

    return productUrls;
  }

  // Método para generar sitemap completo con productos dinámicos
  generateCompleteSitemap(products: any[] = []): string {
    let sitemap = this.generateSitemapXml();

    if (products && products.length > 0) {
      const productUrls = this.addProductUrls(products);
      // Insertar las URLs de productos antes del cierre de urlset
      sitemap = sitemap.replace('</urlset>', productUrls + '</urlset>');
    }

    return sitemap;
  }
}
