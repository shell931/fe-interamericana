import { Component, OnInit } from '@angular/core';
import { AdminMenuItems } from '../../Core/Menu/MenuItems/MenuItems';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Menu, ChildrenItems } from '../../../Models/Menus';
import { ApiService } from '../../../Services/api.service';

@Component({
	selector: 'app-menu-list-items',
	templateUrl: './MenuListItems.component.html',
	styleUrls: ['./MenuListItems.component.scss']
})

export class MenuListItemsComponent implements OnInit {

	menulist: Menu[] = [];
	get_menu: Menu[] = [];
	constructor(public menuItems: AdminMenuItems,
		private apiService: ApiService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public translate: TranslateService) { }

	ngOnInit() {		
		this.get_menu = [];
		this.apiService.getMenus().subscribe(
			(data: Menu[]) => {
				this.menulist = data;
				for (var i in this.menulist) {
					let get_state = this.menulist[i]['route_menu'];
					let get_name = this.menulist[i]['name_menu'];
					let get_type = "link";
					let get_icon = this.menulist[i]['icon_menu'];
					this.get_menu.push({state:get_state,name:get_name,type:get_type,icon:get_icon});
				}
			},
			error => console.log(error)
		);
		
	}
}
