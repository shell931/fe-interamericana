import { NgModule }       from '@angular/core'; 
import { RouterModule }   from '@angular/router';
import { CommonModule }   from '@angular/common';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';

import { GlobalModule } from '../Global/Global.module';
// import { ProductGridComponent, DialogContentProductDiferentStore } from './Grid/ProductGrid/ProductGrid.component';
// import { ProductStoreGridComponent } from './Grid/ProductStoreGrid/ProductStoreGrid.component';
// import { Grid3Component } from './Grid/Grid3/Grid3.component';
// import { ReviewComponent } from './Review/Review.component';
import { ShopDetailsComponent, DialogContentProductDiferentStoreDetail } from './ShopDetails/ShopDetails.component';
import { BarRatingModule } from "ngx-bar-rating";
@NgModule({
   bootstrap: [
      // ProductGridComponent,
      // ProductStoreGridComponent
	  ],
   imports: [
      BarRatingModule,
      CommonModule,
      RouterModule,
      MatButtonModule, 
      FlexLayoutModule,
      MatCardModule, 
      MatMenuModule, 
      MatToolbarModule, 
      MatIconModule, 
      MatInputModule, 
      MatDatepickerModule, 
      MatNativeDateModule, 
      MatProgressSpinnerModule,
      MatTableModule, 
      MatExpansionModule, 
      MatSelectModule, 
      MatSnackBarModule, 
      MatTooltipModule, 
      MatChipsModule, 
      MatListModule, 
      MatSidenavModule, 
      MatTabsModule, 
      MatProgressBarModule,
      MatCheckboxModule,
      MatSliderModule,
      MatRadioModule,
      MatDialogModule,
      MatGridListModule,
      GlobalModule,
      NgSelectModule,
      FormsModule
   ],
   declarations: [
      // ProductGridComponent,
      // DialogContentProductDiferentStore,
      DialogContentProductDiferentStoreDetail,
      // Grid3Component,
      // ReviewComponent,
      ShopDetailsComponent,
      // ProductStoreGridComponent
   ],
   // entryComponents: [DialogContentProductDiferentStore, DialogContentProductDiferentStoreDetail],
   exports: [
      // ProductGridComponent,
      // DialogContentProductDiferentStore,
      DialogContentProductDiferentStoreDetail,
      // Grid3Component,
      // ReviewComponent,
      ShopDetailsComponent,
      MatPaginatorModule, 
      // ProductStoreGridComponent
   ]
})
export class TemplatesModule {}
