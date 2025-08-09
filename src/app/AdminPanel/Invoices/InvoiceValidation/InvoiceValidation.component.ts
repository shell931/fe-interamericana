import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../src/environments/environment';
import { EmbryoService } from '../../../Services/Embryo.service';

@Component({
    selector: 'app-invoiceValidation',
    templateUrl: './InvoiceValidation.component.html',
    styleUrls: ['./InvoiceValidation.component.scss']
})

export class InvoiceValidationComponent implements OnInit {


    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    id_invoice: any;
    invDetailGrid: Invoice;
    adress: Invoice;
    created_at: Invoice;
    departament: Invoice;
    email: Invoice;
    first_name_client: Invoice;
    id_store_id: Invoice;
    id: Invoice;
    name_client: Invoice;
    name_state: Invoice;
    name_store: Invoice;
    nameci: Invoice;
    number_identifier: Invoice;
    paymentmethod: Invoice;
    phone: Invoice;
    reference: Invoice;
    reference_invoice: Invoice;
    state_id: string;
    total_price: Invoice;
    percentage_sale: Invoice;
    val_percentage_sale: Invoice;
    percentage_commision_payment: Invoice;
    val_percentage_commision_payment: Invoice;
    percentage_rete_ica: Invoice;
    val_percentage_rete_ica: Invoice;
    percentage_rete_fuente: Invoice;
    val_percentage_rete_fuente: Invoice;
    val_percentage_rete_iva: Invoice;
    getBinnacleFalse: Invoice;
    percentage_commision_tax: Invoice;
    val_percentage_commision_tax: Invoice;
    total_balance: Invoice;
    transaction_id: Invoice;
    type_identifier: Invoice;
    user_id: Invoice;
    invoice_detail: Invoice;
    shipping_voucher: any;
    letter_received: any;
    panelOpenState = false;
    img_product_rout: any;
    type_service_id: any;
    type_service: any;
    quot: any;
    brand: any;
    num_aprob: any;
    cod_reply: any;
    messaje_reply: any;
    total_tx: any;
    num_recibo: any;
    tag_cellphone: any;
    tag_desc_selling: any;
    tag_email: any;
    tag_first_name: any;
    tag_last_name: any;
    tag_number_identification: any;
    tag_tax_iva_id: any;
    field: any;
    date_tx: any;
    CheckedRecord: any = false;
    CheckedCallControl: any = false;
    CheckedVoucherSend: any = false;
    CheckedLetterCon: any = false;
    numberCheck: any = 0;
    confitionCheckRecord: any = false;
    confitionCallControl: any = false;
    confitionSendGuide: any = false;
    confitionLetterCon: any = false;
    public messaje_vali_progress: boolean = false;
    binnacleGrid: any;
    conta: any;

    constructor(
        public service: AdminPanelServiceService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        public embryoService: EmbryoService,
    ) { }

    ngOnInit() {
        this.addBodyClass();
        this.route.params.subscribe(res => {
            this.id_invoice = res.id_invoice;
        })
        this.apiService.ListInvoicesById(this.id_invoice).subscribe(
            dataHeaderInvoice => {
                this.apiService.getInvoiceDetail(this.id_invoice).subscribe(dataDetailInvoice => this.getInvoiceDetailData(dataDetailInvoice, dataHeaderInvoice));
            },
            error => console.log(error)
        );
        localStorage.removeItem("id_invoice_popup");
        let id_invoice_popup = localStorage.setItem('id_invoice_popup', this.id_invoice);

    }

    addBodyClass() {
        window.addEventListener('load', function () {
            document.querySelector('body').classList.add("loaded")
        });
    }

