import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';

@Component({
   selector: 'app-FinalReceiptFail',
   templateUrl: './FinalReceiptFail.component.html',
   styleUrls: ['./FinalReceiptFail.component.scss']
})
export class FinalReceiptFailComponent implements OnInit {

   deliveryDate: any;
   products: any;
   userDetails: any;
   invoiceDetails: any;
   LocationDetail: any;
   todayDate: any = new Date();
   get_location: any;

   constructor(public embryoService: EmbryoService, public router: Router, private apiService: ApiService) {
      this.getDeliveryDate();
      this.userDetails = JSON.parse(localStorage.getItem("user"));
      this.invoiceDetails = JSON.parse(localStorage.getItem("InvoiceDetail"));
      this.LocationDetail = JSON.parse(localStorage.getItem("LocationDetail"));
   }

   ngOnInit() {
   }



   getDataLocations(response) {
      for (var i = 0; i < response.length; i++) {
         let id = response[i].id;
         let nameci = response[i].nameci;
         let departament = response[i].departament;
         let number = response[i].number;
         let neighborhood = response[i].neighborhood;
         let via = response[i].via;
         let sn = response[i].sn;
         let additional_data = response[i].additional_data;
         let phone = response[i].phone;
         let contact = response[i].contact;
         let predetermined = response[i].predetermined;
         this.get_location = {
            "id": id,
            "nameci": nameci,
            "departament": departament,
            "number": number,
            "neighborhood": neighborhood,
            "via": via,
            "sn": sn,
            "additional_data": additional_data,
            "phone": phone,
            "contact": contact,
            "predetermined": predetermined
         };
      }
   }

   public getDeliveryDate() {
      this.deliveryDate = new Date();
      this.deliveryDate.setDate(this.deliveryDate.getDate() + 5);
   }

   public calculateProductSinglePrice(product: any, value: any) {
      let price = 0;
      if (!value) {
         value = 1;
      }
      price = product.price * value;
      return price;
   }

   public calculateTotalPrice() {
      let subtotal = 0;
      if (this.embryoService.buyUserCartProducts && this.embryoService.buyUserCartProducts.length > 0) {
         for (let product of this.embryoService.buyUserCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            subtotal += (product.price * product.quantity);
         }
         return subtotal;
      }
      return subtotal;
   }

   public getTotalPrice() {
      let total = 0;
      if (this.embryoService.buyUserCartProducts && this.embryoService.buyUserCartProducts.length > 0) {
         for (let product of this.embryoService.buyUserCartProducts) {
            if (!product.quantity) {
               product.quantity = 1;
            }
            total += (product.price * product.quantity);
         }
         // total += (this.embryoService.shipping+this.embryoService.tax);
         return total;
      }
      return total;
   }

   public goToHome() {
      this.embryoService.removeBuyProducts();
      this.router.navigate(['/']);
   }

}
