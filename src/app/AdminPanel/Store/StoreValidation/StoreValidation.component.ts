import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';
import { StoreAdmin, StoreDocs, StoreBankAccount } from '../../../Models/StoreAdmin';
import { DomSanitizer } from '@angular/platform-browser';
import { SweetAlertOptions } from 'sweetalert2';
import { environment } from '../../../../../src/environments/environment';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

export interface PercentageSale {
    id: string;
    percentage: string;
    description: string;
}

export interface PercentagePayment {
    id: string;
    percentage: string;
    description: string;
}

export interface Cuc {
    id: string;
    cuc: string;
    terminal: string;
}

@Component({
    selector: 'app-StoreValidation',
    templateUrl: './StoreValidation.component.html',
    styleUrls: ['./StoreValidation.component.scss']
})

export class StoreValidationComponent implements OnInit {

    id_store: any;
    address: StoreAdmin;
    city: StoreAdmin;
    city_id: StoreAdmin;
    departament: StoreAdmin;
    description: StoreAdmin;
    email: StoreAdmin;
    id_departament: StoreAdmin;
    manager: StoreAdmin;
    name_store: StoreAdmin;
    number_identifier: StoreAdmin;
    state_store: StoreAdmin;
    storecategories: StoreAdmin;
    telephone: StoreAdmin;
    storecategories_description: StoreAdmin;
    test: any;
    doc_identifier_doc: any;
    cam_com_doc: any;
    rut_doc: any;
    cert_bank_doc: any;
    storeDocsGrid: StoreDocs[] = [];
    doc: StoreDocs[] = [];
    account_number: StoreBankAccount;
    bank: StoreBankAccount;
    certification_url: any;
    id_bank_account: StoreBankAccount;
    responsible: StoreBankAccount;
    state: StoreBankAccount;
    store: StoreBankAccount;
    store_name_legal: StoreBankAccount;
    typeaccount: StoreBankAccount;
    panelOpenState = false;
    alertOpt: SweetAlertOptions = {};
    public percentagesaleFilterCtrl: FormControl = new FormControl();
    public percentagesaleCtrl: FormControl = new FormControl(null, [Validators.required]);
    percentage_sale$: Observable<PercentageSale[]>;
    percentagesalelist: PercentageSale[] = [];
    percentagesale: PercentageSale[] = [];
    selectedPercentageSale: any;
    public percentagepaymentFilterCtrl: FormControl = new FormControl();
    public percentagepaymentCtrl: FormControl = new FormControl(null, [Validators.required]);
    percentage_payment$: Observable<PercentagePayment[]>;
    percentagepaymentlist: PercentagePayment[] = [];
    percentagepayment: PercentagePayment[] = [];
    selectedPercentagePayment: any;
    public validate_percentage_sale: boolean = false;
    public validate_percentage_payment: boolean = false;
    public validate_cuc: boolean = false;
    id_percentage_sale: any;
    id_percentage_payment: any;
    selectedValue;

