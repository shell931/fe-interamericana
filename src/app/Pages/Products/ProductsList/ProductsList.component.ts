import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { SeoService } from '../../../Services/seo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmbryoService } from '../../../Services/Embryo.service';
import { environment } from '../../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PromoDialogComponent } from '../../../Global/PromoDialog/PromoDialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { GlobalModule } from '../../../Global/Global.module';
import { TemplatesModule } from '../../../Templates/Templates.module';
import { BarRatingModule } from 'ngx-bar-rating';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RatingComponent } from '../../../Global/Rating/Rating.component';

// Import Swiper for initialization
import { register } from 'swiper/element/bundle';


export interface Prod {
   image: string;
   name: string;
   price: string;
   produc_code: string;
   brand: string;
   product_code: string;
   discount_price: string;
   id_product: string;
   route_product: string;
   id_store: string;
   // Missing properties used in template
   id?: string;
   type?: string;
   rating?: number;
   route_store?: string;
}

export interface Store {
   id_store: string;
   name_store: string;
   state_store: string;
   city: string;
   logo_store: string;
   route_store: string;
   description: string;
}

@Component({
   selector: 'app-ProductsList',
   standalone: true,
   imports: [
   CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatPaginatorModule,
      MatListModule,
      MatDialogModule,
   MatDividerModule,
      // NgxPaginationModule, // Module imports not allowed in standalone components
      // SwiperModule, // Module imports not allowed in standalone components  
      GlobalModule,
      TemplatesModule,
      BarRatingModule,
      LazyLoadImageModule,

   ],
   templateUrl: './ProductsList.component.html',
   styleUrls: ['./ProductsList.component.scss'],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductsListComponent implements OnInit, OnDestroy {

   get_product: Prod[] = [];
   get_store: Store[] = [];
   loaded = false;
   type: any;
   pips: boolean = false;
   tooltips: boolean = false;
   
   // Properties used in template
   product: any; // Used in template for AddToCardButton
   rate: number = 0; // Used in  component
   category: any;
   pageTitle: string | null = null;
   subPageTitle: string | null = null;
   p: any;

   @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

   storeGrid: Store[] = [];
   obsStore!: Observable<any>;
   dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);

   productsGrid: Prod[] = [];
   obs!: Observable<any>;
   dataSource = new MatTableDataSource<Prod>([]);

   public subscribers: any = {};

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private changeDetectorRef: ChangeDetectorRef,
      private dialog: MatDialog,
      private seoService: SeoService,
   ) {}

   storelist: Prod[] = [];

   ngOnInit() {
      // Register Swiper custom elements
      register();
      
      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.type = params['type'];
            this.category = queryParams['category'];

            // Configurar SEO según el tipo de producto
            this.setSeoForProductType(this.type);
         });
      });

      this.apiService.getProductsWithoutAuth().subscribe(
         (res: any) => {
            console.log('API Response:', res);
            this.getProductData(res);
         },
         (error: any) => {
            console.error('API Error:', error);
         }
      );
      this.apiService.getStoreWithoutAuth().subscribe((res: any) => this.getStoreData(res));

      // Abrir diálogo promocional (reemplazo del services-section)
      this.maybeOpenPromoDialog();
   }

   ngOnDestroy() {
      // Cleanup any subscriptions if needed
   }

   private maybeOpenPromoDialog(): void {
      // Mostrar solo una vez por sesión
      if (sessionStorage.getItem('promo_shown') === '1') {
         return;
      }
      sessionStorage.setItem('promo_shown', '1');

      this.dialog.open(PromoDialogComponent, {
         panelClass: 'promo-dialog-panel',
         maxWidth: 'none',
         width: 'auto',
         hasBackdrop: true,
         backdropClass: 'promo-backdrop',
         closeOnNavigation: true,
         disableClose: false,
         autoFocus: false,
         restoreFocus: false,
         data: {
            imageUrl: 'https://market-docus-v2.s3.us-east-2.amazonaws.com/Modal+Crear+tienda.png',
            alt: 'Crea tu tienda'
         }
      });
   }

   mostrarbanner1() {
      const bannershow1 = document.getElementById("bannershow1");
      if (bannershow1) {
         bannershow1.classList.add('hide');
      }
   }

   mostrarbanner2() {
      const bannershow2 = document.getElementById("bannershow2");
      if (bannershow2) {
         bannershow2.classList.add('hide');
      }
   }

   getProductData(response: any[]) {
      console.log("Processing API Response:", response);
      if (!response) {
         console.error('Invalid response format:', response);
         return;
      }

      this.get_product = [];

      response.forEach((product: any) => {
         let get_image = environment.api.baseBucketImageUrl + product.image;
         let get_name_product = product.name_product;
         let get_total_price = product.total_price;
         let get_produc_code = product.product_code;
         let get_brand = product.brand;
         let get_product_code = product.product_code;
         let get_discount_price = product.discount_price;
         let get_id_product = product.id_product;
         let get_id_store = product.store;

         this.get_product.push({
            image: get_image,
            name: get_name_product,
            price: get_total_price,
            produc_code: get_produc_code,
            brand: get_brand,
            product_code: get_product_code,
            discount_price: get_discount_price,
            id_product: get_id_product,
            id_store: get_id_store,
            route_product: '/products/accessories/' + get_id_product,
            rating: product.rating ?? 0,
            type: product.type ?? 'accessories'
         });
      });

      console.log('Processed Products:', this.get_product);

      this.productsGrid = [...this.get_product];
      this.dataSource.data = this.productsGrid;

      this.changeDetectorRef.detectChanges();

      console.log('Final Products Grid:', this.productsGrid);
      console.log('DataSource Data:', this.dataSource.data);
   }

   getStoreData(response: any[]) {
      this.get_store = [];

      let length
      const maxItems = this.getMaxItemsPerPage();
      if (response.length < maxItems) {
         length = response.length;
      } else {
         length = maxItems;
      }

      for (var i = 0; i < length; i++) {
         let get_id_store = response[i].id_store;
         let get_name_store = response[i].name_store;
         let get_state_store = response[i].state_store;
         let get_city = response[i].city;
         let get_logo_store = response[i].logo_store;
         let get_description = response[i].description;

         this.get_store.push({
            id_store: get_id_store,
            name_store: get_name_store,
            state_store: get_state_store,
            city: get_city,
            logo_store: environment.api.baseBucketImageUrl + response[i].logo_store_up,
            route_store: '/storefront/' + get_id_store,
            description: get_description,
         });
      }

      if (this.get_store && this.get_store.length > 0) {
         this.storeGrid = this.get_store;
         console.log(this.storeGrid);
         this.dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
         this.changeDetectorRef.detectChanges();
         this.dataSourceStore.paginator = this.paginator;
         this.obsStore = this.dataSourceStore.connect();
      } else {
         console.warn('No stores data to display.');
      }
   }

   public onLoad() {
      this.loaded = true;
   }

   /**
    * getMaxItemsPerPage returns the maximum number of items to display per page
    */
   public getMaxItemsPerPage(): number {
      // This could be made configurable through environment or service
      return 12;
   }

   /**
    * getDefaultPageTitle returns the default page title
    */
   public getDefaultPageTitle(): string {
      // This could be made configurable through environment or service
      return "Store";
   }

   /**
    * getBannerImages returns the banner images for the carousel
    */
   public getBannerImages(): Array<{src: string, alt: string}> {
      // Return the banner images
      return [
         { src: 'assets/kompralostyle/image/catalog/slideshow/home3/sliderbanner.jpg', alt: 'Repuestos de carro y autopartes - Interamericana' },
         { src: 'assets/kompralostyle/image/catalog/slideshow/home3/sliderbanner2.jpg', alt: 'Escobillas de grafito, rodamientos y farolas para carros' }
      ];
   }

   /**
    * getPaymentCardsImage returns the payment cards image if available
    */
   public getPaymentCardsImage(): string | null {
      // This could be made configurable through environment or service
      // For now, return null to hide the payment cards image
      return null;
   }

   /**
    * getShippingIcon returns the shipping icon if available
    */
   public getShippingIcon(): string | null {
      // This could be made configurable through environment or service
      // For now, return null to hide the shipping icon
      return null;
   }

   public checkCartAlready(singleProduct: any): boolean {
      let products = JSON.parse(localStorage.getItem("cart_item") || '[]');
      if (!products.some((item: any) => item.name === singleProduct.name)) {
         return true;
      }
      return false;
   }

   public productAddToWishlist(value: any, index?: string) {
      this.embryoService.addToWishlist(value);
      
      // Cambiar el ícono del corazón a lleno
      if (index) {
         const el = document.getElementById(index);
         if (el && !el.classList.contains('wishlist-active')) {
            el.classList.add('wishlist-active');
            const heartIcon = el.querySelector('i');
            if (heartIcon) {
               heartIcon.className = 'fa fa-heart';
            }
         }
      }
   }

   // Verificar si un producto está en la lista de deseos
   public checkWishlistAlready(product: any): boolean {
      const wishlistItem = localStorage.getItem("wishlist_item");
      if (wishlistItem) {
         const wishlistProducts = JSON.parse(wishlistItem);
         return wishlistProducts.some((item: any) => item.name === product.name);
      }
      return false;
   }

   public addToCartProduct(value: any) {
      let myObj_product = {
         "brand": value.brand,
         "discount_price": value.discount_price,
         "id_product": value.id_product,
         "id_store": value.id_store,
         "name": value.name,
         "price": value.price,
         "produc_code": value.produc_code,
         "quantity": value.quantity || 1,
         "canti": value.canti || 1,
         "image": value.image,
         "route_product": value.route_product
      };

      let products = JSON.parse(localStorage.getItem("cart_item") || '[]');
      if (products.length > 0) {
         this.embryoService.addToCart(myObj_product);
      } else {
         this.embryoService.addToCart(myObj_product);
      }
   }

   private setSeoForProductType(type: string): void {
      if (!type) {
         this.seoService.setRepuestosPageSeo();
         return;
      }

      const typeLower = type.toLowerCase();

      if (typeLower.includes('escobilla')) {
         this.seoService.setEscobillasPageSeo(type);
      } else if (typeLower.includes('rodamiento')) {
         this.seoService.setRodamientosPageSeo(type);
      } else if (typeLower.includes('farola') || typeLower.includes('luz') || typeLower.includes('balastro')) {
         this.seoService.setFarolasPageSeo(type);
      } else {
         this.seoService.setRepuestosPageSeo(type);
      }
   }

   getPageTitle(): string {
      if (!this.type) {
         return 'Escobillas de Grafito y Rodamientos - Interamericana';
      }

      const typeLower = this.type.toLowerCase();

      if (typeLower.includes('escobilla')) {
         return 'Escobillas de Grafito y Carbón para Carro';
      } else if (typeLower.includes('rodamiento')) {
         return 'Rodamientos para Carro y Vehículos';
      } else if (typeLower.includes('farola') || typeLower.includes('luz')) {
         return 'Farolas y Luces para Carro';
      } else if (typeLower.includes('balastro')) {
         return 'Balastros para Farolas de Carro';
      } else {
         return `${this.type} - Interamericana`;
      }
   }

   getPageDescription(): string {
      if (!this.type) {
         return 'Especialistas en escobillas de grafito y carbón, rodamientos, farolas y luces para carro.';
      }

      const typeLower = this.type.toLowerCase();

      if (typeLower.includes('escobilla')) {
         return 'Especialistas en escobillas de grafito y carbón de alta calidad para limpiaparabrisas. Las mejores escobillas compatible con todas las marcas de vehículos.';
      } else if (typeLower.includes('rodamiento')) {
         return 'Rodamientos de precisión para ruedas, motor y caja de cambios. Durabilidad y rendimiento garantizado para tu vehículo.';
      } else if (typeLower.includes('farola') || typeLower.includes('luz')) {
         return 'Farolas y luces para carro de alta calidad. Iluminación perfecta y seguridad garantizada en la carretera.';
      } else if (typeLower.includes('balastro')) {
         return 'Balastros para farolas de carro. Componentes eléctricos de calidad para el sistema de iluminación de tu vehículo.';
      } else {
         return `Encuentra los mejores ${this.type} para tu vehículo. Especialistas en escobillas y rodamientos.`;
      }
   }

   getSectionTitle(): string {
      if (!this.type) {
         return 'Productos Destacados';
      }

      const typeLower = this.type.toLowerCase();

      if (typeLower.includes('escobilla')) {
         return 'Escobillas Destacadas';
      } else if (typeLower.includes('rodamiento')) {
         return 'Rodamientos Destacados';
      } else if (typeLower.includes('farola') || typeLower.includes('luz')) {
         return 'Farolas y Luces Destacadas';
      } else if (typeLower.includes('balastro')) {
         return 'Balastros Destacados';
      } else {
         return 'Productos Destacados';
      }
   }

   getSectionDescription(): string {
      if (!this.type) {
         return 'Las mejores escobillas de grafito, rodamientos y repuestos seleccionados especialmente para ti.';
      }

      const typeLower = this.type.toLowerCase();

      if (typeLower.includes('escobilla')) {
         return 'Las mejores escobillas de grafito y carbón para tu vehículo. Especialistas en escobillas con calidad y durabilidad garantizada.';
      } else if (typeLower.includes('rodamiento')) {
         return 'Rodamientos de alta precisión para un funcionamiento óptimo de tu vehículo. Calidad profesional garantizada.';
      } else if (typeLower.includes('farola') || typeLower.includes('luz')) {
         return 'Farolas y luces de calidad superior para una iluminación perfecta y segura en tu vehículo.';
      } else if (typeLower.includes('balastro')) {
         return 'Balastros confiables para el sistema de iluminación de tu vehículo.';
      } else {
         return `Los mejores ${this.type} seleccionados por nuestros especialistas en escobillas y rodamientos.`;
      }
   }

   getProductImageAlt(product: any): string {
      if (!product) {
         return 'Repuesto de carro - Interamericana';
      }

      const productName = product.name || 'Producto';
      const productType = product.type || this.type || 'repuesto';

      // Generar alt tag descriptivo basado en el tipo de producto
      const typeLower = String(productType).toLowerCase();

      if (typeLower.includes('escobilla')) {
         return `${productName} - Escobilla de grafito para carro | Interamericana`;
      } else if (typeLower.includes('rodamiento')) {
         return `${productName} - Rodamiento para carro | Interamericana`;
      } else if (typeLower.includes('farola') || typeLower.includes('luz')) {
         return `${productName} - Farola y luz para carro | Interamericana`;
      } else if (typeLower.includes('balastro')) {
         return `${productName} - Balastro para farola de carro | Interamericana`;
      } else {
         return `${productName} - Repuesto de carro | Interamericana`;
      }
   }

   public addToCart(value: any) {
      console.log(value);

      let myObj_product = {
         "brand": value.brand,
         "discount_price": value.discount_price,
         "id_product": value.id_product,
         "id_store": value.id_store,
         "name": value.name,
         "price": value.price,
         "produc_code": value.produc_code,
         "quantity": value.quantity || 1,
         "image": value.image,
         "route_product": value.route_product
      };

      this.embryoService.addToCart(myObj_product);
   }

   public addToWishList(value: any) {
      this.embryoService.addToWishlist(value);
   }

   extendGridStructure() {
      // Interamericana: el catálogo completo es la tienda única (id 6)
      this.router.navigate(['/storefront/6']);
   }

   /**
    * onImageError is used to handle image loading errors by setting a fallback image.
    */
   public onImageError(event: any) {
      console.log('Image loading error:', event);
      // Use a generic placeholder instead of a specific product image
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xMjUgMTI1SDc1VjE3NUgxMjVWMTI1WiIgZmlsbD0iI0RFRTJFNiIvPgo8cGF0aCBkPSJNMTI1IDEwMEg3NVYxMjVIMTI1VjEwMFoiIGZpbGw9IiNERTJFMkUiLz4KPHN2ZyB4PSIxMjUiIHk9IjEwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9Ijc1IiB2aWV3Qm94PSIwIDAgNTAgNzUiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNMjUgMTIuNUMzNS4yIDEyLjUgNDMuNSAyMC44IDQzLjUgMzFWMzcuNUM0My41IDQ3LjcgMzUuMiA1NiA0My41IDU2SDQzLjVWNjIuNUM0My41IDcyLjcgMzUuMiA4MSAyNSA4MUg2LjVDLTMuNyA4MSAtMTIgNzIuNyAtMTIgNjIuNVYzMS4wQy0xMiAyMC44IC0zLjcgMTIuNSA2LjUgMTIuNUgyNVoiIGZpbGw9IiNERTJFMkUiLz4KPC9zdmc+Cjwvc3ZnPgo=';
   }
}

