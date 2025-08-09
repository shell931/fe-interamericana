import { ApiService } from '../Services/api.service';


import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
// import { VERSION } from '@angular/material';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


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
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    authForm = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    registerMode = false;
    public show: boolean = false;

    toastfaildeleteproduct: ToastOptions = {
        title: "Fallo eliminacion",
        msg: "Fallo eliminación del producto o servicio contacte con el administrador!",
        showClose: true,
        timeout: 8000,
        theme: "material"
    };

    constructor(
        private apiService: ApiService,
        private cookieService: CookieService,
        private router: Router,
        public formBuilder: FormBuilder,
        private toastyService: ToastaService,
    ) { }

    ngOnInit() {

        this.addBodyClass();
        const mrToken = this.cookieService.get('mr-token');
        if (mrToken) {
            this.router.navigate(['/admin-panel']);
        }

        this.authForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],

        });
    }


    addBodyClass() {
 
        window.addEventListener('load',function(){
           document.querySelector('body').classList.add("loaded")  
         });
 
      }

    saveForm() {
        if (this.authForm.valid) {
            if (!this.registerMode) {
                this.loginUser();                                                
            } else {
                this.apiService.registerUser(this.authForm.value).subscribe(
                    result => {
                        // console.log(result["status"]);
                        this.loginUser();
                    },
                    // error => console.log(error)
                );
            }
        } else {
            for (let i in this.authForm.controls) {
                this.authForm.controls[i].markAsTouched();
            }
        }

    }

    loginUser() {
        this.show = false;
        this.apiService.loginUser(this.authForm.value).subscribe(
            (result: TokenObj) => {
                this.show = false;
                localStorage.setItem('mr-token', result.token);
                localStorage.setItem('id-store', result.id_store);
                localStorage.setItem('id-user', result.user_id);
                localStorage.setItem('personal_name', result.personal_name);
                localStorage.setItem('user_email', result.user_email);
                if(result.type_user == '2'){
                    localStorage.setItem('mr-token-front', result.token);
                    localStorage.setItem('id_type_user', result.type_user);
                    localStorage.setItem('id_user_front', result.user_id);
                    localStorage.setItem('personal_name', result.personal_name);                  
                    localStorage.setItem('user_email', result.user_email);
                }                   

                this.router.navigate(['/admin-panel']);
            },
            error => {
                
                this.show = true;
                console.log(error)
            }
        );
    }



}
