import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';

import {MatSortModule, MatSort} from '@angular/material/sort';
import {MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material/dialog';


import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

export interface Product {
   name: string;
   image: string;
   price: string;
   produc_code: string;
}

@Component({
   selector: 'predetermined-dialog',
   templateUrl: './AddCart.component.html',
   styleUrls: ['./AddCart.component.scss']
})

export class AddCartComponent implements OnInit {

   data: Product;
   // image: string;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
   dataSource = new MatTableDataSource<any>(this.adminProductList);
   toastOption: ToastOptions = {
      title: "Predeterminada",
      msg: "La ubicación ha quedado predeterminada!",
      showClose: true,
      timeout: 3000,
      theme: "material"
  };

   constructor(
      public dialogRef: MatDialogRef<AddCartComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
   ) { }
   
   ngOnInit() {
   }
   
   onClose() {
      this.dialogRef.close("yes");
      this.router.navigate(['/cart'])
   }

}

