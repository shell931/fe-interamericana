import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../../src/environments/environment';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';


declare let alertify: any;

export interface Category {
    id: string;
    name_category: string;
}
export interface Subcategory {
    id: number;
    name_subcategory: string;
}

export interface Image {
    image: string;
}


@Component({
    selector: 'app-ProductEditAdm',
    templateUrl: './ProductEditAdm.component.html',
    styleUrls: ['./ProductEditAdm.component.scss']
})

export class ProductEditAdmComponent implements OnInit {


    widthMin: Number = 100;
    heightMin: Number = 100;
    isApproved: boolean = false;
    selectedFiles: FileList;
    files: File[] = [];
    subcategories: Subcategory[] = [];
    subcategorieslist: Subcategory[] = [];

    public subcategoryFilterCtrl: FormControl = new FormControl();
    productForm: FormGroup;
    public availa: FormControl = new FormControl(null, [Validators.required]);
    // START ANGULAR MAT SEARCH CATEGORIES
    public categoryCtrl: FormControl = new FormControl(null, [Validators.required]);
    public subcategoryCtrl: FormControl = new FormControl(null, [Validators.required]);
    public categoryFilterCtrl: FormControl = new FormControl();

    // END ANGULAR MAT SEARCH CATEGORIES
    categorylist: Category[] = [];
    category: Category[] = [];
    id_product: any;
    get_pr: any[] = [];
    get_id_image: any[] = [];
    productsGrid: any;
    name_product: any;
    description_product: any;
    product_code: any;
    stock: any;
    brand: any;
    total_price: any;
    // discount_price: any;
    subcategory: any;
    get_id_category: any;
    availability: any;
    selectedValueSubcategory;
    selectedValueCategory;
    selectedValueAvailable;
    prod_category$: Observable<Category[]>;
    sub_catego$: Observable<Subcategory[]>;
    selectedProdCate: any;
    selectedSubcategory: any;
    selectedAvaila: any;


    toastvalidateimg: ToastOptions = {
        title: "Imagen",
        msg: "Ingresar por lo menos una imagen!",
        showClose: true,
        timeout: 8000,
        theme: "material"
    };

