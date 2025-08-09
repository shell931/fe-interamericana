import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';


export interface Observacions {
   observation: any,

}

@Component({
   selector: 'embryo-TransfersDetailAdmSidebar',
   templateUrl: './TransfersDetailAdmSidebar.component.html',
   styleUrls: ['./TransfersDetailAdmSidebar.component.scss']
})
export class TransfersDetailAdmSidebarSidebarComponent implements OnInit {

   get_observations: Observacions[] = [];  
   val_request :any;
   val_transfer :any;
   refer_transfer: any;

   public show: boolean = false;

   public obser = new FormControl('', Validators.required);
   public newForm = new FormGroup({
      obser: this.obser,
   });

   constructor(
      private router: Router,
      public embryoService: EmbryoService,
      private apiService: ApiService,
      private loadingBar: LoadingBarService) { }

   ngOnInit() {
      
   }

   close() {
      this.embryoService.TransfersDetailAdmSidebarOpen = !this.embryoService.TransfersDetailAdmSidebarOpen;
   }

   getTotalPrice() {
      return 20000;
   }

   getData() {      
      this.val_request = localStorage.getItem('val_request');
      this.val_transfer = localStorage.getItem('val_transfer');
      this.refer_transfer = localStorage.getItem('refer_transfer');      
      let medetTrs = localStorage.getItem('detail_transfer');
      let obj = JSON.parse(medetTrs); 
      if(obj){
         return obj;
      }   
   }

   sendBinnacle() {
      this.show = false;
      var observation = (document.getElementById("message") as HTMLInputElement).value
      if(observation!=""){
         const id_store = localStorage.getItem('id-store');
         console.log(id_store);
         let type = "st" 
         let user_id = localStorage.getItem('id-user');
         let id_invoice_popup = localStorage.getItem('id_invoice_popup');
         let myObjCreateBinnacle = {
            'observation': observation,
            'user_id': user_id,
            'id_invoice_popup': id_invoice_popup,
            'type': type
         };
         this.apiService.createBinnacle(myObjCreateBinnacle).subscribe(
            result => {
               let id_invoice = localStorage.getItem('id_invoice_popup');
               this.apiService.getBinnacle(id_invoice, 'st').subscribe(
                  result => {
                     localStorage.removeItem("messajes");
                     let myJSONinvDetail = JSON.stringify(result);
                     localStorage.setItem('messajes', myJSONinvDetail);
                     this.getData()
                  }
               );
            }
         );
      }else{
         this.show = true;
      }
   }
}
