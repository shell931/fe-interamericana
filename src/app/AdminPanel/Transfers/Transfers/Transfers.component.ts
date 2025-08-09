import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ApiService } from '../../../Services/api.service';
import { Transfer } from '../../../Models/Transfer';
import { EmbryoService } from '../../../Services/Embryo.service';



@Component({
	selector: 'Transfers',
	templateUrl: './Transfers.component.html',
	styleUrls: ['./Transfers.component.scss']
})

export class TransfersComponent implements OnInit {


	transferList: any[] = [];
	adminTransferList: any[] = [];
	get_pr: any[] = [];
	transferGrid: Transfer;
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.adminTransferList);
	displayedColumns: string[] = ['action', 'detail','reference', 'state', 'store','created_at','responsible' , 'val_transfer'];

	constructor(
		private apiService: ApiService,
		public service: AdminPanelServiceService,
		public embryoService: EmbryoService,
	) { }

	ngOnInit() {						
		this.addBodyClass();
		this.apiService.GetAllTransfers().subscribe(res => this.getAllTransfersData(res));		
	}


	addBodyClass() {
		window.addEventListener('load', function () {
			document.querySelector('body').classList.add("loaded")
		});
	}

	getAllTransfersData(response) {	
		console.log(response);
					
		this.transferList = response.data;
		this.dataSource = new MatTableDataSource<any>(this.transferList);
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}


	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}


	onSeeDialog(data) {				
		this.getTransferData(data);		
	}

	getTransferData(response) {				
		let myObj_transfer = {
			id: response.id,
			reference: response.reference,
			account_number: response.account_number,
			responsible: response.responsible,
			val_request: response.val_request,
			val_transfer: response.val_transfer,
			bank: response.bank,
			state: response.state,
			store: response.store,
			typeaccount: response.typeaccount,
			created_at: response.created_at,
			state_id: response.state_id,
			
		};
		this.transferGrid = myObj_transfer;
		this.apiService.PopUpAdminTransfers(this.transferGrid);
	}

	DetailTransfer(data){
		localStorage.removeItem("id_transfer");
		localStorage.setItem('id_transfer', data.id);
		localStorage.removeItem("refer_transfer");
		localStorage.setItem('refer_transfer', data.reference);
		this.apiService.GetTransfersByIdPanelAdmin(data.id).subscribe(
			response => {
				let myJSONtrsDetail = JSON.stringify(response.data);
				localStorage.removeItem("detail_transfer");
				localStorage.setItem('detail_transfer', myJSONtrsDetail);				
				localStorage.removeItem("val_request");
				localStorage.setItem('val_request', response.val_request);				
				localStorage.removeItem("val_transfer");
				localStorage.setItem('val_transfer', response.val_transfer);	
				this.embryoService.TransfersDetailAdmSidebarOpen = !this.embryoService.TransfersDetailAdmSidebarOpen;
			},
			error => console.log(error)
		);
		
	}


}
