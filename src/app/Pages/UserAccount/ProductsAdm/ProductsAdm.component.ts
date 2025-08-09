import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SweetAlertOptions } from 'sweetalert2';

const { isArray } = Array;

export interface Prod {
	image: string;
	name_product: string;
	total_price: string;
	produc_code: string;
	brand: string;
	product_code: string;
	id_product: any;
}

export interface Card {
	title: string;
	subtitle: string;
	text: string;
}


@Component({
	selector: 'app-ProductsAdm',
	templateUrl: './ProductsAdm.component.html',
	styleUrls: ['./ProductsAdm.component.scss']
})

export class ProductsAdm implements OnInit {


	get_menu: Prod[] = [];
	productsList: any;
	popUpDeleteUserResponse: any;
	showType: string = 'grid';
	displayedProductColumns: string[] = ['action', 'id', 'image', 'name', 'brand', 'category', 'product_code', 'discount_price', 'price'];
	searchText:any;
	p:any;

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	productsGrid: Prod[] = [];
	dataSource = new MatTableDataSource<Prod>(this.productsGrid);
	obs: Observable<any>;
	alertOpt: SweetAlertOptions = {};

	toastdeleteproduct: ToastOptions = {
		title: "Producto eliminado",
		msg: "El producto o servicio a sido eliminado!",
		showClose: true,
		timeout: 8000,
		theme: "material"
	};

	toastfaildeleteproduct: ToastOptions = {
		title: "Fallo eliminacion",
		msg: "Fallo eliminación del producto o servicio contacte con el administrador!",
		showClose: true,
		timeout: 8000,
		theme: "material"
	};

	constructor(
		public translate: TranslateService,
		private router: Router,
		private apiService: ApiService,
		private cookieService: CookieService,
		private toastyService: ToastaService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.getProductsbyStoreid(id_store).subscribe(res => this.getProductData(res));
	}


	getProductData(response) {
		this.productsGrid = null;
		this.get_menu = [];
		for (var i = 0; i < response.length; i++) {
			let get_image = environment.api.baseBucketImageUrl + response[i].image;
			let get_name_product = response[i].name_product;
			let get_total_price = response[i].total_price;
			let get_produc_code = response[i].product_code;
			let get_brand = response[i].brand;
			let get_product_code = response[i].product_code;
			let get_discount_price = response[i].discount_price;
			let get_id_product = response[i].id_product;
			this.get_menu.push({
				image: get_image,
				name_product: get_name_product,
				total_price: get_total_price,
				produc_code: get_produc_code,
				brand: get_brand,
				product_code: get_product_code,
				id_product: get_id_product
			});
		}
		this.productsGrid = this.get_menu;

		this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
		this.changeDetectorRef.detectChanges();
		this.dataSource.paginator = this.paginator;
		this.obs = this.dataSource.connect();
	}

	//getProductResponse method is used to get the response of all products.
	public getProductResponse(response) {
		let products = ((response.men.concat(response.women)).concat(response.gadgets)).concat(response.accessories);
	}

	/**
* productShowType method is used to select the show type of product.
*/
	productShowType(type) {
		this.showType = type;
		if (type == 'list') {
			document.getElementById('list').classList.add("active");
			document.getElementById('grid').classList.remove('active');
			this.productsList = new MatTableDataSource(this.productsGrid);
			setTimeout(() => {
				this.productsList.paginator = this.paginator;
				this.productsList.sort = this.sort;
			}, 0)


		}
		else {

			this.dataSource = new MatTableDataSource<Prod>(this.productsGrid);
			this.changeDetectorRef.detectChanges();
			this.dataSource.paginator = this.paginator;
			this.obs = this.dataSource.connect();

			document.getElementById('grid').classList.add("active");
			document.getElementById('list').classList.remove('active');
		}
	}

	/**
  * onEditProduct method is used to open the edit page and edit the product.
  */
	// onEditProduct(data) {
	// 	console.log(data.id_product);

	// 	this.router.navigate(['/admin-panel/product-edit', data.type, data.id_product]);
	// 	this.adminPanelService.editProductData = data;
	// }


	applyFilter(filterValue: string) {
		this.productsList.filter = filterValue.trim().toLowerCase();
		if (this.productsList.paginator) {
			this.productsList.paginator.firstPage();
		}
	}

	/**
* getDeleteResponse method is used to delete a product from the product list.
*/
	getDeleteResponse(data) {
		console.log(data.name_product);
		
		if (this.showType == 'grid') {
			let id_product = data.id_product;
			this.apiService.deleteProduct(id_product).subscribe(
				result => {
					if (result["result"] == 200) {
						window.location.reload();
					} else {
						this.toastyService.error(this.toastfaildeleteproduct);
					}
				},
				error => console.log(error)
			);
		} 
		// else if (this.showType == 'list') {
		// 	let id_product = this.productsGrid[i];
		// 	id_product = id_product["id_product"];
		// 	this.apiService.deleteProduct(id_product).subscribe(
		// 		result => {
		// 			if (result["result"] == 200) {
		// 				window.location.reload();
		// 			} else {
		// 				this.toastyService.error(this.toastfaildeleteproduct);
		// 			}
		// 		},
		// 		error => console.log(error)
		// 	);

		// }
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
		private apiService: ApiService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	transform(posts: Card[], find: string): Card[] {
		this.route.params.subscribe(res => {
			this.id = res.id;
		})
		// this.apiService.getProductStoresbyStoreid(this.id).subscribe(res => this.getProductData(res, posts, find, this.id));
		const id_store = localStorage.getItem('id-store');
		this.apiService.getProductsbyStoreid(id_store).subscribe(res => this.getProductData(res, posts, find, id_store));
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
			this.get_product.push({
				image: get_image,
				name_product: get_name_product,
				total_price: get_total_price,
				produc_code: get_produc_code,
				brand: get_brand,
				product_code: get_product_code,
				id_product: get_id_product
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


