import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { EmbryoService } from '../../../Services/Embryo.service';
import { PopupManagerService } from '../../../Services/popup-manager.service';
import { CommonSignInComponent } from '../../../Global/CommonSignIn/CommonSignIn.component';

@Component({
  selector: 'app-Signin',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterModule,
    MatCardModule,
    CommonSignInComponent
  ],
  templateUrl: './Signin.component.html',
  styleUrls: ['./Signin.component.scss']
})
export class SigninComponent implements OnInit {


   constructor(public embryoService : EmbryoService,
               private popupManager : PopupManagerService) { }

   ngOnInit() {
   }

   public toggleRightSidenav() {
      this.popupManager.tryOpenPopup('cart');
   }

   public getCartProducts() {
      let total = 0;
      if(this.embryoService.localStorageCartProducts && this.embryoService.localStorageCartProducts.length>0) {
         for(let product of this.embryoService.localStorageCartProducts) {
            if(!product.quantity){
               product.quantity = 1;
            }
            total += (product.price*product.quantity);
         }
         total += (this.embryoService.shipping+this.embryoService.tax);
         return total;
      }
      return total;  
   }

}

