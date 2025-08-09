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
    selector: 'app-EditProfile',
    templateUrl: './AddStore.component.html',
    styleUrls: ['./AddStore.component.scss']
})

export class AddStoreComponent implements OnInit {


    departamentlist: Departament[] = [];
    storecategorylist: CategoryStore[] = [];
    departments: Departament[] = [];
    storecategory: CategoryStore[] = [];
    citietlist: City[] = [];
    cities: City[] = [];
    files: File[] = [];
    selectedFiles: FileList;
    widthMin: Number = 700;
    heightMin: Number = 700;

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
        title: "Tienda creada",
        msg: "La tienda ha sido creada en el sistema!",
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
        // START ANGULAR MAT SEARCH DEPARTAMENT
        this.departments = [];
        this.apiService.getDepartments().subscribe(
            (data: Departament[]) => {
                this.departamentlist = data;
                for (var i in this.departamentlist) {
                    let get_id_departament = this.departamentlist[i]['id_departament'];
                    let get_departament = this.departamentlist[i]['departament'];
                    this.departments.push({ departament: get_departament, id_departament: get_id_departament });
                }
                this.departamentCtrl.setValue(this.departments[10]);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH DEPARTAMENT

        // START ANGULAR MAT SEARCH CATEGORIES
        this.storecategory = [];
        this.apiService.getStoreCategories().subscribe(
            (data: CategoryStore[]) => {
                this.storecategorylist = data;
                for (var i in this.storecategorylist) {
                    let get_id_category = this.storecategorylist[i]['id'];
                    let get_name_category = this.storecategorylist[i]['name_category'];
                    this.storecategory.push({ name_category: get_name_category, id: get_id_category });
                }
                this.categorystoreCtrl.setValue(this.storecategory[10]);
            },
        );
        // END ANGULAR MAT SEARCH CATEGORIES

        this.storeForm = this.formGroup.group({
            name_store: ['', [Validators.required]],
            address: ['', [Validators.required]],
            telephone: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            number_identifier: ['', [Validators.required]],
            manager: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });

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

    // END START ANGULAR MAT SEARCH DEPARTAMENTS





    citieChangeAction(departament) {
        // START ANGULAR MAT SEARCH CITIES
        let get_data_dep = departament.value;
        let id_dep = get_data_dep.id_departament;
        // console.log(id_dep);
        this.cities = [];
        this.apiService.getCitiesbyDepartments(id_dep).subscribe(
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
        if (this.departamentCtrl.valid) {
            if (this.citieCtrl.valid) {
                if (this.storeForm.valid) {
                    if (this.files.length <= 0) {
                        this.toastyService.error(this.toastvalidateimg);
                    } else {
                        if (this.files.length > 1) {
                            this.toastyService.error(this.toastIconMax);
                        } else {
                            let myObj_store;
                            let values_store = this.storeForm.value;
                            let value_city = this.citieCtrl.value;
                            let value_category = this.categorystoreCtrl.value;

                            // START CREATE STORE ON DB
                            myObj_store = {
                                "name_store": values_store.name_store, "address": values_store.address,
                                "telephone": values_store.telephone, "email": values_store.email, "number_identifier": values_store.number_identifier,
                                "manager": values_store.manager, "state_store": "true", "city": value_city.id_city, "logo_store": 0,
                                "description": values_store.description, "storecategories":value_category.id
                            };
                            this.apiService.setStore(myObj_store).subscribe(
                                result => {

                                    let store_id = result["id_store"];
                                    // START UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                                    const id_store = localStorage.getItem('id-store');
                                    let today = new Date();
                                    let name_logo = '';
                                    // for (var i = 0; i < this.files.length; i++) {
                                    //     const file = this.files[i];
                                    //     let type = file.type;
                                    //     let type_sp = type.split("/");
                                    //     let get_type_img = type_sp[1];
                                    //     let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                    //     let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                    //     let dateTime = date + ' ' + time;
                                    //     let dates_as_int = [dateTime];
                                    //     const dates = dates_as_int.map(date => new Date(date).getTime());
                                    //     const namefile = store_id + '-' + dates + i + '.' + get_type_img;
                                    //     this.apiService.uploadIconStore(file, namefile);
                                    //     name_logo = namefile;
                                    // }

                                    this.apiService.updateLogoFieldStore(name_logo, store_id).subscribe(
                                        result => { },
                                        error => console.log(error)
                                    );
                                    // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE LOGO
                                },
                                error => console.log(error)
                            );
                            // END CREATE STORE ON DB
                            this.router.navigate(['/admin-panel/store']).then(() => {
                                this.toastyService.success(this.toastOption);
                            });
                        }
                    }
                } else {
                    for (let i in this.storeForm.controls) {
                        this.storeForm.controls[i].markAsTouched();
                    }
                }
            } else {
                for (let i in this.storeForm.controls) {
                    this.storeForm.controls[i].markAsTouched();
                }
            }
        } else {
            for (let i in this.storeForm.controls) {
                this.storeForm.controls[i].markAsTouched();
            }
        }

    }

}


