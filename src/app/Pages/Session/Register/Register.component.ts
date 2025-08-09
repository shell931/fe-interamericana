import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Departament {
    id_departament: string;
    departament: string;
}

export interface Identifiers {
    id: string;
    type_identifier: string;
}

export interface City {
    id_city: string;
    city: string;
}

interface TokenObj {
    token: string;
    user_id: string;
    type_user: string;
    non_field_errors: string;
    id_store: string;
    personal_name: string;
    user_email: string;
}


@Component({
    selector: 'embryo-Register',
    templateUrl: './Register.component.html',
    styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {

    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    identifierstlist: Identifiers[] = [];
    identifiers: Identifiers[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    registerForm: FormGroup;
    emailPattern: string = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
    formBuilder: any;
    identifier$: Observable<Identifiers[]>;
    depart$: Observable<Departament[]>;
    city$: Observable<City[]>;
    selectIdentifiers: any;
    selectedCity: any;
    public validate_user: boolean = false;


    // START ANGULAR MAT SEARCH    
    public departamentCtrl: FormControl = new FormControl(null, [Validators.required]);
    public departamentFilterCtrl: FormControl = new FormControl();

    public citieCtrl: FormControl = new FormControl(null, [Validators.required]);
    public citieFilterCtrl: FormControl = new FormControl();

    public identifiersCtrl: FormControl = new FormControl(null, [Validators.required]);
    public identifiersFilterCtrl: FormControl = new FormControl();

    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH


    constructor(
        private router: Router,
        private formGroup: FormBuilder,
        private toastyService: ToastaService,
        private apiService: ApiService,
    ) { }

    ngOnInit() {
        // START ANGULAR MAT SEARCH DEPARTAMENT
        this.departments = [];
        this.apiService.getDepartmentsFront().subscribe(
            (data: Departament[]) => {
                this.departamentlist = data;
                for (var i in this.departamentlist) {
                    let get_id_departament = this.departamentlist[i]['id_departament'];
                    let get_departament = this.departamentlist[i]['departament'];
                    this.departments.push({ departament: get_departament, id_departament: get_id_departament });
                }

                this.depart$ = this.getDepartment("", this.departments);
            },
        );
        // END ANGULAR MAT SEARCH DEPARTAMENT

        // START ANGULAR MAT SEARCH TYPE IDENTIFICATION
        this.identifiers = [];
        this.apiService.getTypreIdentifiersFront().subscribe(
            (data: Identifiers[]) => {
                this.identifierstlist = data;
                for (var i in this.identifierstlist) {
                    let get_id = this.identifierstlist[i]['id'];
                    let get_type_identifier = this.identifierstlist[i]['type_identifier'];
                    this.identifiers.push({ id: get_id, type_identifier: get_type_identifier });
                }
                this.identifier$ = this.getIdentifiers("", this.identifiers);
            },
        );
        // START ANGULAR MAT SEARCH TYPE IDENTIFICATION

        this.registerForm = this.formGroup.group({
            name: ['', [Validators.required]],
            second_name: ['', [Validators.required]],
            number_identifier: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            password: ['', [Validators.required]],
            // repeat_password: ['', [Validators.required]],
            neighborhood: ['', [Validators.required]],
            via: ['', [Validators.required]],
            number_streeth: ['', [Validators.required]],
            sn: ['', [Validators.required]],
            aditional_data: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            contact: ['', [Validators.required]],
            identifiersCtrl: new FormControl('', [Validators.required]),
            departamentCtrl: new FormControl('', [Validators.required]),
            citieCtrl: new FormControl('', [Validators.required]),
        });
    }



    citieChangeAction(departament) {
        // START ANGULAR MAT SEARCH CITIES
        let get_data_dep = departament;
        let id_dep = get_data_dep.id_departament;
        // console.log(id_dep);
        this.cities = [];
        this.apiService.getCitiesFrontbyDepartments(id_dep).subscribe(
            (data: City[]) => {
                this.citietlist = data;
                for (var i in this.citietlist) {
                    let get_id_citie = this.citietlist[i]['id_city'];
                    let get_citie = this.citietlist[i]['city'];
                    this.cities.push({ city: get_citie, id_city: get_id_citie });
                }
                this.city$ = this.getCity("", this.cities);
            },
        );
        // END ANGULAR MAT SEARCH CITIES
    }


    getIdentifiers(term: string = null, algo): Observable<Identifiers[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.type_identifier.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


    getDepartment(term: string = null, algo): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    getCity(term: string = null, algo): Observable<City[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


    register_user_front() {
        this.validate_user = false
        if (this.registerForm.valid) {

            let values_register = this.registerForm.value;
            let myObj_user_client;
            let myObj_ubication;
            let myObj_login;
            myObj_user_client = { "username": values_register.email, "password": values_register.password, "first_name": values_register.name, "last_name": values_register.second_name, "email": values_register.email, "is_active": "true", "group_id": 2, "store": '', "type_user": 3, "type_identifier": this.selectIdentifiers, "number_identifier": values_register.number_identifier };

            this.apiService.ValidateUserExist(values_register.email).subscribe(
                result => {
                    if (result == true) {
                        this.validate_user = true
                    } else {
                        this.apiService.registerUserFront(myObj_user_client).subscribe(
                            result => {
                                myObj_login = { "username": values_register.email, "password": values_register.password }
                                this.apiService.loginUser(myObj_login).subscribe(
                                    (result_login: TokenObj) => {
                                        let user_id = result_login["user_id"];
                                        localStorage.setItem('mr-token-front', result_login.token);
                                        localStorage.setItem('id_type_user', result_login.type_user);
                                        localStorage.setItem('id_user_front', result_login.user_id);
                                        localStorage.setItem('personal_name', result_login.personal_name);
                                        localStorage.setItem('user_email', result_login.user_email);
                                        localStorage.setItem('id-store', result_login.id_store);
                                        myObj_ubication = { "city": this.selectedCity, "neighborhood": values_register.neighborhood, "via": values_register.via, "number": values_register.number_streeth, "sn": values_register.sn, "additional_data": values_register.aditional_data, "phone": values_register.phone, "contact": values_register.contact, "latitude": 0, "longitude": 0, "user": [user_id], "predetermined": true };
                                        this.apiService.SetLocationClient(myObj_ubication).subscribe(
                                            result => {
                                                this.router.navigate(['/checkout/payment']).then(() => {
                                                    window.location.reload();
                                                });
                                            },
                                            error => console.log(error)
                                        );

                                    },
                                    error => console.log(error)
                                );
                            },
                            error =>
                                this.validate_user = true
                        );
                    }
                },
                error =>
                    console.log(error)
            );

        } else {
            for (let i in this.registerForm.controls) {
                this.registerForm.controls[i].markAsTouched();
            }
        }

    }

}
