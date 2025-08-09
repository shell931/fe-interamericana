import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ApiService } from '../../../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { environment } from '../../../../../src/environments/environment';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

const { isArray } = Array;

export interface Prod {
    image: string;
    name: string;
    price: string;
    produc_code: string;
    brand: string;
    product_code: string;
    id_product: string;
    availability: boolean;
    route_product: string;
    id_store: string;
    descriptions: string[];
    store_id: number;
}

export interface Card {
    title: string;
    subtitle: string;
    text: string;
}

interface subcategoryNode {
    id_store: number;
    id: number;
    name_category: string;
    icon:any;
    children?: subcategoryNode[];
    type: string;
}


interface ExampleFlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector: 'app-DetailStorePage',
    templateUrl: './DetailStore.component.html',
    styleUrls: ['./DetailStore.component.scss']
})

export class DetailStoreComponent implements OnInit {

    private _transformer = (node: subcategoryNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name_category,
            level: level,
            id_store: node.id_store,
            id: node.id,
            name_category: node.name_category,            
            icon: node.icon,            
            type: node.type
        };
    }

    treeControlN = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);

    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);
    dataSourceN = new MatTreeFlatDataSource(this.treeControlN, this.treeFlattener);

    treeControl = new NestedTreeControl<subcategoryNode>(node => node.children);
    dataSourceTree = new MatTreeNestedDataSource<subcategoryNode>();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    productsGrid: Prod[] = [];
    dataSource = new MatTableDataSource<Prod>(this.productsGrid);
    obs: Observable<any>;
    id: any;
    storeGrid: any;
    get_product: Prod[] = [];
    loaded = false;
    @Output() addToCart: EventEmitter<any> = new EventEmitter();
    @Output() addToWishList: EventEmitter<any> = new EventEmitter();
    get_subca: any[] = [];
    get_categories: subcategoryNode[] = [];
    searchText: any;
    p: any;
    name_store: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef,

    ) { }

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.id = res.id;
        })
        localStorage.removeItem("type_cate_subcate");
        localStorage.removeItem("id_category_prod");
        this.apiService.getStoreData(this.id).subscribe(res => this.getStoreData(res));
        // this.apiService.getViewProductsWithoutAuth().subscribe(res => this.getProductData(res,this.id));
        this.apiService.getProductStoresbyStoreid(this.id).subscribe(res => this.getProductData(res, this.id));
        this.apiService.getCategoriesStore(this.id).subscribe(res => this.getCategoriesMenu(res, this.id));
    }


    SearchStoreCategories(type, id_store, id){
        localStorage.removeItem("id_category_prod");
        localStorage.removeItem("type_cate_subcate");
        localStorage.setItem('id_category_prod', id);
        localStorage.setItem('type_cate_subcate', type);
        if (type == "category") {
            this.apiService.getProductsbyCategorybyStore(id, id_store).subscribe(res => this.getProductData(res, id_store));
        } else {
            this.apiService.getProductsbySubcategorybyStore(id, id_store).subscribe(res => this.getProductData(res, id_store));
        }    
    }

    getCategoriesMenu(response, id_store) {        
        this.get_categories = [];
        for (var i = 0; i < response.length; i++) {
            let subcategor = this.createSubcategories(response[i].rel_categories, id_store);
            this.get_categories.push(
                {
                    id_store: id_store,
                    id: response[i].id,
                    name_category: response[i].name_category,
                    icon: response[i].icon,
                    type: 'category',
                    children: subcategor,
                });
        }            
        this.dataSourceTree.data = this.get_categories;
        this.dataSourceN.data = this.get_categories;
    }

    createSubcategories(subcate, id_store) {
        this.get_subca = [];
        for (var i = 0; i < subcate.length; i++) {
            this.get_subca.push(
                {
                    id_store: id_store,
                    id: subcate[i].id,
                    name_category: subcate[i].name_subcategory,
                    type: 'subcategory'
                },
            );
        }
        return this.get_subca;
    }

    getStoreData(response) {

        let myObj_store;
        myObj_store = {
            logo_store: response.logo_store,
            name_store: response.name_store,
            state_store: response.state_store,
        };
        this.name_store = response.name_store;
        this.storeGrid = myObj_store;
    }

    getProductData(response, store_id) {    
        this.get_product = [];    
        for (var i = 0; i < response.length; i++) {
            let get_image = environment.api.baseBucketImageUrl + response[i].image;
            let get_name_product = response[i].name_product;
            let get_total_price = response[i].total_price;
            let get_produc_code = response[i].product_code;
            let get_brand = response[i].brand;
            let get_product_code = response[i].product_code;
            let get_id_product = response[i].id_product;
            let get_id_store = response[i].store;
            let get_availability = response[i].availability;
            this.get_product.push({
                image: get_image,
                name: get_name_product,
                price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                id_product: get_id_product,
                id_store: get_id_store,
                route_product: '/products/accessories/' + get_id_product,
                descriptions: ['row1', 'row2'],
                availability: get_availability,
                store_id: store_id
            });
        }

        this.productsGrid = this.get_product;    
        this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();


    }


    public onLoad() {
        this.loaded = true;
    }

    public checkCartAlready(singleProduct) {
        let products = JSON.parse(localStorage.getItem("cart_item")) || [];
        if (!products.some((item) => item.name == singleProduct.name)) {
            return true;
        }
    }

    public addToCartProduct(value: any) {
        let myObj_product = {
            "brand": value.brand,
            "discount_price": value.discount_price,
            "id_product": value.id_product,
            "id_store": value.id_store,
            "name": value.name,
            "price": value.price,
            "produc_code": value.produc_code,
            "quantity": 1,
            "canti": 1,
            "image": value.image,
            "route_product": value.route_product
        };

        let products = JSON.parse(localStorage.getItem("cart_item")) || [];
        if (products.length > 0) {

            this.embryoService.addToCart(myObj_product);

            // let id_store_storage;
            // for (var i = 0; i < 1; i++) {
            //     id_store_storage = products[i].id_store;
            // }
            // console.log(id_store_storage);
            // console.log(value.store_id);
            // if (id_store_storage == value.store_id) {
            //     this.embryoService.addToCart(value);
            // }
            // else {
            //     //   const dialogRef = this.dialog.open(DialogContentProductDiferentStoreDetail, {
            //     //      width: '500px',
            //     //    });      
            //     //   dialogRef.afterClosed().subscribe(result => {
            //     //      console.log(`Dialog result: ${result}`);
            //     //   });
            // }
        } else {
            this.embryoService.addToCart(myObj_product);
        }

    }

    public productAddToWishlist(value: any) {
        this.embryoService.addToWishlist(value);
    }

}