    getInvoiceDetailData(dataDetailInvoice, dataInvoice) {

        this.adress = dataInvoice.adress;
        this.created_at = dataInvoice.created_at;
        this.departament = dataInvoice.departament;
        this.email = dataInvoice.email;
        this.first_name_client = dataInvoice.first_name_client;
        this.id_store_id = dataInvoice.id_store_id;
        this.id = dataInvoice.id;
        this.name_client = dataInvoice.name_client;
        this.name_state = dataInvoice.name_state;
        this.name_store = dataInvoice.name_store;
        this.nameci = dataInvoice.namecity;
        this.number_identifier = dataInvoice.number_identifier;
        this.paymentmethod = dataInvoice.paymentmethod;
        this.phone = dataInvoice.phone;
        this.reference = dataInvoice.reference;
        this.reference_invoice = dataInvoice.reference_invoice;
        this.state_id = dataInvoice.state_id;
        this.total_price = dataInvoice.total_price;
        this.percentage_sale = dataInvoice.percentage_sale,
            this.val_percentage_sale = dataInvoice.val_percentage_sale,
            this.percentage_commision_payment = dataInvoice.percentage_commision_payment,
            this.val_percentage_commision_payment = dataInvoice.val_percentage_commision_payment,
            this.percentage_rete_ica = dataInvoice.percentage_rete_ica,
            this.val_percentage_rete_ica = dataInvoice.val_percentage_rete_ica,
            this.percentage_rete_fuente = dataInvoice.percentage_rete_fuente,
            this.val_percentage_rete_fuente = dataInvoice.val_percentage_rete_fuente,
            this.val_percentage_rete_iva = dataInvoice.val_percentage_rete_iva,
            this.getBinnacleFalse = dataInvoice.getBinnacleFalse,

            this.percentage_commision_tax = dataInvoice.percentage_commision_tax,
            this.val_percentage_commision_tax = dataInvoice.val_percentage_commision_tax,
            this.total_balance = dataInvoice.total_balance,
            this.type_service_id = dataInvoice.type_service_id;
        this.type_service = dataInvoice.service;
        this.transaction_id = dataInvoice.transaction_id;
        this.type_identifier = dataInvoice.type_identifier;
        this.user_id = dataInvoice.user_id;
        this.quot = dataInvoice.quot;
        this.brand = dataInvoice.brand;
        this.num_aprob = dataInvoice.num_aprob;
        this.cod_reply = dataInvoice.cod_reply;
        this.messaje_reply = dataInvoice.messaje_reply;
        this.reference = dataInvoice.reference;
        this.total_tx = dataInvoice.total_tx;
        this.num_recibo = dataInvoice.num_recibo;
        this.tag_cellphone = dataInvoice.tag_cellphone;
        this.tag_desc_selling = dataInvoice.tag_desc_selling;
        this.tag_email = dataInvoice.tag_email;
        this.tag_first_name = dataInvoice.tag_first_name;
        this.tag_last_name = dataInvoice.tag_last_name;
        this.tag_number_identification = dataInvoice.tag_number_identification;
        this.tag_tax_iva_id = dataInvoice.tag_tax_iva_id;
        this.field = dataInvoice.field;
        this.date_tx = dataInvoice.date_tx;
        this.shipping_voucher = this.sanitizer.bypassSecurityTrustResourceUrl(environment.api.baseBucketImageUrl + dataInvoice.shipping_voucher);
        this.letter_received = this.sanitizer.bypassSecurityTrustResourceUrl(environment.api.baseBucketImageUrl + dataInvoice.letter_received);
        this.invoice_detail = dataDetailInvoice;
        this.img_product_rout = environment.api.baseBucketImageUrl;
        

        if (dataInvoice.check_call_control == true) {
            this.CheckedCallControl = true;
            this.numberCheck = 25;
        }
        if (dataInvoice.check_record == true) {
            this.CheckedRecord = true;
            this.numberCheck = 50;
        }

        if (dataInvoice.check_shipment == true) {
            this.CheckedVoucherSend = true;
            this.numberCheck = 70;
        }

        if (dataInvoice.check_finaly == true) {
            this.CheckedLetterCon = true;
            this.confitionCallControl = true;
            this.confitionCheckRecord = true;
            this.confitionSendGuide = true;
            this.confitionLetterCon = true;
            this.numberCheck = 100;
        }

    }

    onChangeCheckCallControll(id) {
        let check_validate = 1;
        this.apiService.getCheckValidation(id, check_validate).subscribe(
            result => {
                console.log(result);
                let myObj_check;
                if (result == false) {
                    console.log("entra 1");
                    myObj_check = {
                        "check": true,
                    };

                } else {
                    console.log("entra 2");
                    myObj_check = {
                        "check": false,
                    };
                }
                this.apiService.UpdateCheckCallControllInvoice(myObj_check, id).subscribe(
                    result => {
                        window.location.reload();
                        // this.CheckedRecord = true;
                        // this.numberCheck = 50;
                        // this.confitionCheckRecord = true;
                    },
                    error => console.log(error)
                );

            },
            error => console.log(error)
        );
    }


