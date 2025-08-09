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
    selector: 'app-EditStore',
    templateUrl: './EditStore.component.html',
    styleUrls: ['./EditStore.component.scss']
})

export class EditStoreComponent implements OnInit {


    departamentlist: Departament[] = [];
    departments: Departament[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    files: File[] = [];
    selectedFiles: FileList;
    id_store: any;
    address: any;
    description: any;
    email: any;
    logo_store: any;
    logo_store_save: any;
    manager: any;
    name_store: any;
    number_identifier: any;
    state_store: any;
    telephone: any;
    selectedValue;
    selectedCityValue;
    selectedCategoryValue;
    id_city: any;
    id_departament: any;
    id_category: any;
    widthMin: Number = 700;
    heightMin: Number = 700;
    public show: boolean = false;
    storecategorylist: CategoryStore[] = [];
    storecategory: CategoryStore[] = [];

    // START ANGULAR MAT SEARCH DEPARTAMENT
    public departamentCtrl: FormControl = new FormControl(null, [Validators.required]);
    public citieCtrl: FormControl = new FormControl(null, [Validators.required]);
    public departamentFilterCtrl: FormControl = new FormControl();
    public citieFilterCtrl: FormControl = new FormControl();
    @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
    private _onDestroy = new Subject<void>();
    // END ANGULAR MAT SEARCH DEPARTAMENT

    // START ANGULAR MAT SEARCH CATEGORY STORE
    public categorystoreCtrl: FormControl = new FormControl(null, [Validators.required]);
    public categorystoreFilterCtrl: FormControl = new FormControl();
    // END ANGULAR MAT SEARCH CATEGORY STORE


    storeForm: FormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    formBuilder: any;
    toastOption: ToastOptions = {
        title: "Tienda Actualizada",
        msg: "La tienda ha sido actualizada!",
        showClose: true,
        timeout: 4000,
        theme: "material"
    };
    toastIconMax: ToastOptions = {
        title: "Logo comercio",
        msg: "Subir solo un logo para el comercio!",
        showClose: true,
        timeout: 4000,
        theme: "material"
    };
    toastvalidateimg: ToastOptions = {
        title: "Logo",
        msg: "Ingresar logo!",
        showClose: true,
        timeout: 8000,
        theme: "material"
    };

    toastRejectPixelsImg: ToastOptions = {
        title: "Dimension de imagen",
        msg: "No pudimos subir algunas de tus imágenes\n Deben tener formato jpg o png\n Deben tener más de 700 píxeles en uno de sus lados.",
        showClose: true,
        timeout: 8000,
        theme: "material"
    };

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
        console.log(this.id_store);
        this.storeForm = this.formGroup.group({
            name_store: ['', [Validators.required]],
            address: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            number_identifier: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            description: ['', [Validators.required]],
            departmentControl: new FormControl('', [Validators.required]),
            cityControl: new FormControl('', [Validators.required]),
            categorystoreCtrl: new FormControl('', [Validators.required]),
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
        this.manager = response.manager;
        this.name_store = response.name_store;
        this.number_identifier = response.number_identifier;
        this.state_store = response.state_store;
        this.telephone = response.telephone;
        this.id_departament = response.id_departament;
        this.id_city = response.city_id;
        this.id_category = response.storecategories;
        this.logo_store_save = this.logo_store;
        this.logo_store = 'https://store-ever-icon-store.s3.us-east-2.amazonaws.com/' + this.logo_store;


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
                this.departamentCtrl.setValue(this.departments[10]);
                this.departamentFilterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => {
                        this.filterDepartament();
                    });
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
                this.citieCtrl.setValue(this.cities[10]);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH CITIES

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
                this.categorystoreCtrl.setValue(this.storecategory[10]);
            },
        );
        // END ANGULAR MAT SEARCH CATE

    }


    setValueCategorySelect(categories, id_category) {
        let count;
        for (var i = 0; i < categories.length; i++) {
            categories[i].id;
            if (categories[i].id == id_category) {
                count = i;
            }
        }
        this.selectedCategoryValue = categories[count];
    }



    setValueDepartmentSelect(departments, id_departmen) {
        let count;
        for (var i = 0; i < departments.length; i++) {
            departments[i].id_departament;
            if (departments[i].id_departament == id_departmen) {
                count = i;
            }
        }
        this.selectedValue = departments[count];
    }

    setValueCitiSelect(cities, id_city) {
        let count;
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].id_city == id_city) {
                count = i;
            }
        }
        this.selectedCityValue = cities[count];
    }

    //START SET EVENT FROM DROPZONE COMPLEMENT
    selectFile(event) {
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
                console.log(e);
                const height = e.target.height;
                const width = e.path[0].width;
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
    //END SET EVENT FROM DROPZONE COMPLEMENT


    // START ANGULAR MAT SEARCH DEPARTAMENTS
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    protected filterDepartament() {
        if (!this.departments) {
            return;
        }
        // get the search keyword
        let search = this.departamentFilterCtrl.value;
        if (!search) {
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
    }
    // END START ANGULAR MAT SEARCH DEPARTAMENTS




    citieChangeAction(departament) {

        this.selectedCityValue = null;
        // START ANGULAR MAT SEARCH CITIES
        let get_data_dep = departament.value;
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
                this.citieCtrl.setValue(this.cities[10]);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH CITIES

    }


    submitStoreInfo() {
        if (this.storeForm.valid) {
            this.show = !this.show;
            let myObj_store;
            let values_store = this.storeForm.value;

            // START UPDATE STORE ON DB
            myObj_store = {
                "name_store": values_store.name_store, "address": values_store.address,
                "telephone": values_store.telephone, "email": values_store.email,
                "number_identifier": values_store.number_identifier, "manager": values_store.manager,
                "state_store": "true", "city": values_store.cityControl.id_city,
                "description": values_store.description,
                "logo_store": this.logo_store_save, "storecategories":values_store.categorystoreCtrl.id
            };

            this.apiService.updateStore(myObj_store, this.id_store).subscribe(
                result => {

                    if (this.files.length > 0) {
                        let store_id = result["id_store"];
                        // START UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                        // let today = new Date();
                        // let name_logo = '';
                        // for (var i = 0; i < this.files.length; i++) {
                        //     const file = this.files[i];
                        //     const namefile = this.logo_store_save;
                        //     this.apiService.uploadIconStore(file, namefile);
                        //     name_logo = namefile;
                        // }
                        // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                    }

                },
                error => console.log(error)
            );
            // END UPDATE STORE ON DB
            if (this.files.length > 0) {
                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            } else {
                this.show = !this.show;
                this.router.navigate(['/admin-panel/store/edit_store/', this.id_store]).then(() => {
                    this.toastyService.success(this.toastOption);
                });
            }

        } else {
            for (let i in this.storeForm.controls) {
                this.storeForm.controls[i].markAsTouched();
            }
        }

    }

}


