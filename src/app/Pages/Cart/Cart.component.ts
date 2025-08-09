import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';

import { EmbryoService } from '../../Services/Embryo.service';

@Component({
    selector: 'embryo-Cart',
    templateUrl: './Cart.component.html',
    styleUrls: ['./Cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewChecked, AfterViewInit {

    products: any;
    quantityArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    popupResponse: any;

    constructor(public embryoService: EmbryoService,
        private router: Router,
        private loadingBar: LoadingBarService,
        private cdRef: ChangeDetectorRef) {

        // Suscribirse a eventos de navegación
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            if (event.url === '/cart' || event.urlAfterRedirects === '/cart') {
                this.forceScrollToTop();
            }
        });
    }

    ngOnInit() {
        this.forceScrollToTop();
    }

    ngAfterViewInit() {
        this.forceScrollToTop();
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

    // Método para forzar el scroll al inicio
    private forceScrollToTop(): void {
        // Método 1: Scroll inmediato
        window.scrollTo(0, 0);

        // Método 2: Scroll del body y documentElement
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Método 3: Scroll con delay para asegurar que funcione
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 100);

        // Método 4: Scroll adicional con más delay
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 300);

        // Método 5: Scroll del elemento específico del carrito
        setTimeout(() => {
            const cartPage = document.querySelector('.cart-page');
            if (cartPage) {
                cartPage.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        }, 200);
    }

    public removeProduct(value: any) {
        let message = "Are you sure you want to delete this product?";
        this.embryoService.confirmationPopup(message).
            subscribe(res => { this.popupResponse = res },
                err => console.log(err),
                () => this.getPopupResponse(this.popupResponse, value)
            );
    }

    public getPopupResponse(response, value) {
        if (response) {
            this.embryoService.removeLocalCartProduct(value);
            // Hacer scroll al inicio después de eliminar un producto
            setTimeout(() => {
                this.forceScrollToTop();
            }, 600); // Esperar a que termine la animación del toast
        }
    }

    public calculateProductSinglePrice(product, value: any) {
        let price = 0;
        product.quantity = value;
        price = product.price * value;
        return price;
    }


    public calculateTotalPrice() {
        let subtotal = 0;
        if (this.embryoService.localStorageCartProducts && this.embryoService.localStorageCartProducts.length > 0) {
            for (let product of this.embryoService.localStorageCartProducts) {
                subtotal += (product.price * product.quantity);
            }
            return subtotal;
        }
        return subtotal;

    }

    public getTotalPrice() {
        let total = 0;
        if (this.embryoService.localStorageCartProducts && this.embryoService.localStorageCartProducts.length > 0) {
            for (let product of this.embryoService.localStorageCartProducts) {
                total += (product.price * product.quantity);
            }
            // total += (this.embryoService.shipping+this.embryoService.tax);
            // return total;
        }

        return total;

    }

    public updateLocalCartProduct() {
        this.embryoService.updateAllLocalCartProduct(this.embryoService.localStorageCartProducts);
        this.router.navigate(['/checkout']).then(() => {
            window.location.reload();
        });
    }

    public getQuantityValue(product) {


        // return product.canti

        if (product.quantity) {
            return product.quantity
        } else {
            return 1;
        }
    }

    public increment(product) {
        console.log("entrandoo....");
        if (!product.quantity) product.quantity = 1;
        if (product.quantity < 10) {
            product.quantity++;
            this.embryoService.updateAllLocalCartProduct(this.embryoService.localStorageCartProducts);
        }
    }

    public decrement(product) {
        console.log("entrandoo....");

        if (!product.quantity) product.quantity = 1;
        if (product.quantity > 1) {
            product.quantity--;
            this.embryoService.updateAllLocalCartProduct(this.embryoService.localStorageCartProducts);
        }
    }
}
