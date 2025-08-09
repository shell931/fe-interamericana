import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';

import { EmbryoService } from '../../../Services/Embryo.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
   selector: 'app-homeone',
   templateUrl: './HomeOne.component.html',
   styleUrls: ['./HomeOne.component.scss']
})
export class HomeoneComponent implements OnInit, AfterViewChecked {

   blogList: any;
   productReviews: any;
   productsArray: any;
   productsSliderData: any;
   newProductsSliderData: any;
   slideConfig = {
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
      responsive: [
         {
            breakpoint: 992,
            settings: {
               arrows: false,
               slidesToShow: 2,
               slidesToScroll: 1
            }
         },
         {
            breakpoint: 768,
            settings: {
               arrows: false,
               slidesToShow: 2,
               slidesToScroll: 2
            }
         },
         {
            breakpoint: 480,
            settings: {
               arrows: false,
               slidesToShow: 1,
               slidesToScroll: 1
            }
         }
      ]
   };

   rtlSlideConfig = {
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
      rtl: true,
      responsive: [
         {
            breakpoint: 992,
            settings: {
               arrows: false,
               slidesToShow: 2,
               slidesToScroll: 1
            }
         },
         {
            breakpoint: 768,
            settings: {
               arrows: false,
               slidesToShow: 2,
               slidesToScroll: 1
            }
         },
         {
            breakpoint: 480,
            settings: {
               arrows: false,
               slidesToShow: 1,
               slidesToScroll: 1
            }
         }
      ]
   };

   type          : any;
   pips          : boolean = true;
   tooltips      : boolean = true;
   category      : any;
   pageTitle     : string;
   subPageTitle  : string;

   constructor(
      private route: ActivatedRoute,
      private router: Router,

      public embryoService: EmbryoService,
      private cdRef: ChangeDetectorRef) {
      this.getFeaturedProducts();
      this.getBlogList();
      this.getProductRevies();

      this.embryoService.featuredProductsSelectedTab = 0;
      this.embryoService.newArrivalSelectedTab = 0;
   }

   ngOnInit() {
      this.route.params.subscribe(params => {
         this.route.queryParams.forEach(queryParams => {
            this.category = queryParams['category'];
            this.type = null;
            this.type = params['type'];
            this.getPageTitle();
         });
      });
   }

   public getPageTitle() {
      this.pageTitle = null;
      this.subPageTitle = null;
      
      switch (this.type || this.category) {
         case undefined:
            this.pageTitle = "Fashion";
            this.subPageTitle="Explore your favourite fashion style.";
            break;

         case "gadgets":
            this.pageTitle = "Gadgets";
            this.subPageTitle="Check out our new gadgets.";
            break;

         case "accessories":
            this.pageTitle = "Accessories";
            this.subPageTitle="Choose the wide range of best accessories.";
            break;
         
         default:
            this.pageTitle = "Products";
            this.subPageTitle = null;
            break;
      }
   }

   // public addToCart(value) {
   //    this.embryoService.addToCart(value);
   // }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }
   
   public transformHits(hits) {
      hits.forEach(hit => {
         hit.stars = [];
         for (let i = 1; i <= 5; i) {
           hit.stars.push(i <= hit.rating);
           i += 1;
         }
      });
      return hits;
   }

   ngAfterViewChecked(): void {
      this.cdRef.detectChanges();
   }

   public getFeaturedProducts() {
      this.embryoService.getProducts().valueChanges().subscribe(res => { this.productsArray = res });
   }

   public getBlogList() {
      this.embryoService.getBlogList().valueChanges().subscribe(res => { this.blogList = res });
   }

   public addToCart(value) {
      this.embryoService.addToCart(value);
   }

   public getProductRevies() {
      this.embryoService.getProductReviews().valueChanges().subscribe(res => { this.productReviews = res });
   }

   public addToWishlist(value) {
      this.embryoService.addToWishlist(value);
   }

   public onFeaturedSelectedTab(tabIndex) {
      this.productsSliderData = null;
      switch (tabIndex) {
         case 0:
            this.productsSliderData = this.productsArray.men;
            break;

         case 1:
            this.productsSliderData = this.productsArray.women;
            break;

         case 2:
            this.productsSliderData = this.productsArray.gadgets;
            break;

         case 3:
            this.productsSliderData = this.productsArray.accessories;
            break;

         default:
            // code...
            break;
      }

      return true;
   }

   public onNewArrivalsSelectedTab(tabIndex) {
      this.newProductsSliderData = null;
      switch (tabIndex) {
         case 0:
            this.newProductsSliderData = this.productsArray.men;
            break;

         case 1:
            this.newProductsSliderData = this.productsArray.women;
            break;

         case 2:
            this.newProductsSliderData = this.productsArray.gadgets;
            break;

         case 3:
            this.newProductsSliderData = this.productsArray.accessories;
            break;

         default:
            // code...
            break;
      }

      return true;
   }
}
