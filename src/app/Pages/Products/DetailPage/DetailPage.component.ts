import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { SeoService } from '../../../Services/seo.service';
import { MetaPixelService } from '../../../Services/meta-pixel.service';
import { environment } from '../../../../../src/environments/environment';

export interface Prod {
   image: string;
   // name_product: string;
   // total_price: string;
   product_code: string;
   brand: string;
   discount_price: number;
   // id_product: string;
   availablity: boolean;
   category: string;
   category_type: string;
   color: string;
   description: string;
   id: number;
   // image_gallery: string;
   name: string;
   popular: boolean;
   price: number;
   quantity: number;
   rating: number;
   status: boolean;
   // tags: string;
   type: string;
}

@Component({
   selector: 'app-DetailPage',
   templateUrl: './DetailPage.component.html',
   styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   id: any;
   type: any;
   apiResponse: any;
   singleProductData: any;
   productsList: any;
   productsGrid: any;
   get_pr: any[] = [];

   constructor(private route: ActivatedRoute,
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private seoService: SeoService,
      private metaPixel: MetaPixelService) {

   }

   ngOnInit() {
      this.route.params.subscribe(res => {
         this.id = res.id;
         this.type = res.type;
      })
      this.apiService.getProductsbyId(this.id).subscribe(res => {
         this.getProductData(res);
         this.updateProductSeo(res);
      });
   }

   getProductData(response) {

      console.log(response);



      let gallery = response.rel_product;
      this.get_pr = [];
      for (var i = 0; i < gallery.length; i++) {
         let image_route = gallery[i].image;
         this.get_pr[i] = image_route;
      }

      let myObj_product;
      myObj_product = {
         availablity: response.availability,
         brand: response.brand,
         category: "Jewellery",
         category_type: "accessories",
         color: "Black",
         description: response.description_product,
         discount_price: response.discount_price,
         id: response.id_product,
         image: environment.api.baseBucketImageUrl + response.image,
         image_gallery: this.get_pr,
         name: response.name_product,
         popular: false,
         price: response.total_price,
         product_code: response.product_code,
         stock: response.stock,
         rating: response.rating,
         store_id: response.store,
         status: true,
         type: "accessories",
         quantity: 1,
         valid_quant:1
      };
      this.productsGrid = myObj_product;
      this.metaPixel.trackViewContent(myObj_product);
   }

   // public getData() {
   //    this.embryoService.getProducts().valueChanges().subscribe(res => this.checkResponse(res));
   // }

   // public checkResponse(response) {
   //    this.productsList = null;
   //    this.productsList = response[this.type];
   //    for (let data of this.productsList) {
   //       if (data.id == this.id) {
   //          console.log("single");
   //          console.log(data);
   //          this.singleProductData = data;
   //          break;
   //       }
   //    }
   // }

   public addToCart(value) {
      this.embryoService.addToCart(value);
   }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }

   updateProductSeo(productData: any): void {
      if (!productData) return;

      const productName = productData.name_product || 'Producto';
      const productDescription = productData.description_product || '';
      const productType = this.type || 'repuesto';

      // Configurar SEO específico del producto
      this.seoService.setProductDetailSeo(productName, productType, productDescription);

      // Generar structured data para el producto
      const structuredProduct = {
         name: productName,
         description: productDescription,
         price: productData.total_price,
         brand: productData.brand,
         image: productData.image ? environment.api.baseBucketImageUrl + productData.image : null,
         inStock: productData.availability,
         rating: productData.rating,
         reviewCount: 1
      };

      this.seoService.generateProductStructuredData(structuredProduct);
   }

}
