import { Component, OnInit ,Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Invoice } from '../../../../Models/Invoice';
import { environment } from '../../../../../../src/environments/environment';

@Component({
   selector: 'InvoiceDetailUsr-dialog',
   templateUrl: './InvoiceDetailUsr.component.html',
   styleUrls: ['./InvoiceDetailUsr.component.scss']
   })

export class InvoiceDetailUsrComponent implements OnInit {
   
   data : Invoice;
   gallery : string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);   
	displayedColumns: string[] = ['name_product'];

   constructor(
      public dialogRef : MatDialogRef<InvoiceDetailUsrComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
      ){} 

   ngOnInit() {

      let myJSONinvDetail = JSON.stringify(this.data);
      let obj = JSON.parse(myJSONinvDetail);
      this.adminprList = obj.invoice_detail;
      console.log(obj);
      
      this.total = obj.total_price
      this.img_product_rout = environment.api.baseBucketImageUrl;
      
   }

   // product_aprobed(id_prod){
   //    let state = 2;
   //    this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   // }

   // product_reject(id_prod){
   //    let state = 3;   
   //    this.apiService.updateStateProduct(state,id_prod).subscribe(res => this.onClose(res));  
   // }

   // onClose(response){
   //    if(response.result==200){
   //       this.dialogRef.close("yes"); 

   //       this.router.navigate(['/admin-panel/admin_products']).then(() => {
   //          window.location.reload();
   //       });
         
   //    }else{
   //       console.log("fail");
   //    }
   // }

}