    toastsaveproduct: ToastOptions = {
        title: "Producto registrado",
        msg: "El producto o servicio a sido registrado!",
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

    public show: boolean = false;
    btnDisabled = false;

    public validate_img: boolean = false;
    public validate_coun_img: boolean = false;

    constructor(
        private route: ActivatedRoute,
        public formBuilder: FormBuilder,
        private apiService: ApiService,
        private cookieService: CookieService,
        private toastyService: ToastaService,
        private router: Router,
    ) { }

    ngOnInit() {

        this.route.params.subscribe(res => {
            this.id_product = res.id_product;
        })

        console.log(this.id_product);

        this.productForm = this.formBuilder.group({
            name_product: ['', [Validators.required]],
            description_product: ['', [Validators.required]],
            product_code: ['', [Validators.required]],
            stock: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            categoryCtrl: new FormControl('', [Validators.required]),
            subcategoryCtrl: new FormControl('', [Validators.required]),
            brand: ['', [Validators.required]],
            // discount_price: ['', [Validators.required]],
            total_price: ['', [Validators.required, Validators.pattern("^[0-9.]*$")]],
            availa: new FormControl('', [Validators.required]),
        });

        this.apiService.getProductsbyIdAdmin(this.id_product).subscribe(res => this.getProductData(res));

    }



    getProductData(response) {
        let gallery = response.rel_product;
        this.get_pr = [];
        this.name_product = response.name_product;
        this.description_product = response.description_product;
        this.product_code = response.product_code;
        this.stock = response.stock;
        this.brand = response.brand;
        this.total_price = response.total_price;
        // this.discount_price = response.discount_price;
        this.subcategory = response.subcategory;
        this.availability = response.availability;

        this.apiService.FindCategoryBySubcategory(this.subcategory).subscribe(
            dataCategory => {
                let id_category;
                for (var i in dataCategory) {
                    id_category = dataCategory[i]['category'];
                }

                this.category = [];
                this.apiService.getCategories().subscribe(
                    (data: Category[]) => {
                        this.categorylist = data;
                        for (var i in this.categorylist) {
                            let get_id_category = this.categorylist[i]['id'];
                            let get_category = this.categorylist[i]['name_category'];
                            this.category.push({ name_category: get_category, id: get_id_category });
                        }
                        this.setValueCategoriesSelect(this.category, id_category);
                        this.prod_category$ = this.getCategoriesProd("", this.category);
                    },
                    error => console.log(error)
                );

                this.subcategories = [];
                this.apiService.getSubCategories(id_category).subscribe(
                    (data: Subcategory[]) => {
                        this.subcategorieslist = data;
                        for (var i in this.subcategorieslist) {
                            let get_id_subcategory = this.subcategorieslist[i]['id'];
                            let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
                            this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
                        }

                        this.setValueSubCategoriesSelect(this.subcategories, this.subcategory);
                        this.sub_catego$ = this.getSubcategories("", this.subcategories);
                    },
                    error => console.log(error)
                );

            },
            error => console.log(error)
        );

        if (this.availability == true) {
            this.selectedValueAvailable = "Si"
        } else {
            this.selectedValueAvailable = "No"
        }

        this.get_pr = [];
        for (var i = 0; i < gallery.length; i++) {
            this.get_pr.push({
                id_image: gallery[i].id,
                image: gallery[i].image,
            });

        }

        this.productForm.get('name_product').setValue(this.name_product)
        this.productForm.get('description_product').setValue(this.description_product)
        this.productForm.get('product_code').setValue(this.product_code)
        this.productForm.get('stock').setValue(this.stock)
        this.productForm.get('brand').setValue(this.brand)
        // this.productForm.get('total_price').setValue(Math.round(this.total_price))
        // this.productForm.get('total_price').setValue(Intl.NumberFormat().format(Math.round(this.total_price)))
        this.productForm.get('total_price').setValue(Math.round(this.total_price))
        // this.productForm.get('discount_price').setValue(this.discount_price)


    }



    setValueSubCategoriesSelect(subcategories, id_subcategory) {
        let count;
        for (var i = 0; i < subcategories.length; i++) {
            subcategories[i].idt;
            if (subcategories[i].id == id_subcategory) {
                count = i;
            }
        }
        this.selectedValueSubcategory = subcategories[count].id;
    }

    setValueCategoriesSelect(categories, id_category) {
        let count_cat;
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == id_category) {
                count_cat = i;
            }
        }
        this.selectedValueCategory = categories[count_cat].id;
    }

    onSelect(event) {
        this.files.push(...event.addedFiles);
    }

    onRemove(event) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }

    deleteProduct(i) {

        this.get_id_image.push(i.id_image);
        let galery = this.get_pr;
        this.get_pr = [];
        for (var a = 0; a < galery.length; a++) {
            if (galery[a].id_image != i.id_image) {
                this.get_pr.push({
                    id_image: galery[a].id_image,
                    image: galery[a].image,
                });
            }
        }
    }



    //START SET EVENT FROM DROPZONE COMPLEMENT
    selectFile(event) {
        this.validate_img = false;
        let index = this.files.length != event.addedFiles ? 0 : this.files.length;
        event.addedFiles.map((item) => {
            this.onValidatePixels(item)
                .then((value: boolean) => {
                    if (value) {
                        this.files.push(item);
                    } else {
                        this.validate_img = true;
                        // this.toastyService.error(this.toastRejectPixelsImg);
                    }
                });
        });

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
    //END SET EVENT FROM DROPZONE COMPLEMENT



    getCategoriesProd(term: string = null, algo): Observable<Category[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.name_category.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }


    subcategoriesChangeAction(categori_id) {

        this.selectedValueSubcategory = null;
        // START ANGULAR MAT SEARCH SUBCATEGORIES
        let id_category = categori_id.id;
        this.subcategories = [];
        this.apiService.getSubCategories(id_category).subscribe(
            (data: Subcategory[]) => {
                this.subcategorieslist = data;
                for (var i in this.subcategorieslist) {
                    let get_id_subcategory = this.subcategorieslist[i]['id'];
                    let get_name_subcategory = this.subcategorieslist[i]['name_subcategory'];
                    this.subcategories.push({ id: get_id_subcategory, name_subcategory: get_name_subcategory });
                }
                this.sub_catego$ = this.getSubcategories("", this.subcategories);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH SUBCATEGORIES

    }


    getSubcategories(term: string = null, algo): Observable<Subcategory[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.name_subcategory.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }



    submitProductInfo() {

        if (this.productForm.valid) {
            this.validate_coun_img = false;
            this.apiService.getCountImagesProducts(this.id_product).subscribe(
                result => {

                    let count_images_product = result;
                    let count_images_to_upload = this.files.length;
                    let count_images_to_delete = this.get_id_image.length;
                    let comod = 0;

                    if (count_images_product <= count_images_to_delete) {
                        if (count_images_to_upload < 1) {
                            comod = 1;
                        } else {
                            comod = 0;
                        }
                    } else {
                        comod = 0;
                    }

                    if (comod == 1) {
                        this.validate_coun_img = true;
                    } else {
                        this.btnDisabled = true;
                        this.show = !this.show;
                        let myObj_product;
                        let values_productForm = this.productForm.value;
                        // let total = values_productForm.total_price.replace(/\./g,'');
                        console.log(this.selectedValueAvailable);
                        let total = values_productForm.total_price;
                        if(this.selectedValueAvailable=="Si"){
                            this.selectedValueAvailable = true;
                        }else if(this.selectedValueAvailable=="No"){
                            this.selectedValueAvailable = false;
                        }
                        console.log(this.selectedValueAvailable);

                        myObj_product = {
                            "name_product": values_productForm.name_product,
                            "description_product": values_productForm.description_product,
                            "product_code": values_productForm.product_code,
                            "total_price": total,
                            "availability": this.selectedValueAvailable,
                            "stock": values_productForm.stock,
                            "brand": values_productForm.brand,
                            "subcategory": this.selectedValueSubcategory,
                            // "discount_price": values_productForm.discount_price,
                            "edit_pr": 1,
                            // "published": false,
                        };
                        this.apiService.updateProduc(myObj_product, this.id_product).subscribe(
                            result => {
                                if (this.files.length > 0) {
                                    const id_store = localStorage.getItem('id-store');
                                    let product_id = this.id_product;
                                    let get_first_image_name = '';
                                    // START UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE PRODUCT
                                    var today = new Date();
                                    let consec = 0;
                                    for (var i = 0; i < this.files.length; i++) {
                                        const file = this.files[i];
                                        let type = file.type;
                                        let type_sp = type.split("/");
                                        let get_type_img = type_sp[1];
                                        let myObj_image;
                                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                        var dateTime = date + ' ' + time;
                                        var dates_as_int = [dateTime];
                                        const dates = dates_as_int.map(date => new Date(date).getTime());
                                        const namefile = id_store + '-' + this.selectedValueSubcategory + '-' + dates + i + '.' + get_type_img;

                                        if (i == 0) {
                                            get_first_image_name = namefile;
                                        }

                                        const formDataDocIde = new FormData();
                                        formDataDocIde.append('image', file);
                                        formDataDocIde.append('product', product_id);
                                        formDataDocIde.append('image_name', namefile);

                                        this.apiService.uploadFile(formDataDocIde).subscribe(
                                            result => {
                                                consec = consec + 1;
                                                if ((consec == this.files.length) && (result)) {
                                                    this.apiService.updateImageProduc(get_first_image_name, product_id).subscribe(
                                                        result => {
                                                            if (this.get_id_image.length > 0) {
                                                                let consec_del = 0;
                                                                for (var a = 0; a < this.get_id_image.length; a++) {
                                                                    console.log("Elimina imagen" + a);
                                                                    myObj_product = {
                                                                        "image_id": this.get_id_image[a]
                                                                    };
                                                                    this.apiService.DeleteProductImage(myObj_product).subscribe(
                                                                        data => {
                                                                            consec_del = consec_del + 1;
                                                                            if ((consec_del == this.get_id_image.length) && (data)) {
                                                                                window.location.reload();
                                                                            }
                                                                        },
                                                                        error => console.log(error)
                                                                    );

                                                                }
                                                            } else {
                                                                window.location.reload();
                                                            }
                                                        },
                                                        error => console.log(error)
                                                    );
                                                }
                                            },
                                            error => console.log(error)
                                        );

                                    }
                                    // END UPLOAD IMAGES ON S3 AWS ASOCIATE TO THE PRODUCT
                                } else {
                                    if (this.get_id_image.length > 0) {
                                        let consec_del = 0;
                                        for (var a = 0; a < this.get_id_image.length; a++) {
                                            console.log("Elimina imagen" + a);
                                            myObj_product = {
                                                "image_id": this.get_id_image[a]
                                            };
                                            this.apiService.DeleteProductImage(myObj_product).subscribe(
                                                data => {
                                                    consec_del = consec_del + 1;
                                                    if ((consec_del == this.get_id_image.length) && (data)) {
                                                        window.location.reload();
                                                    }
                                                },
                                                error => console.log(error)
                                            );

                                        }
                                    } else {
                                        window.location.reload();
                                    }
                                }
                            },
                            error => console.log(error)
                        );
                    }

                },
                error => console.log(error)
            );


        } else {
            for (let i in this.productForm.controls) {
                this.productForm.controls[i].markAsTouched();
            }
        }
        return false;
    }



}

