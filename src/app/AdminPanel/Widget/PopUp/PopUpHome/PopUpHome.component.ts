import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

@Component({
   selector: 'PopUpHome-dialog',
   templateUrl: './PopUpHome.component.html',
   styleUrls: ['./PopUpHome.component.scss']
})

export class PopUpHomeComponent implements OnInit {

   // data: string;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   dataSource = new MatTableDataSource<any>(this.adminProductList);
   toastOption: ToastOptions = {
      title: "Predeterminada",
      msg: "La ubicación ha quedado predeterminada!",
      showClose: true,
      timeout: 9000,
      theme: "material"

  };

   constructor(
      public dialogRef: MatDialogRef<PopUpHomeComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
   ) { }

   ngOnInit() {
   }

   product_aprobed(id_prod) {
      let state = 2;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   product_reject(id_prod) {
      let state = 3;
      this.apiService.updateStateProduct(state, id_prod).subscribe(res => this.onClose(res));
   }

   onClose(response) {
         this.dialogRef.close();
   }

   deleteLocation(id) {
      //Open the dialog
      this.apiService.deleteLocationUserDialog(id);
   }

   predetermined(id) {
      const id_user_front = localStorage.getItem('id_user_front');
      let myObj_user_client = { "predetermined": "True", "id_user_front": id_user_front };
      const body = JSON.stringify(myObj_user_client);
      this.apiService.updateLocationPredetermined(body, id).subscribe(
         result => {
            this.router.navigate(['/checkout/payment']).then(() => {
               window.location.reload();
               this.toastyService.success(this.toastOption);
            });
         },
         error => {
            console.log(error)
         }
      );
   }

   editLocation(id){

      this.router.navigate(['/account/address/edit/'+id]).then(() => {
         // window.location.reload();

      });

   }


}