    onChangeCheckRecord(id) {

        let check_validate = 2;
        this.apiService.getCheckValidation(id, check_validate).subscribe(
            result => {
                console.log(result);
                let myObj_check;
                if (result == false) {
                    myObj_check = {
                        "check": true,
                    };
                } else {
                    myObj_check = {
                        "check": false,
                    };
                }
                this.apiService.UpdateCheckRecordInvoice(myObj_check, id).subscribe(
                    result => {
                        window.location.reload();
                        // this.CheckedRecord = true;
                        // this.numberCheck = 50;
                        // this.confitionCheckRecord = true;
                    },
                    error => console.log(error)
                );

            },
            error => console.log(error)
        );

    }



    onChangeCheckVoucherSend(id) {
        let check_validate = 3;
        this.apiService.getCheckValidation(id, check_validate).subscribe(
            result => {
                console.log(result);
                let myObj_check;
                if (result == false) {
                    myObj_check = {
                        "check": true,
                    };
                } else {
                    myObj_check = {
                        "check": false,
                    };
                }

                this.apiService.UpdateCheckShipmentInvoice(myObj_check, id).subscribe(
                    result => {
                        window.location.reload();
                        // this.CheckedRecord = true;
                        // this.numberCheck = 75;
                        // this.confitionCheckRecord = true;
                    },
                    error => console.log(error)
                );


            },
            error => console.log(error)
        );





    }

    onChangeCheckLetterCon($event: Event, id) {
        this.messaje_vali_progress = false;
        if (this.CheckedCallControl != false && this.CheckedRecord && this.CheckedVoucherSend) {
            let check_validate = 4;
            this.apiService.getCheckValidation(id, check_validate).subscribe(
                result => {
                    console.log(result);
                    let myObj_check;
                    if (result == false) {
                        myObj_check = {
                            "check": true,
                        };
                    } else {
                        myObj_check = {
                            "check": false,
                        };
                    }
                    this.apiService.UpdateCheckFinalyInvoice(myObj_check, id).subscribe(
                        result => {
                            window.location.reload();
                            // this.CheckedRecord = true;
                            // this.numberCheck = 100;
                            // this.confitionCheckRecord = true;
                        },
                        error => console.log(error)
                    );

                },
                error => console.log(error)
            );

        } else {
            console.log("entra 2");
            this.messaje_vali_progress = true;
        }
        return false;

    }


    // Function to change order status, new status is sent 
    // @param  {Number} num1 The first number
    // @param  {Number} num2 The second number
    // @return {Number}      The total of the two numbers

    ChangeStatusSend(id) {
        let myObj_store = {
            "state": "4",
            "external_state": "5",
        };
        this.apiService.UpdateStatusInvoice(myObj_store, id).subscribe(
            result => {
                window.location.reload();
            },
            error => console.log(error)
        );
    }

    onSeeDialog(id) {
        localStorage.removeItem("messajes");   				        
        const id_store = localStorage.getItem('id-store');
		localStorage.removeItem("id_invoice_popup");        
		localStorage.setItem('id_invoice_popup',this.id_invoice);	
        let id_invoice = this.id_invoice
        this.apiService.getBinnacle(id_invoice, 'adm').subscribe( 
            result => {

                if (result.result == 200) { 
                    let myJSONinvDetail = JSON.stringify(result.data);				
                    localStorage.setItem('messajes',myJSONinvDetail);
                    this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
    
                    this.apiService.ListInvoicesById(this.id_invoice).subscribe(
                        dataHeaderInvoice => {
                            this.apiService.getInvoiceDetail(this.id_invoice).subscribe(dataDetailInvoice => this.getInvoiceDetailData(dataDetailInvoice, dataHeaderInvoice));
                        },
                        error => console.log(error)
                    );
                } else {
                    console.log("Null");
                    this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
                 }
			
            }
        );	        
    }


}