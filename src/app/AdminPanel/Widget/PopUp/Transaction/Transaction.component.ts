import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs/observable/of';
import { ApiService } from '../../../../Services/api.service';
import { Observable, of as observableOf, interval, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, take, delay, withLatestFrom, finalize, tap } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Transactions } from '../../../../Models/Transactions';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './Transaction.component.html',
    styleUrls: ['./Transaction.component.scss']
})

export class TransactionComponent implements OnInit {

    alertOpt: SweetAlertOptions = {};
    data: Transactions;
    adminprList: any[] = [];
    adminProductList: any[] = [];
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    dataSource = new MatTableDataSource<any>(this.adminProductList);
    buttdisa = false;
    buttdisacontra = false;
    failcanceltx = false;
    msjcanceltx = '';
    failservercanceltx = false;
    transactionsRespo: any;
    timer = 0;

    constructor(
        private loader: LoadingBarService,
        public dialogRef: MatDialogRef<TransactionComponent>,
        private apiService: ApiService,
        private router: Router,
        private toastyService: ToastaService,
    ) { }

    ngOnInit() {
    }

    anul_transaction(id_tx) {
        this.buttdisa = !this.buttdisa;
        let jsonObjCancel = {
            'id_tx': id_tx
        }
        this.apiService.setCancelTransaction(id_tx, jsonObjCancel).subscribe(res => this.onClose(res));
    }

    contra_c(id_tx){
        this.buttdisacontra = !this.buttdisacontra;
        let jsonObjContra = {
            'id_tx': id_tx
        }
        this.apiService.setContraTransaction(id_tx, jsonObjContra).subscribe(res => this.onCloseContra(res));
    }


    onClose(response) {
        this.failcanceltx = false;
        let myJSON = JSON.stringify(response);
        let obj = JSON.parse(myJSON);
        // console.log(obj.data.msgresp);
        // console.log(obj.data.num_autorizacion);
        // console.log(obj.data.num_recibo);
        // console.log(obj.data.date);
        if (obj.result == 200) {
            if (obj.data.msgresp == '00') {
                this.dialogRef.close("yes");
                this.MessajeCancelTransaction(obj.data.msgresp, obj.data.num_autorizacion, obj.data.num_recibo, obj.data.date);
                setInterval(() => {
                    window.location.reload();
                }, 3000)
            } else {
                this.failcanceltx = true;
                this.msjcanceltx = obj.data.msgresp;
            }
        } else {
            this.failservercanceltx = true;
        }
    }

    onCloseContra(response) {
        this.dialogRef.close("yes");
        window.location.reload();
    }



    MessajeCancelTransaction(msgresp, num_autorizacion, num_recibo, date) {
        let myObj_transaction = {
            message: "Se realizo la cancelación de la transacción correctamente",
            msgresp: msgresp,
            num_autorizacion: num_autorizacion,
            num_recibo: num_recibo,
            date: date
        };
        this.transactionsRespo = myObj_transaction;
        this.apiService.PopUpTransaccionCancelResponse(this.transactionsRespo);
    }



}

