import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { element } from 'protractor';
import { EmbryoService } from '../../../Services/Embryo.service';


const { isArray } = Array;



@Component({
	selector: 'app-InvoiceAdm',
	templateUrl: './InvoiceAdm.component.html',
	styleUrls: ['./InvoiceAdm.component.scss']
})

export class InvoiceAdmComponent implements OnInit {


	popUpDeleteUserResponse: any;
	invoiceList: any[] = [];
	invDetailGrid: Invoice;


	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

	dataSource = new MatTableDataSource<any>(this.invoiceList);

	displayedColumns: string[] = ['action', 'action2', 'reference_invoice', 'created_at', 'name_state', 'number_identifier', 'paymentmethod', 'type_service', 'reference', 'total_price'];
	number_binnacles_inprocces: any;
	id_invoice: any;
	id_invoice_back: any;
	number_invoice: any;
	reference_invoice: any;
	datas: any;
	// binnacleSidenavOpen: boolean = false;

	constructor(
		// public service: AdminPanelServiceService,
		private apiService: ApiService,
		private changeDetectorRef: ChangeDetectorRef,
		public embryoService: EmbryoService,
	) { }

	ngOnInit() {
		const id_store = localStorage.getItem('id-store');
		this.apiService.ListInvoicesByStore(id_store).subscribe(res => this.getAllInvoiceData(res));
		this.id_invoice = localStorage.getItem('id_invoice_popup');
		this.embryoService.binnacleSidenavOpen = false;
	}


	getAllInvoiceData(response) {
		this.invoiceList = response;
		this.dataSource = new MatTableDataSource<any>(this.invoiceList);
		this.changeDetectorRef.detectChanges();
		this.dataSource.paginator = this.paginator;
		// this.obs = this.dataSource.connect();
		setTimeout(() => {
			this.dataSource.paginator = this.paginator;
		}, 0)
	}


	/**
  * onSeeDialog method is used to open a see dialog.
  */
	onSeeDialog(data) {
		this.apiService.getInvoiceDetail(data.id).subscribe(dataDetailInvoice => this.getInvoiceDetailData(dataDetailInvoice, data));
	}

	getBinnacles(data) {
		const id_store = localStorage.getItem('id-store');
		this.apiService.ListInvoicesByStore(id_store).subscribe(res => this.getAllInvoiceData(res));
		localStorage.removeItem("messajes");
		localStorage.removeItem("id_invoice_popup");
		localStorage.setItem('id_invoice_popup', data.id);

		let id_invoice = data.id;
		this.apiService.getBinnacle(id_invoice, 'st').subscribe(
			result => {				
				if (result.result == 200) {					
					let myJSONinvDetail = JSON.stringify(result.data);
					localStorage.setItem('messajes', myJSONinvDetail);
					this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
				} else {
					console.log("Null");
					this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
				}
			}
		);
	}

	getInvoiceDetailData(dataDetailInvoice, dataInvoice) {

		let myObj_invoice;
		myObj_invoice = {
			adress: dataInvoice.adress,
			created_at: dataInvoice.created_at,
			departament: dataInvoice.departament,
			email: dataInvoice.email,
			first_name_client: dataInvoice.first_name_client,
			id_store_id: dataInvoice.id_store_id,
			id: dataInvoice.id,
			name_client: dataInvoice.name_client,
			name_state: dataInvoice.name_state,
			name_store: dataInvoice.name_store,
			nameci: dataInvoice.nameci,
			number_identifier: dataInvoice.number_identifier,
			paymentmethod: dataInvoice.paymentmethod,
			phone: dataInvoice.phone,
			reference: dataInvoice.reference,
			reference_invoice: dataInvoice.reference_invoice,
			state_id: dataInvoice.state_id,
			total_price: dataInvoice.total_price,
			percentage_sale: dataInvoice.percentage_sale,
			val_percentage_sale: dataInvoice.val_percentage_sale,
			percentage_commision_payment: dataInvoice.percentage_commision_payment,
			val_percentage_commision_payment: dataInvoice.val_percentage_commision_payment,
			percentage_rete_ica: dataInvoice.percentage_rete_ica,
			val_percentage_rete_ica: dataInvoice.val_percentage_rete_ica,
			percentage_rete_fuente: dataInvoice.percentage_rete_fuente,
			val_percentage_rete_fuente: dataInvoice.val_percentage_rete_fuente,
			percentage_commision_tax: dataInvoice.percentage_commision_tax,
			val_percentage_commision_tax: dataInvoice.val_percentage_commision_tax,
			total_balance: dataInvoice.total_balance,
			transaction_id: dataInvoice.transaction_id,
			type_identifier: dataInvoice.type_identifier,
			user_id: dataInvoice.user_id,
			invoice_detail: dataDetailInvoice,
			num_aprob: dataInvoice.num_aprob,
			quot: dataInvoice.quot,
			brand: dataInvoice.brand,
			cod_reply: dataInvoice.cod_reply,
			messaje_reply: dataInvoice.messaje_reply,
			num_recibo: dataInvoice.num_recibo,
			type_service_id: dataInvoice.type_service_id,
			type_service: dataInvoice.type_service,
		};

		this.invDetailGrid = myObj_invoice;
		this.apiService.PopUpInvoiceDetail(this.invDetailGrid);
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}




}

