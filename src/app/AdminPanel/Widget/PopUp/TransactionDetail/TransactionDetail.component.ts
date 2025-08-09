import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Transactions } from '../../../../Models/Transactions';
import { environment } from '../../../../../environments/environment';

@Component({
   selector: 'TransactionDetail-dialog',
   templateUrl: './TransactionDetail.component.html',
   styleUrls: ['./TransactionDetail.component.scss']
})

export class TransactionDetailComponent implements OnInit {

   data: Transactions;
   gallery: string;
   adminprList: any[] = [];
   adminProductList: any[] = [];
   total: any;
   img_product_rout: any;
   cam_com: any;
   ShippmentForm: FormGroup;
   id_invoice: any;
   public show: boolean = false;

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.adminProductList);
   displayedColumns: string[] = ['name_product'];

   constructor(
      public dialogRef: MatDialogRef<TransactionDetailComponent>,
      private apiService: ApiService,
      private router: Router,
      private toastyService: ToastaService,
      private formGroup: FormBuilder,
   ) { }

   ngOnInit() {
   
   }
}

