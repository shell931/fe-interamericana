import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { EmbryoService } from '../../../../Services/Embryo.service';

export interface Product {
   name: string;
   image: string;
   price: string;
   produc_code: string;
}

@Component({
   selector: 'predetermined-dialog',
   templateUrl: './ShowCartData.component.html',
   styleUrls: ['./ShowCartData.component.scss']
})

export class ShowCartDataComponent implements OnInit {

   data: Product;
   total: string;
   // image: string;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   dataSource = new MatTableDataSource<any>(this.adminProductList);
   
   constructor(
      public embryoService : EmbryoService, 
      public dialogRef: MatDialogRef<ShowCartDataComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
   ) { }
   
   ngOnInit() {
   }
   
   onClose() {
      this.dialogRef.close("yes");      
   }

}

