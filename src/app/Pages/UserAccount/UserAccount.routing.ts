import { Routes } from '@angular/router';

import { AccountComponent } from './Account/Account.component';
import { ProfileComponent } from './Profile/Profile.component';
import { EditProfileComponent } from './EditProfile/EditProfile.component';
import { CardsComponent } from './Cards/Cards.component';
import { AddressComponent } from './Address/Address.component';
import { AddressEditComponent } from './AddressEdit/AddressEdit.component';
import { AddressCreateComponent } from './AddressCreate/AddressCreate.component';
import { StoreAdmComponent } from './StoreAdm/StoreAdm.component';
import { StoreAdmEditComponent } from './StoreAdmEdit/StoreAdmEdit.component';
import { ProductsAdm } from './ProductsAdm/ProductsAdm.component';
import { ProductsCreateAdmComponent } from './ProductsCreateAdm/ProductsCreateAdm.component';
import { ProductEditAdmComponent } from './ProductEditAdm/ProductEditAdm.component';
import { InvoiceAdmComponent } from './InvoiceAdm/InvoiceAdm.component';
import { InvoiceAdmDetailComponent } from './InvoiceAdmDetail/InvoiceAdmDetail.component';


import { TransfersComponent } from './Transfers/Transfers.component';
import { TransfersViewComponent } from './TransfersView/TransfersView.component';

import { AssistedSellingComponent } from './AssistedSelling/AssistedSelling.component';

import { BalanceStatusComponent } from './BalanceStatus/BalanceStatus.component';
import { BalanceResponseComponent } from './BalanceResponse/BalanceResponse.component';


import { OrderHistoryComponent } from './OrderHistory/OrderHistory.component';
import { GridProductComponent } from './GridProduct/GridProduct.component';

export const UserAccountRoutes : Routes = [
   {
      path : '',
      component : AccountComponent,
      children: [ 
         {
            path: 'profile',
            component: ProfileComponent
         },
         { 
            path: 'cards', 
            component: CardsComponent 
         },
         { 
            path: 'address', 
            component: AddressComponent 
         },

         { 
            path: 'product_adm', 
            component: ProductsAdm 
         },

         { 
            path: 'invoice_adm', 
            component: InvoiceAdmComponent 
         },
         { 
            path: 'invoice_adm/detail/:id', 
            component: InvoiceAdmDetailComponent 
         },
         
         { 
            path: 'transfers_view', 
            component: TransfersComponent 
         },

         { 
            path: 'transfers_view/view/:id', 
            component: TransfersViewComponent 
         },

         { 
            path: 'assisted_selling', 
            component: AssistedSellingComponent 
         },

      
         { 
            path: 'balance_status', 
            component: BalanceStatusComponent 
         },
         { 
            path: 'balance_response', 
            component: BalanceResponseComponent 
         },
         
         { 
            path: 'product_create', 
            component: ProductsCreateAdmComponent 
         },

         { 
            path: 'product_adm/edit/:id_product', 
            component: ProductEditAdmComponent 
         },
         
         { 
            path: 'store_adm', 
            component: StoreAdmComponent 
         },

         { 
            path: 'store_adm/edit/:id_store', 
            component: StoreAdmEditComponent 
         },

         { 
            path: 'address/edit/:id', 
            component: AddressEditComponent 
         },
         { 
            path: 'address/create', 
            component: AddressCreateComponent 
         },
         
         { 
            path: 'order-history', 
            component: OrderHistoryComponent 
         },
         {
            path: 'profile/edit',
            component: EditProfileComponent
         },
         {
            path: 'grid-product',
            component: GridProductComponent
         }
      ]
   }
]