import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';


export interface Group {
    id: string;
    name: string;
}

export interface isActive {
    active: boolean;
    desc: string;
}


@Component({
    selector: 'app-UsersEdit',
    templateUrl: './UsersEdit.component.html',
    styleUrls: ['./UsersEdit.component.scss']
})

export class UsersEditComponent implements OnInit {

    userForm: FormGroup;
    emailPattern: any = /\S+@\S+\.\S+/;
    groups: Group[] = [];
    status: isActive[] = [];
    grouplist: Group[] = [];
    group$: Observable<Group[]>;
    selectedGroup: any;
    public groupFilterCtrl: FormControl = new FormControl();

    isActive: isActive[] = [];
    isActivelist: isActive[] = [];
    isactive$: Observable<isActive[]>;
    selectedisActive: any;
    public isActiveFilterCtrl: FormControl = new FormControl();

    id: any;
    selectedValue;
    selectedValueisActive;

    constructor(
        public service: AdminPanelServiceService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private formGroup: FormBuilder,
        private sanitizer: DomSanitizer

    ) { }

    ngOnInit() {

        this.route.params.subscribe(res => {
            this.id = res.id;
        })

        this.userForm = this.formGroup.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            groupCtrl: ['', [Validators.required]],
            isActive: ['', [Validators.required]],
        });

        this.apiService.getUserById(this.id).subscribe(res => {
            this.getDataUser(res, this.id)
        }, error => console.log(error));

    }


    getDataUser(response, id_user) {


        console.log(response.data.group_id);

        this.userForm.get('first_name').setValue(response.data.first_name)
        this.userForm.get('last_name').setValue(response.data.last_name)
        this.userForm.get('email').setValue(response.data.username)

        // START ANGULAR MAT SEARCH GROPUS     
        this.groups = [];
        this.apiService.getGroupsList().subscribe(
            (data: Group[]) => {
                this.grouplist = data;
                for (var i in this.grouplist) {
                    let get_id = this.grouplist[i]['id'];
                    let get_name = this.grouplist[i]['name'];
                    this.groups.push({ name: get_name, id: get_id });
                }
                this.setValueGroupSelect(this.groups, response.data.group_id);
                this.group$ = this.getGroups("", this.groups);
            },
            error => console.log(error)
        );
        // END ANGULAR MAT SEARCH GROPUS

        // START ANGULAR MAT SEARCH STATUS     
        this.status = [
            {
                active: false,
                desc: "desactivo"
            },
            {
                active: true,
                desc: "activo"
            }
        ];
        this.setValueStatusSelect(this.status, response.data.is_active);
        this.isactive$ = this.getState("", this.status);
    }


    setValueGroupSelect(groups, group_id) {
        let count;
        for (var i = 0; i < groups.length; i++) {
            groups[i].id;
            if (groups[i].id == group_id) {
                count = i;
            }
        }
        this.selectedValue = groups[count].id;
    }


    setValueStatusSelect(status, is_active) {
        let count;
        for (var i = 0; i < status.length; i++) {
            status[i].active;
            if (status[i].active == is_active) {
                count = i;
            }
        }
        this.selectedValueisActive = status[count].active;
    }


    getGroups(term: string = null, algo): Observable<Group[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    getState(term: string = null, algo): Observable<isActive[]> {
        let items = algo;
        if (term) {
            items = items.filter(x => x.state.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
        }
        return of(items).pipe(delay(500));
    }

    // Function to change order status, new status is sent 
    // @param  {Number} num1 The first number
    // @param  {Number} num2 The second number
    // @return {Number}      The total of the two numbers
    submitEditProfileInfo() {

        if (this.userForm.valid) {                                    
            
            let myObj;
            let values = this.userForm.value;            
            myObj ={
                "group_id": values.groupCtrl,
                "first_name": values.first_name,
                "last_name": values.last_name,
                "is_active": values.isActive,
                "email":values.email
            };

            console.log(myObj);                                
            this.apiService.UpdateUser(myObj, this.id).subscribe(
                result => {
                    window.location.reload();
                },                                
            );

        } else {
            for (let i in this.userForm.controls) {
                this.userForm.controls[i].markAsTouched();
            }
        }

    }


}
