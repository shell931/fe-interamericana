import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmbryoService } from '../../../Services/Embryo.service';
import { environment } from '../../../../../src/environments/environment';
import { disposeEmitNodes } from 'typescript';
import { SwiperOptions } from 'swiper/core';

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
   templateUrl: './ProductsList.component.html',
   styleUrls: ['./ProductsList.component.scss']
})

export class ProductsListComponent implements OnInit {


   // public config: SwiperConfigInterface = {
   //    a11y: true,
   //    direction: 'horizontal',
   //    slidesPerView: 1,
   //    keyboard: true,
   //    mousewheel: true,
   //    scrollbar: false,
   //    navigation: true,
   //    pagination: false,
   //    observer: true,
   //    observeParents: true
   // };
  config: SwiperOptions = {
   spaceBetween: 0,
   loop: true,
   speed: 1000,
   centeredSlides: true,
   autoplay: {
     delay: 2500,
     disableOnInteraction: false,
   },
   pagination: {
     el: '.swiper-pagination',
     clickable: true,
   },
   navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
   },
  };



   get_product: Prod[] = [];
   get_store: Store[] = [];
   loaded = false;
   type: any;
   pips: boolean = true;
   tooltips: boolean = true;
   category: any;
   pageTitle: string;
   subPageTitle: string;
   p: any;

   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

   storeGrid: Store[] = [];
   obsStore: Observable<any>;
   dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);

   productsGrid: Prod[] = [];
   obs: Observable<any>;
   dataSource = new MatTableDataSource<Prod>([]);

   public subscribers: any = {};

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private changeDetectorRef: ChangeDetectorRef,
   ) {
   }

   storelist: Prod[] = [];
   ngOnInit() {
      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.getPageTitle();
            console.log("aa");
            // this.apiService.stablishPopUpHome();
         });
      });

      // Inicializar el dataSource con un array vacío
      this.dataSource = new MatTableDataSource<Prod>([]);
      this.dataSource.paginator = this.paginator;

      this.apiService.getProductsWithoutAuth().subscribe(
         res => {
            console.log('API Response:', res);
            this.getProductData(res);
         },
         error => {
            console.error('API Error:', error);
         }
      );
      this.apiService.getStoreWithoutAuth().subscribe(res => this.getStoreData(res));
   }


   mostrarbanner1() {

      document.getElementById("bannershow1").classList.add('hide');

   }

   mostrarbanner2() {

      document.getElementById("bannershow2").classList.add('hide');

   }

   getProductData(response) {
      console.log("Processing API Response:", response);
      if (!response) {
         console.error('Invalid response format:', response);
         return;
      }

      this.get_product = [];

      // Process each product in the array
      response.forEach(product => {
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
         route_product: '/products/accessories/' + get_id_product
         });
      });

      console.log('Processed Products:', this.get_product);

      // Update productsGrid and dataSource
      this.productsGrid = [...this.get_product];
      this.dataSource.data = this.productsGrid;

      // Force change detection
      this.changeDetectorRef.detectChanges();

      console.log('Final Products Grid:', this.productsGrid);
      console.log('DataSource Data:', this.dataSource.data);
   }

   getStoreData(response) {

      this.storeGrid = null;
      this.get_store = [];

      let length
      if (response.length < 12) {
         length = response.length;
      } else {
         length = 12;
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
      this.storeGrid = this.get_store;
      console.log(this.storeGrid);

      this.dataSourceStore = new MatTableDataSource<Store>(this.storeGrid);
      this.changeDetectorRef.detectChanges();
      this.dataSourceStore.paginator = this.paginator;
      this.obsStore = this.dataSourceStore.connect();

   }


   public onLoad() {
      this.loaded = true;
   }

   public checkCartAlready(singleProduct) {
      let products = JSON.parse(localStorage.getItem("cart_item")) || [];
      if (!products.some((item) => item.name == singleProduct.name)) {
         return true;
      }
   }

   public productAddToWishlist(value: any) {
      this.embryoService.addToWishlist(value);
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
         "quantity": 1,
         "canti": 1,
         "image": value.image,
         "route_product": value.route_product
      };

      let products = JSON.parse(localStorage.getItem("cart_item")) || [];
      if (products.length > 0) {

         this.embryoService.addToCart(myObj_product);

         // let id_store_storage;
         // for (var i = 0; i < 1; i++) {
         //     id_store_storage = products[i].id_store;
         // }
         // console.log(id_store_storage);
         // console.log(value.store_id);
         // if (id_store_storage == value.store_id) {
         //     this.embryoService.addToCart(value);
         // }
         // else {
         //     //   const dialogRef = this.dialog.open(DialogContentProductDiferentStoreDetail, {
         //     //      width: '500px',
         //     //    });
         //     //   dialogRef.afterClosed().subscribe(result => {
         //     //      console.log(`Dialog result: ${result}`);
         //     //   });
         // }
      } else {
         this.embryoService.addToCart(myObj_product);
      }

   }



   public getPageTitle() {
      this.pageTitle = null;
      this.subPageTitle = null;

      switch (this.type || this.category) {
         case undefined:
            this.pageTitle = "Store";
            // this.subPageTitle = "Explore your favourite fashion style.";
            break;

         // case "gadgets":
         //    this.pageTitle = "Gadgets";
         //    this.subPageTitle="Check out our new gadgets.";
         //    break;

         // case "accessories":
         //    this.pageTitle = "Accessories";
         //    this.subPageTitle="Choose the wide range of best accessories.";
         //    break;

         // default:
         //    this.pageTitle = "Products";
         //    this.subPageTitle = null;
         //    break;
      }
   }

   public addToCart(value) {

      console.log(value);

      let myObj_product = {
         "brand": value.brand,
         "discount_price": value.discount_price,
         "id_product": value.id_product,
         "id_store": value.id_store,
         "name": value.name,
         "price": value.price,
         "produc_code": value.produc_code,
         "quantity": 1,
         "image": value.image,
         "route_product": value.route_product
      };

      this.embryoService.addToCart(myObj_product);
   }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }

   extendGridStructure() {
      // this.router.navigate(['/storelist']);
      this.router.navigate(['/storefront/6']);
   }


}