// CLASS TO FILTER AND PAGINATE
@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    get_product: Prod[] = [];
    productsGrid: any;
    id: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        public embryoService: EmbryoService,
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    transform(posts: Card[], find: string): Card[] {
        this.route.params.subscribe(res => {
            this.id = res.id;
        })
        
        let id_category_prod = localStorage.getItem('id_category_prod');        
        let type_cate_subcate = localStorage.getItem('type_cate_subcate');                 
        
        if (type_cate_subcate == "category") {
            this.apiService.getProductsbyCategorybyStore(id_category_prod, this.id).subscribe(res => this.getProductData(res, posts, find, this.id));
        } else if(type_cate_subcate == "subcategory") {            
            this.apiService.getProductsbySubcategorybyStore(id_category_prod, this.id).subscribe(res => this.getProductData(res, posts, find, this.id));
        }else{            
            this.apiService.getProductStoresbyStoreid(this.id).subscribe(res => this.getProductData(res, posts, find, this.id));
        }
    
        if (!posts) return [];
        if (!find) return posts;
        find = find.toLowerCase();
        return search(this.productsGrid, find);
    }

    getProductData(response, posts, find, store_id) {
        this.get_product = [];
        for (var i = 0; i < response.length; i++) {
            let get_image = environment.api.baseBucketImageUrl + response[i].image;
            let get_name_product = response[i].name_product;
            let get_total_price = response[i].total_price;
            let get_produc_code = response[i].product_code;
            let get_brand = response[i].brand;
            let get_product_code = response[i].product_code;
            let get_discount_price = response[i].discount_price;
            let get_id_product = response[i].id_product;
            let get_id_store = response[i].store;
            let get_availability = response[i].availability;
            this.get_product.push({
                image: get_image,
                name: get_name_product,
                price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                id_product: get_id_product,
                id_store: get_id_store,
                availability: get_availability,
                route_product: '/products/accessories/' + get_id_product,
                descriptions: ['row1', 'row2'],
                store_id: store_id
            });
        }
        this.productsGrid = this.get_product;
    }


    getProductDataCate(response, posts, find, store_id) {
        this.get_product = [];
        for (var i = 0; i < response.length; i++) {
            let get_image = environment.api.baseBucketImageUrl + response[i].image;
            let get_name_product = response[i].name_product;
            let get_total_price = response[i].total_price;
            let get_produc_code = response[i].product_code;
            let get_brand = response[i].brand;
            let get_product_code = response[i].product_code;
            let get_discount_price = response[i].discount_price;
            let get_id_product = response[i].id_product;
            let get_id_store = response[i].store;
            let get_availability = response[i].availability;
            this.get_product.push({
                image: get_image,
                name: get_name_product,
                price: get_total_price,
                produc_code: get_produc_code,
                brand: get_brand,
                product_code: get_product_code,
                id_product: get_id_product,
                id_store: get_id_store,
                route_product: '/products/accessories/' + get_id_product,
                descriptions: ['row1', 'row2'],
                store_id: store_id,
                availability : get_availability,
            });
        }
        this.productsGrid = this.get_product;
    }


}


function search(entries: any[], search: string) {
    search = search.toLowerCase();
    return entries.filter(function (obj) {
        const keys: string[] = Object.keys(obj);
        return keys.some(function (key) {
            const value = obj[key];
            if (isArray(value)) {
                return value.some(v => {
                    return v.toLowerCase().includes(search);
                });
            }
            else if (!isArray(value)) {
                return value.toString().toLowerCase().includes(search);
            }
        })
    });
}