    cuc$: Observable<Cuc[]>;
    public cucFilterCtrl: FormControl = new FormControl();
    selectedCuc: any;
    cuclist: Cuc[] = [];
    cuc: Cuc[] = [];
    id_cuc: any;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formGroup: FormBuilder,
        private toastyService: ToastaService,
        private apiService: ApiService,
        private _formBuilder: FormBuilder,
        private sanitizer: DomSanitizer) { }


    ngOnInit() {

        this.addBodyClass();
        
        this.route.params.subscribe(res => {
            this.id_store = res.id_store;
        })

        this.apiService.getStoreData(this.id_store).subscribe(
            res => {
                console.log(res);
                
                this.id_percentage_sale = res.commission_sale_id;
                this.id_percentage_payment = res.commission_payment_id;
                this.id_cuc = res.cuc_id;


                // START ANGULAR MAT SEARCH PERCENTAGE SALES
                this.percentagesale = [];
                this.apiService.getPercentagesSale().subscribe(
                    (data: PercentageSale[]) => {
                        this.percentagesalelist = data;
                        for (var i in this.percentagesalelist) {
                            let get_id_percentagesale = this.percentagesalelist[i]['id'];
                            let get_percentagesale = this.percentagesalelist[i]['percentage'] + ' %';
                            let get_description = this.percentagesalelist[i]['description'];
                            this.percentagesale.push({ id: get_id_percentagesale, percentage: get_percentagesale, description: get_description });
                        }
                        if (this.id_percentage_sale != null) {                            
                            this.setValuePercentageSaleSelect(this.percentagesale, this.id_percentage_sale);
                        }
                        this.percentage_sale$ = this.getPercentageSale("", this.percentagesale);
                        console.log(this.percentage_sale$);
                    },
                    error => console.log(error)
                );
                // END ANGULAR MAT SEARCH PERCENTAGE SALES   


                // START ANGULAR MAT SEARCH PERCENTAGE PAYMENT
                // this.id_percentage_payment = 1;
                this.percentagepayment = [];
                this.apiService.getPercentagesPayment().subscribe(
                    (data: PercentagePayment[]) => {
                        this.percentagepaymentlist = data;
                        for (var i in this.percentagepaymentlist) {
                            let get_id_percentagepayment = this.percentagepaymentlist[i]['id'];
                            let get_percentagepayment = this.percentagepaymentlist[i]['percentage'] + ' %';
                            let get_description = this.percentagepaymentlist[i]['description'];
                            this.percentagepayment.push({ id: get_id_percentagepayment, percentage: get_percentagepayment, description: get_description });
                        }
                        if (this.id_percentage_payment != null) {
                            this.setValuePercentagePaymentSelect(this.percentagepayment, this.id_percentage_payment);
                        }

                        this.percentage_payment$ = this.getPercentagePayment("", this.percentagepayment);
                    },
                    error => console.log(error)
                );
                // END ANGULAR MAT SEARCH  PERCENTAGE PAYMENT  


                // START ANGULAR MAT SEARCH CUC
                this.cuc = [];
                this.apiService.getCuc().subscribe(
                    (data: Cuc[]) => {                                              
                        this.cuclist = data['data'];
                        for (var i in this.cuclist) {
                            console.log(this.cuclist[i]['cuc']);
                            
                            let get_id_cuc = this.cuclist[i]['id'];
                            let get_cuc_cuc = this.cuclist[i]['cuc'];
                            let get_terminal_cuc = this.cuclist[i]['terminal'];
                            this.cuc.push({ id: get_id_cuc, cuc: get_cuc_cuc, terminal: get_terminal_cuc });
                        }
                        if (this.id_cuc != null) {
                            this.setValueCucSelect(this.cuc, this.id_cuc);
                        }

                        this.cuc$ = this.getCuc("", this.cuc);
                    },
                    error => console.log(error)
                );
                // END ANGULAR MAT SEARCH  CUC  


                this.apiService.getStoreDocuments(this.id_store).subscribe(
                    data_docs => {
                        this.apiService.getStoreBankAccountData(this.id_store).subscribe(
                            data_bank => {
                                this.getStoreData(res, data_docs, data_bank);

                            }
                        );
                    }
                );
            }
        );

    }

    addBodyClass() {

        window.addEventListener('load', function () {
            document.querySelector('body').classList.add("loaded")
        });

    }

    getPercentageSale(term: string = null, algo): Observable<PercentagePayment[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.percentage.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    setValuePercentageSaleSelect(percentagesale, id_percentage_sale) {
        let count;
        for (var i = 0; i < percentagesale.length; i++) {
            if (percentagesale[i].id == id_percentage_sale) {
                count = i;
            }
        }
        this.selectedPercentageSale = percentagesale[count].id;
    }




    getPercentagePayment(term: string = null, algo): Observable<PercentageSale[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.percentage.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    setValuePercentagePaymentSelect(percentagepayment, id_percentage_payment) {
        let count;
        for (var i = 0; i < percentagepayment.length; i++) {
            if (percentagepayment[i].id == id_percentage_payment) {
                count = i;
            }
        }
        this.selectedPercentagePayment = percentagepayment[count].id;
    }

    getCuc(term: string = null, algo): Observable<Cuc[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.cuc.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    setValueCucSelect(cuc, id_cuc) {
        let count;
        for (var i = 0; i < cuc.length; i++) {
            if (cuc[i].id == id_cuc) {
                count = i;
            }
        }
        this.selectedCuc = cuc[count].id;
    }

    getStoreData(response, data_docs, data_bank) {
        this.address = response.address;
        this.city = response.city;
        this.city_id = response.city_id;
        this.departament = response.departament;
        this.description = response.description;
        this.email = response.email;
        this.id_departament = response.id_departament;
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.storecategories = response.storecategories;
        this.telephone = response.telephone;
        this.storecategories_description = response.storecategories_description;
        this.test = this.sanitizer.bypassSecurityTrustResourceUrl(environment.api.baseBucketImageUrl + '148_1.png');
        this.storeDocsGrid = [];
        this.storeDocsGrid = data_docs.map(item => {
            if (item['id_document_type'] == 1) {
                this.doc_identifier_doc = item['url_document'];
            } else if (item['id_document_type'] == 2) {
                this.rut_doc = item['url_document'];
            } else if (item['id_document_type'] == 3) {
                this.cam_com_doc = item['url_document'];
            }
        });
        this.doc_identifier_doc = this.sanitizer.bypassSecurityTrustResourceUrl(this.doc_identifier_doc);
        this.rut_doc = this.sanitizer.bypassSecurityTrustResourceUrl(this.rut_doc);
        this.cam_com_doc = this.sanitizer.bypassSecurityTrustResourceUrl(this.cam_com_doc);
        this.id_bank_account = data_bank.id_bank_account;
        this.responsible = data_bank.responsible;
        this.state = data_bank.state;
        this.store = data_bank.store;
        this.store_name_legal = data_bank.store_name_legal;
        this.typeaccount = data_bank.typeaccount;
        this.account_number = data_bank.account_number;
        this.bank = data_bank.bank;
        this.certification_url = this.sanitizer.bypassSecurityTrustResourceUrl(data_bank.certification_url);
    }

    RechStore() {

    }

    AproveStore() {    
        this.validate_percentage_sale = false; this.validate_percentage_payment = false; this.validate_cuc = false;
        if (this.selectedPercentageSale) {                        
            if (this.selectedPercentagePayment) {                
                if(this.selectedCuc){                    
                    let JsonDataPercentage = {
                        "percentage_sale": this.selectedPercentageSale,
                        "percentage_payment": this.selectedPercentagePayment,
                        "cuc": this.selectedCuc,
                    };
                    let JsonDataEmail = {
                        "email" : this.email
                    }
                    this.apiService.sendEmailWelcomeStore(JsonDataEmail).subscribe();
                    this.apiService.updatePercentagesStore(JsonDataPercentage, this.id_store).subscribe(
                        response => {
                            let status_up = { state_store: 1 };
                            this.apiService.updateStore(status_up, this.id_store).subscribe(
                                response => {
                                    this.apiService.getUserId(this.id_store).subscribe(
                                        response => {
                                            let user_id = response.user_id;
                                            let JsonData = {
                                                "type": 2
                                            };
                                            this.apiService.setUpdateUserTypeFront(JsonData, user_id).subscribe(
                                                response => {
                                                    let JsonDataGroup = {
                                                        "group_id": 3
                                                    };
                                                    this.apiService.setUpdateUserGroup(JsonDataGroup, user_id).subscribe(
                                                        response => {
                                                            this.router.navigate(['/admin-panel/store']);
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }else{                    
                    this.validate_cuc = true;
                }
            } else {
                this.validate_percentage_payment = true;
            }
        } else {
            this.validate_percentage_sale = true;
        }

    }

}


