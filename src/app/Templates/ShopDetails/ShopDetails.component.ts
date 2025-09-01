import { Component, OnInit, Input, OnChanges, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmbryoService } from '../../Services/Embryo.service';

@Component({
   selector: 'embryo-ShopDetails',
   templateUrl: './ShopDetails.component.html',
   styleUrls: ['./ShopDetails.component.scss']
})
export class ShopDetailsComponent implements OnInit, OnChanges {

   @Input() detailData: any;
   @Input() currency: string;

   mainImgPath: string;
   totalPrice: any;
   type: any;
   colorsArray: string[] = ["Red", "Blue", "Yellow", "Green"];
   sizeArray: number[] = [36, 38, 40, 42, 44, 46, 48];
   quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   productReviews: any;
   public validate_canti: boolean = false;

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      public dialog: MatDialog
   ) {

   }

   ngOnInit() {
      this.mainImgPath = this.detailData.image;
      this.totalPrice = this.detailData.price;
      this.route.params.subscribe(res => {
         console.log(res);

         this.type = null;
         this.type = res.type;
      });
   }

   ngOnChanges() {
      this.mainImgPath = null;
      this.totalPrice = null;
      this.mainImgPath = this.detailData.image;
      this.totalPrice = this.detailData.price;
   }

   /**
    * getImagePath is used to change the image path on click event.
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += " border-active";
   }

   public calculatePrice(detailData: any, value: any) {
      detailData.valid_quant = value;
      if (!value) {
         value = 1;
         detailData.valid_quant = 0;
      }
      detailData.quantity = value;
      if(value <= detailData.stock){
         this.totalPrice = detailData.price * value;
      }else{
         this.totalPrice = detailData.price;
      }
   }

   public reviewPopup(detailData) {
      let reviews: any = null;
      for (let review of this.productReviews) {
         reviews = review.user_rating;
      }

   }

   public addToWishlist(value: any) {
      this.embryoService.addToWishlist(value);
   }

   public addToCart(value: any) {

      this.validate_canti = false;

      if (value.valid_quant == 0) {
         this.validate_canti = true;
      } else {
         let myObj_product = {
            "brand": value.brand,
            "discount_price": value.discount_price,
            "id_product": value.id,
            "id_store": value.store_id,
            "name": value.name,
            "price": value.price,
            "produc_code": value.product_code,
            "quantity": value.quantity,
            "canti":  value.quantity,
            "image": value.image,
            "route_product": "na",
            "stock": value.stock
         };

         let products = JSON.parse(localStorage.getItem("cart_item")) || [];
         if (products.length > 0) {
            this.embryoService.addToCart(myObj_product);

            // let id_store_storage;
            // for (var i = 0; i < 1; i++) {
            //    id_store_storage = products[i].id_store;
            // }
            // console.log(id_store_storage);
            // console.log(value.store_id);
            // if (id_store_storage == value.store_id) {
            //    this.embryoService.addToCart(value);
            // }
            // else {
            //    const dialogRef = this.dialog.open(DialogContentProductDiferentStoreDetail, {
            //       width: '500px',
            //     });
            //    dialogRef.afterClosed().subscribe(result => {
            //       console.log(`Dialog result: ${result}`);
            //    });
            // }
         } else {
            this.embryoService.addToCart(myObj_product);
         }
         // this.embryoService.addToCart(value);
      }
   }

   // Función simple para manejar rutas de assets en producción
   getAssetUrl(path: string): string {
      // Si ya es una URL completa (http/https), la devolvemos tal como está
      if (path && (path.startsWith('http') || path.startsWith('//'))) {
         return path;
      }
      // Para rutas relativas, Angular las maneja automáticamente con base-href
      return path;
   }
}

@Component({
   selector: 'ProductGrid-modal-product-diferent-store',
   templateUrl: 'ProductGrid-modal-product-diferent-store.html',
})

export class DialogContentProductDiferentStoreDetail { }

