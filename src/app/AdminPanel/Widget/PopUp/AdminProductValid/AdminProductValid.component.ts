import { Component, OnInit ,Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Products } from '../../../../Models/Products';

@Component({
   selector: 'app-admin-prod-list-dialog',
   templateUrl: './AdminProductValid.component.html',
   styleUrls: ['./AdminProductValid.component.scss']
   })

export class AdminProductValidComponent implements OnInit {
   
   data : Products;
   gallery : string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);

   constructor(
      public dialogRef : MatDialogRef<AdminProductValidComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
      ){} 

   ngOnInit() {
   }

   product_aprobed(id_prod){
      let state = 2;
      this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   }

   product_reject(id_prod){
      let state = 3;   
      this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   }

   onClose(response){
      if(response.result==200){
         this.dialogRef.close("yes"); 

         this.router.navigate(['/admin-panel/admin_products']).then(() => {
            window.location.reload();
            // this.toastyService.success(this.toastsaveproduct);
         });
         
      }else{
         console.log("fail");
      }
   }

}

