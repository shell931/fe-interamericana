import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }

  updateSeoData(data: SeoData): void {
    // Update title
    if (data.title) {
      this.titleService.setTitle(data.title);
    }

    // Update meta description
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
    }

    // Update keywords
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Update Open Graph tags
    if (data.ogTitle) {
      this.meta.updateTag({ property: 'og:title', content: data.ogTitle });
    }

    if (data.ogDescription) {
      this.meta.updateTag({ property: 'og:description', content: data.ogDescription });
    }

    if (data.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: data.ogImage });
    }

    // Update Twitter Card tags
    if (data.twitterTitle) {
      this.meta.updateTag({ name: 'twitter:title', content: data.twitterTitle });
    }

    if (data.twitterDescription) {
      this.meta.updateTag({ name: 'twitter:description', content: data.twitterDescription });
    }

    // Update canonical URL
    if (data.canonicalUrl) {
      this.updateCanonicalUrl(data.canonicalUrl);
    } else {
      // Auto-generate canonical URL from current route
      this.updateCanonicalUrl(this.getCurrentCanonicalUrl());
    }
  }

  // Método específico para productos de escobillas (PRIORIDAD ALTA)
  setEscobillasPageSeo(productType?: string): void {
    const baseTitle = 'Escobillas de Grafito y Carbón - Interamericana';
    const baseDescription = 'Especialistas en escobillas de grafito y carbón para tu vehículo. Las mejores escobillas de limpiaparabrisas. Calidad garantizada y compatibilidad perfecta.';
    const keywords = 'escobillas, escobillas de grafito, escobillas de carbon, limpiaparabrisas, escobillas auto';

    this.updateSeoData({
      title: productType ? `${productType} - ${baseTitle}` : baseTitle,
      description: baseDescription,
      keywords: keywords,
      ogTitle: baseTitle,
      ogDescription: baseDescription,
      twitterTitle: baseTitle,
      twitterDescription: baseDescription
    });
  }

  // Método específico para productos de rodamientos (PRIORIDAD MEDIA-ALTA)
  setRodamientosPageSeo(productType?: string): void {
    const baseTitle = 'Rodamientos para Carro - Interamericana';
    const baseDescription = 'Rodamientos de alta calidad para tu vehículo. Encuentra rodamientos de rueda, caja de cambios y motor. Garantía y durabilidad asegurada.';
    const keywords = 'rodamientos, rodamientos carro, rodamientos rueda, rodamientos motor';

    this.updateSeoData({
      title: productType ? `${productType} - ${baseTitle}` : baseTitle,
      description: baseDescription,
      keywords: keywords,
      ogTitle: baseTitle,
      ogDescription: baseDescription,
      twitterTitle: baseTitle,
      twitterDescription: baseDescription
    });
  }

  // Método específico para farolas y luces (PRIORIDAD MEDIA)
  setFarolasPageSeo(productType?: string): void {
    const baseTitle = 'Farolas y Luces para Carro - Interamericana';
    const baseDescription = 'Farolas, luces para carro y balastros para tu vehículo. Iluminación perfecta y seguridad garantizada en la carretera.';
    const keywords = 'farolas, farolas para carros, luces para carro, balastros';

    this.updateSeoData({
      title: productType ? `${productType} - ${baseTitle}` : baseTitle,
      description: baseDescription,
      keywords: keywords,
      ogTitle: baseTitle,
      ogDescription: baseDescription,
      twitterTitle: baseTitle,
      twitterDescription: baseDescription
    });
  }

  // Método específico para repuestos generales (enfocado en escobillas)
  setRepuestosPageSeo(productType?: string): void {
    const baseTitle = 'Escobillas y Rodamientos - Interamericana';
    const baseDescription = 'Especialistas en escobillas de grafito y carbón, rodamientos, farolas y luces para carro.';
    const keywords = 'escobillas, escobillas de grafito, escobillas de carbon, rodamientos, luces para carro, farolas, farolas para carros, balastros';

    this.updateSeoData({
      title: productType ? `${productType} - ${baseTitle}` : baseTitle,
      description: baseDescription,
      keywords: keywords,
      ogTitle: baseTitle,
      ogDescription: baseDescription,
      twitterTitle: baseTitle,
      twitterDescription: baseDescription
    });
  }

  // Método para páginas de detalle de producto
  setProductDetailSeo(productName: string, category: string, description?: string): void {
    const title = `${productName} - ${category} | Interamericana`;
    const metaDescription = description || `Compra ${productName} en Interamericana. ${category} de alta calidad con garantía. Envío rápido y seguro.`;

    let keywords = 'repuestos de carro, autopartes';

    // Agregar keywords específicas según la categoría
    if (category.toLowerCase().includes('escobilla')) {
      keywords += ', escobillas, escobillas de grafito, escobillas de carbon, limpiaparabrisas';
    } else if (category.toLowerCase().includes('rodamiento')) {
      keywords += ', rodamientos, rodamientos carro, rodamientos rueda';
    } else if (category.toLowerCase().includes('farola') || category.toLowerCase().includes('luz')) {
      keywords += ', farolas, farolas para carros, luces para carro, balastros';
    }

    this.updateSeoData({
      title: title,
      description: metaDescription,
      keywords: keywords,
      ogTitle: title,
      ogDescription: metaDescription,
      twitterTitle: title,
      twitterDescription: metaDescription
    });
  }

  private getCurrentCanonicalUrl(): string {
    const baseUrl = `${environment.domain}${environment.basePath}`;
    const currentPath = this.router.url;
    return `${baseUrl}${currentPath}`;
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement = document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  // Método para generar structured data (JSON-LD)
  generateProductStructuredData(product: any): void {
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Interamericana"
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "COP",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Interamericana"
        }
      }
    };

    if (product.image) {
      structuredData["image"] = product.image;
    }

    if (product.rating) {
      structuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "ratingCount": product.reviewCount || 1
      };
    }

    this.insertStructuredData(structuredData);
  }

  private insertStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Insert new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
}
