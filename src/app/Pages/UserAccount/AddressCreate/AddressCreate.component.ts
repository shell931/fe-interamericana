import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ApiService } from '../../../Services/api.service';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
// import { log } from 'node:console';

export interface Departament {
    id_departament: string;
    departament: string;
}


export interface City {
    id_city: string;
    city: string;
}


@Component({
    selector: 'app-AddressCreate',
    templateUrl: './AddressCreate.component.html',
    styleUrls: ['./AddressCreate.component.scss']
})
export class AddressCreateComponent implements OnInit {

    id: any;
    neighborhood: any;
    number: any;
    via: any;
    sn: any;
    additional_data: any;
    phone: any;
    nameci: any;
    departament: any
    contact: any;
    id_city: any;
    id_departament: any;
    formLocationCreate: FormGroup;
    dep_id: any;
    citietlist: City[] = [];
    depart$: Observable<Departament[]>;
    city$: Observable<City[]>;
    selectedCity: any;


    // START ANGULAR MAT SEARCH DEPARTAMENT    
    public departamentCtrl: FormControl = new FormControl(null, [Validators.required]);
    public departamentCtrll: FormControl = new FormControl(null, [Validators.required]);
    public departamentFilterCtrl: FormControl = new FormControl();
    public citieCtrl: FormControl = new FormControl(null, [Validators.required]);
    public citieFilterCtrl: FormControl = new FormControl();
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH DEPARTAMENT
    // START ANGULAR MAT SEARCH CITY
    public cityCtrl: FormControl = new FormControl(null, [Validators.required]);
    public cityFilterCtrl: FormControl = new FormControl();
    // END ANGULAR MAT SEARCH CITY
    departments: Departament[] = [];
    cities: City[] = [];
    department_selected: Departament[] = [];
    departamentlist: Departament[] = [];

    formData: FormGroup;
    selectedValue;
    selectedCityValue;
    toastOption: ToastOptions = {
        title: "Ubicación creada",
        msg: "Ubicación ha sido creada!",
        showClose: true,
        timeout: 3000,
        theme: "material"
    };


    constructor(private route: ActivatedRoute,
        private router: Router,
        private formGroup: FormBuilder,
        private toastyService: ToastaService,
        private apiService: ApiService,) {

    }

    ngOnInit() {

        const token_front = localStorage.getItem('mr-token-front');
        const id_user_front = localStorage.getItem('id_user_front');

        if (!token_front || !id_user_front) {
            this.router.navigate(['/session/signin']);
        } else {

            this.route.params.subscribe(res => {
                this.id = res.id;
            })

            this.formLocationCreate = this.formGroup.group({
                neighborhood: ['', [Validators.required]],
                via: ['', [Validators.required]],
                number: ['', [Validators.required]],
                sn: ['', [Validators.required]],
                // departmentControl: new FormControl('', [Validators.required]),
                // cityControl: new FormControl('', [Validators.required]),
                contact: new FormControl('', [Validators.required]),
                phone: new FormControl('', [Validators.required]),
                additional_data: new FormControl('', [Validators.required]),
                id: [''],
                departamentCtrll: new FormControl('', [Validators.required]),
                citieCtrl: new FormControl('', [Validators.required]),
            });


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

                    console.log(this.departments);
                    

                    this.depart$ = this.getDepartment("", this.departments);

                },
            );
            // END ANGULAR MAT SEARCH DEPARTAMENT

        }

    }




    getDepartment(term: string = null, algo): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
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


    getCity(term: string = null, algo): Observable<City[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    updateLocationUserFront() {             
        if (this.formLocationCreate.valid) {
            let get_values_location = this.formLocationCreate.value;
            const id_user_front = localStorage.getItem('id_user_front');
            let myObj_user_client = {
                "city": this.selectedCity, "neighborhood": get_values_location.neighborhood, "via": get_values_location.via,
                "number": get_values_location.number, "sn": get_values_location.sn,
                "additional_data": get_values_location.additional_data, "phone": get_values_location.phone, "contact": get_values_location.contact,
                "latitude": 0, "longitude": 0,
                "user": [id_user_front]
            };

            this.apiService.SetLocationClient(myObj_user_client).subscribe(
                reponse => {
                    console.log(reponse);
                    this.router.navigate(['/account/address']).then(() => {
                        // window.location.reload();
                        this.toastyService.success(this.toastOption);
                    });
                },
                error => console.log(error)
            );

        } else {
            for (let i in this.formLocationCreate.controls) {
                this.formLocationCreate.controls[i].markAsTouched();
            }
        }

    }


}
