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

export interface Departament {
    id_departament: string;
    departament: string;
}


export interface City {
    id_city: string;
    city: string;
}


@Component({
    selector: 'app-AddressEdit',
    templateUrl: './AddressEdit.component.html',
    styleUrls: ['./AddressEdit.component.scss']
})
export class AddressEditComponent implements OnInit {

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
    formLocationEdit: FormGroup;
    dep_id: any;
    citietlist: City[] = [];
    depart$: Observable<Departament[]>;
    city$: Observable<City[]>;


    // START ANGULAR MAT SEARCH DEPARTAMENT    
    public departamentCtrl: FormControl = new FormControl(null, [Validators.required]);
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
        title: "Ubicación actualizada",
        msg: "Ubicación ha sido actualizada!",
        showClose: true,
        timeout: 3000,
        theme: "material"
     };


    constructor(
        private route: ActivatedRoute,
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

            this.formLocationEdit = this.formGroup.group({
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
            this.apiService.getLocationClientFront(this.id).subscribe(res => {
                this.getDataUser(res, this.id)
            }, error => console.log(error));
        }

    }



    getDataUser(response, id_location) {

        this.id = response.id;
        this.neighborhood = response.neighborhood;
        this.number = response.number;
        this.via = response.via;
        this.sn = response.sn;
        this.additional_data = response.additional_data;
        this.phone = response.phone;
        this.id_city = response.id_city;
        this.nameci = response.nameci;
        this.id_departament = response.id_departament;
        this.departament = response.departament;
        this.contact = response.contact;

        this.formLocationEdit.get('via').setValue(this.via)
        this.formLocationEdit.get('number').setValue(this.number)
        this.formLocationEdit.get('sn').setValue(this.sn)
        this.formLocationEdit.get('neighborhood').setValue(this.neighborhood)
        this.formLocationEdit.get('contact').setValue(this.contact)
        this.formLocationEdit.get('phone').setValue(this.phone)
        this.formLocationEdit.get('additional_data').setValue(this.additional_data)
        this.formLocationEdit.get('id').setValue(this.id)

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
                this.setValueDepartmentSelect(this.departments, this.id_departament);
                this.depart$ = this.getDepartment("", this.departments);
                
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH DEPARTAMENT

        // START ANGULAR MAT SEARCH CITIES
        this.cities = [];
        this.apiService.getCitiesFrontbyDepartments(this.id_departament).subscribe(
            (data: City[]) => {
                this.citietlist = data;
                for (var i in this.citietlist) {
                    let get_id_citie = this.citietlist[i]['id_city'];
                    let get_citie = this.citietlist[i]['city'];
                    this.cities.push({ city: get_citie, id_city: get_id_citie });
                }
                this.setValueCitiSelect(this.cities, this.id_city);
                this.city$ = this.getCity("", this.cities);
            },
        );
        // END ANGULAR MAT SEARCH CITIES
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


    setValueDepartmentSelect(departments, id_departmen) {
        let count;
        for (var i = 0; i < departments.length; i++) {
            departments[i].id_departament;
            if (departments[i].id_departament == id_departmen) {
                count = i;
            }
        }        
        this.selectedValue = departments[count].id_departament;
    }

    setValueCitiSelect(cities, id_city) {
        let count;
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].id_city == id_city) {
                count = i;
            }
        }        
        console.log(cities[count]);
        
        this.selectedCityValue = cities[count].id_city;
    }


    citieChangeAction(departament) {
        this.selectedCityValue = null;
        // START ANGULAR MAT SEARCH CITIES
        let id_dep = departament.id_departament;
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
                // this.citieCtrl.setValue(this.cities[10]);
                this.city$ = this.getCity("", this.cities);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH CITIES

    }

    updateLocationUserFront() {
        
        if (this.formLocationEdit.valid) {
            let get_values_location = this.formLocationEdit.value;
            let myObj_user_client = {
                "city": this.selectedCityValue, "neighborhood": get_values_location.neighborhood, "via": get_values_location.via,
                "number": get_values_location.number, "sn": get_values_location.sn,
                "additional_data": get_values_location.additional_data, "phone": get_values_location.phone, "contact": get_values_location.contact
            };            

            const body = JSON.stringify(myObj_user_client);
            this.apiService.updateLocationAction(body, get_values_location.id).subscribe(
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
            for (let i in this.formLocationEdit.controls) {
                this.formLocationEdit.controls[i].markAsTouched();
            }
        }

    }


}
