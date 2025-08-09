import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../../../src/environments/environment';

export interface Departament {
    id_departament: string;
    departament: string;
}


export interface City {
    id_city: string;
    city: string;
}

export interface CategoryStore {
    id: number;
    name_category: string;
}

@Component({
    selector: 'app-StoreAdmEdit',
    templateUrl: './StoreAdmEdit.component.html',
    styleUrls: ['./StoreAdmEdit.component.scss']
})
export class StoreAdmEditComponent implements OnInit {

    public departamentFilterCtrl: FormControl = new FormControl();
    public citieFilterCtrl: FormControl = new FormControl();
    public categorystoreCtrl: FormControl = new FormControl();
    public categorystoreFilterCtrl: FormControl = new FormControl();

    public show_spinner: boolean = false;
    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    formBuilder: any;
    locationsGrid: Location[] = [];
    get_location: Location[] = [];
    pred = "";
    id_store: any;
    address: any;
    description: any;
    email: any;
    logo_store: any;
    validate_logo: any;
    manager: any;
    name_store: any;
    number_identifier: any;
    state_store: any;
    telephone: any;
    id_departament: any;
    id_city: any;
    id_category: any;
    logo_store_save: any;
    city: any;
    department: any;
    category: any;
    public show_sin_img: boolean = false;
    public show_img: boolean = false;
    storeForm: FormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    public show: boolean = false;
    depart$: Observable<Departament[]>;
    city$: Observable<City[]>;
    catego$: Observable<CategoryStore[]>;
    selectedValue;
    selectedCityValue;
    selectedCategoryValue;
    storecategorylist: CategoryStore[] = [];
    storecategory: CategoryStore[] = [];
    files: File[] = [];
    widthMin: Number = 700;
    heightMin: Number = 700;
    toastRejectPixelsImg: ToastOptions = {
        title: "Dimension de imagen",
        msg: "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
        showClose: true,
        timeout: 8000,
        theme: "material"
    };
    toastIconMax: ToastOptions = {
        title: "Logo comercio",
        msg: "Subir solo un logo para el comercio!",
        showClose: true,
        timeout: 4000,
        theme: "material"
    };

    public validate_img: boolean = false;

    public departamentCtrl: FormControl = new FormControl(null, [Validators.required]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private formGroup: FormBuilder,
        private toastyService: ToastaService,
        private apiService: ApiService,
        private _formBuilder: FormBuilder) { }



    ngOnInit() {
        this.route.params.subscribe(res => {
            this.id_store = res.id_store;
        })

        this.storeForm = this.formGroup.group({
            name_store: ['', [Validators.required]],
            address: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            number_identifier: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            description: ['', [Validators.required]],
            // departmentControl: new FormControl('', [Validators.required]),
            // cityControl: new FormControl('', [Validators.required]),
            categorystoreCtrl: new FormControl('', [Validators.required]),
            departamentCtrl: new FormControl('', [Validators.required]),
            citieCtrl: new FormControl('', [Validators.required]),

        });

        this.apiService.getStoreData(this.id_store).subscribe(res => {
            this.getDataStore(res, this.id_store)
        }, error => console.log(error));
    }

