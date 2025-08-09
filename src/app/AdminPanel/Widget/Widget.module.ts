import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';



// import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';;
import { FlexLayoutModule } from '@angular/flex-layout';
import { TitleComponent } from './TitleComponent/TitleComponent.component';
import { TopsideMenuComponent } from './Menu/TopsideMenu/TopsideMenu.component';
import { DeleteListDialogComponent } from './PopUp/DeleteListDialog/DeleteListDialog.component';
import { BuySellChartComponent } from './Charts/BuySellChart/BuySellChart.component';
import { SeeListDialogComponent } from './PopUp/SeeListDialog/SeeListDialog.component';
import { AddNewUserComponent } from './PopUp/AddNewUser/AddNewUser.component';
import { AdminProductValidComponent } from './PopUp/AdminProductValid/AdminProductValid.component';
import { TransactionComponent } from './PopUp/Transaction/Transaction.component';
import { TransferComponent } from './PopUp/Transfer/Transfer.component';
import { TransactionResponseComponent } from './PopUp/TransactionResponse/TransactionResponse.component';
import { InvoiceDetailComponent } from './PopUp/InvoiceDetail/InvoiceDetail.component';
import { TransactionDetailComponent } from './PopUp/TransactionDetail/TransactionDetail.component';
import { InvoiceDetailUsrComponent } from './PopUp/InvoiceDetailUsr/InvoiceDetailUsr.component';



import { StoreDetailViewComponent } from './PopUp/StoreDetailView/StoreDetailView.component';
import { DeleteLocationUserComponent} from './PopUp/DeleteLocationUser/DeleteLocationUser.component';
import { FailTransactionGatewayComponent} from './PopUp/FailTransactionGateway/FailTransactionGateway.component';
import { FailErrorTransactionGatewayComponent} from './PopUp/FailErrorTransactionGateway/FailErrorTransactionGateway.component';


import { LocationPredeterminedComponent } from './PopUp/LocationPredetermined/LocationPredetermined.component';
import { ShowCartDataComponent } from './PopUp/ShowCartData/ShowCartData.component';

import { HeaderUserProfileDropdownComponent } from './HeaderUserProfileDropdown/HeaderUserProfileDropdown.component';
import { RouterModule } from '@angular/router';

import { MaterialFileInputModule } from 'ngx-material-file-input';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
	declarations: [
		TitleComponent,
		TopsideMenuComponent,
		DeleteListDialogComponent,
		BuySellChartComponent,
		SeeListDialogComponent,
		AddNewUserComponent,
		HeaderUserProfileDropdownComponent,
		AdminProductValidComponent,
		TransactionComponent,
		TransferComponent,
		TransactionResponseComponent,
		InvoiceDetailComponent,
		TransactionDetailComponent,
		StoreDetailViewComponent,
		DeleteLocationUserComponent,
		FailTransactionGatewayComponent,
		FailErrorTransactionGatewayComponent,
		LocationPredeterminedComponent,
		ShowCartDataComponent,
		InvoiceDetailUsrComponent
	],
	imports: [
		CommonModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		FormsModule,
		// ChartsModule,
		MatIconModule,
		MatCardModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		PerfectScrollbarModule,
		TranslateModule,
		MatCheckboxModule,
		MatMenuModule,
		MatDialogModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatTableModule,  
		FlexLayoutModule,
		RouterModule,
		MatListModule,
		MatGridListModule,
		MaterialFileInputModule,
		SweetAlert2Module.forRoot(),
	],
	exports : [
		TitleComponent,
		TopsideMenuComponent,
		BuySellChartComponent,
		HeaderUserProfileDropdownComponent
	],
	entryComponents: [
      DeleteListDialogComponent,
      SeeListDialogComponent,
	  AddNewUserComponent,
	  AdminProductValidComponent,
	  TransactionComponent,
	  TransferComponent,
	  TransactionResponseComponent,
	  InvoiceDetailComponent,
	  TransactionDetailComponent,
	  StoreDetailViewComponent,
	  DeleteLocationUserComponent,
	  LocationPredeterminedComponent,
	  ShowCartDataComponent,
	  FailErrorTransactionGatewayComponent,
	  FailTransactionGatewayComponent,
	  InvoiceDetailUsrComponent
   ]
})
export class WidgetModule { }
