import { Component, OnInit } from '@angular/core';
import { SitemapService } from '../../Services/sitemap.service';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  template: ''
})
export class SitemapComponent implements OnInit {

  constructor(
    private sitemapService: SitemapService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Generar sitemap con productos dinámicos
    this.generateSitemap();
  }

  private generateSitemap() {
    // Obtener productos de la API para generar URLs dinámicas
    this.apiService.getProductsWithoutAuth().subscribe({
      next: (products: any) => {
        const sitemap = this.sitemapService.generateCompleteSitemap(products);
        this.serveSitemap(sitemap);
      },
      error: () => {
        console.warn('No se pudieron cargar productos para sitemap, usando sitemap básico');
        const sitemap = this.sitemapService.generateSitemapXml();
        this.serveSitemap(sitemap);
      }
    });
  }

  private serveSitemap(sitemapContent: string) {
    // Configurar respuesta como XML
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    // Crear elemento de descarga temporal
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';

    // Limpiar
    window.URL.revokeObjectURL(url);

    // En un entorno real, esto sería servido por el servidor
    console.log('Sitemap generado:', sitemapContent);
  }
}