    getDataStore(response, id_location) {

        this.address = response.address;
        this.description = response.description;
        this.email = response.email;
        this.logo_store = response.logo_store;
        this.validate_logo = response.logo_store;
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.telephone = response.telephone;
        this.id_departament = response.id_departament;
        this.id_city = response.city_id;
        this.id_category = response.storecategories;
        this.logo_store_save = this.logo_store;

        if (this.logo_store) {
            this.show_sin_img = false;
            this.show_img = true;
            this.logo_store = environment.api.baseBucketImageUrl + response.logo_store_up;
        } else {
            this.show_sin_img = true;
            this.show_img = false;
            this.logo_store = "Sin logo";
        }


        this.storeForm.get('name_store').setValue(this.name_store)
        this.storeForm.get('address').setValue(this.address)
        this.storeForm.get('telephone').setValue(this.telephone)
        this.storeForm.get('email').setValue(this.email)
        this.storeForm.get('number_identifier').setValue(this.number_identifier)
        this.storeForm.get('manager').setValue(this.manager)
        this.storeForm.get('description').setValue(this.description)

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

        // START ANGULAR MAT SEARCH CATE
        this.storecategory = [];
        this.apiService.getStoreCategories().subscribe(
            (data: CategoryStore[]) => {
                this.storecategorylist = data;
                for (var i in this.storecategorylist) {
                    let get_id_category = this.storecategorylist[i]['id'];
                    let get_name_category = this.storecategorylist[i]['name_category'];
                    this.storecategory.push({ name_category: get_name_category, id: get_id_category });
                }
                this.setValueCategorySelect(this.storecategory, this.id_category);
                this.catego$ = this.getCategory("", this.storecategory);
            },
        );
        // END ANGULAR MAT SEARCH CATE

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

    getDepartment(term: string = null, algo): Observable<Departament[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.departament.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    citieChangeAction(departament) {
        this.selectedCityValue = null;
        // START ANGULAR MAT SEARCH CITIES
        let id_dep = departament.id_departament;
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

    getCity(term: string = null, algo): Observable<City[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.city.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    getCategory(term: string = null, algo): Observable<CategoryStore[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    setValueCitiSelect(cities, id_city) {
        let count;
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].id_city == id_city) {
                count = i;
            }
        }
        this.selectedCityValue = cities[count].id_city;
    }

    setValueCategorySelect(categories, id_category) {
        let count;
        for (var i = 0; i < categories.length; i++) {
            categories[i].id;
            if (categories[i].id == id_category) {
                count = i;
            }
        }
        this.selectedCategoryValue = categories[count].id;
    }

    //START SET EVENT FROM DROPZONE COMPLEMENT
    selectFile(event) {
        this.validate_img = false;
        let index = this.files.length != event.addedFiles ? 0 : this.files.length;
        console.log(this.files.length);
        if (this.files.length > 0) {
            this.toastyService.error(this.toastIconMax);
        } else {
            event.addedFiles.map((item) => {
                this.onValidatePixels(item)
                    .then((value: boolean) => {
                        if (value) {
                            this.files.push(item);
                        } else {
                            this.validate_img = true;
                            this.toastyService.error(this.toastRejectPixelsImg);
                        }

                    });
            });

        }
    }


    onValidatePixels(file: File) {
        return new Promise((resolve, reject) => {
            const Img = new Image();
            Img.src = URL.createObjectURL(file);
            Img.onload = (e: any) => {
                const height = e.target.height;
                const width = e.target.width;
                if (height >= this.heightMin || width >= this.widthMin) {
                    resolve(true);
                }
                resolve(false);
            };
        });

    }

    onRemove(event) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }

    submitStoreInfo() {
        this.validate_img = false;
        if (this.validate_logo) {
            if (this.storeForm.valid) {
                this.show = !this.show;
                this.show_spinner = true;
                let myObj_store;
                let values_store = this.storeForm.value;
                // START UPDATE STORE ON DB
                myObj_store = {
                    "address": values_store.address,
                    "telephone": values_store.telephone,
                    "email": values_store.email,
                    "number_identifier": values_store.number_identifier,
                    "manager": values_store.manager,
                    "city": this.selectedCityValue,
                    "description": values_store.description,
                    "logo_store": 1,
                    "storecategories": this.selectedCategoryValue
                };
                this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                    result => {
                        let myJSON = JSON.stringify(result);
                        let obj = JSON.parse(myJSON);
                        console.log(obj.result.id_store);
                        let id_store = obj.result.id_store;

                        if (this.files.length > 0) {
                            for (var i = 0; i < this.files.length; i++) {
                                const file = this.files[i];
                                const formDataLogo = new FormData();
                                formDataLogo.append('id_store', id_store);
                                formDataLogo.append('logo_store_up', file);
                                this.apiService.uploadIconStore(formDataLogo).subscribe(
                                    result => {
                                        this.router.navigate(['/account/store_adm']).then(() => {
                                            window.location.reload();
                                        });
                                    },
                                    error => console.log(error)
                                );
                            }
                        } else {
                            this.router.navigate(['/account/store_adm']).then(() => {
                                window.location.reload();
                            });
                        }
                    },
                    error => console.log(error)
                );
            } else {
                for (let i in this.storeForm.controls) {
                    this.storeForm.controls[i].markAsTouched();
                }
            }

        } else {
            if (this.files.length > 0) {
                if (this.storeForm.valid) {
                    this.show = !this.show;
                    this.show_spinner = true;
                    let myObj_store;
                    let values_store = this.storeForm.value;
                    // START UPDATE STORE ON DB
                    myObj_store = {
                        "address": values_store.address,
                        "telephone": values_store.telephone,
                        "email": values_store.email,
                        "number_identifier": values_store.number_identifier,
                        "manager": values_store.manager,
                        "city": this.selectedCityValue,
                        "description": values_store.description,
                        "logo_store": 1,
                        "storecategories": this.selectedCategoryValue
                    };
                    this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                        result => {
                            let myJSON = JSON.stringify(result);
                            let obj = JSON.parse(myJSON);
                            console.log(obj.result.id_store);
                            let id_store = obj.result.id_store;

                            if (this.files.length > 0) {
                                for (var i = 0; i < this.files.length; i++) {
                                    const file = this.files[i];
                                    const formDataLogo = new FormData();
                                    formDataLogo.append('id_store', id_store);
                                    formDataLogo.append('logo_store_up', file);
                                    this.apiService.uploadIconStore(formDataLogo).subscribe(
                                        result => {
                                            this.router.navigate(['/account/store_adm']).then(() => {
                                                window.location.reload();
                                            });
                                        },
                                        error => console.log(error)
                                    );
                                }
                            } else {
                                this.router.navigate(['/account/store_adm']).then(() => {
                                    window.location.reload();
                                });
                            }
                        },
                        error => console.log(error)
                    );
                } else {
                    for (let i in this.storeForm.controls) {
                        this.storeForm.controls[i].markAsTouched();
                    }
                }

            } else {
                // VALIDACION DE IMAGEN
                this.validate_img = true;

            }
        }

    }




}
