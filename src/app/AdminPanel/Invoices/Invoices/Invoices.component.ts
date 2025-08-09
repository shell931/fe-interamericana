import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../../../Services/api.service';
import { Invoice } from '../../../Models/Invoice';
import { Binnacle } from '../../../Models/Binnacle';
import { EmbryoService } from '../../../Services/Embryo.service';

@Component({
   selector: 'app-invoices',
   templateUrl: './Invoices.component.html',
   styleUrls: ['./Invoices.component.scss']
})

export class InvoicesComponent implements OnInit {

   CheckedValid: any = true;
   CheckedValidFalse: any = false;

   popUpDeleteUserResponse: any;
   invoiceList: any[] = [];
   invDetailGrid: Invoice;
   BinnacleGrid: Binnacle;

   @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

   dataSource = new MatTableDataSource<any>(this.invoiceList);

   displayedColumns: string[] = ['action2', 'canceled', 'messaje', 'reference_invoice', 'created_at', 'name_store', 'join_name', 'service', 'name_state', 'ScoreValdation', 'number_identifier', 'reference', 'total_price', 'total_balance'];

   constructor(
      public service: AdminPanelServiceService,
      private apiService: ApiService,
      public embryoService: EmbryoService,
   ) { }

   ngOnInit() {
      this.addBodyClass();
      this.apiService.ListAllInvoices().subscribe(res => this.getAllInvoiceData(res));
   }


   addBodyClass() {

      window.addEventListener('load', function () {
         document.querySelector('body').classList.add("loaded")
      });

   }

   getAllInvoiceData(response) {
      console.log(response);

      this.invoiceList = response;
      this.dataSource = new MatTableDataSource<any>(this.invoiceList);
      setTimeout(() => {
         this.dataSource.paginator = this.paginator;
      }, 0)
   }


   /**
     * onSeeDialog method is used to open a see dialog.
     */
   onSeeDialog(data) {
      console.log(data.id);
      this.apiService.getInvoiceDetail(data.id).subscribe(dataDetailInvoice => this.getInvoiceDetailData(dataDetailInvoice, data));
   }
   getInvoiceDetailData(dataDetailInvoice, dataInvoice) {
      // console.log("entrando a detalle inv");      
      // console.log(dataDetailInvoice);
      // console.log(dataInvoice);

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
         transaction_id: dataInvoice.transaction_id,
         type_identifier: dataInvoice.type_identifier,
         user_id: dataInvoice.user_id,
         invoice_detail: dataDetailInvoice
      };

      // console.log(myObj_invoice);      
      this.invDetailGrid = myObj_invoice;
      // console.log(this.invDetailGrid);      
      this.apiService.PopUpInvoiceDetail(this.invDetailGrid);
   }


   //applyFilter function can be set which takes a data object and filter string and returns true if the data object is considered a match.
   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
         this.dataSource.paginator.firstPage();
      }
   }

   getBinnacles(data) {     
      localStorage.removeItem("messajes");             
      const id_store = localStorage.getItem('id-store');
      localStorage.removeItem("id_invoice_popup");
      localStorage.setItem('id_invoice_popup', data.id);
      // this.embryoService.binnacleSidenavOpen = !this.embryoService.binnacleSidenavOpen;
      let id_invoice = data.id
      this.apiService.getBinnacle(id_invoice, 'adm').subscribe(
         result => {            
            if (result.result == 200) {               
               let myJSONinvDetail = JSON.stringify(result.data);
               localStorage.setItem('messajes', myJSONinvDetail);
               this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
               this.apiService.ListAllInvoices().subscribe(res => this.getAllInvoiceData(res));
            } else {
               console.log("Null");
               this.embryoService.binnacleSidenavAdmOpen = !this.embryoService.binnacleSidenavAdmOpen;
            }
         }
      );
   }



}
