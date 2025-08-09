import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes} from '@angular/router';

import { MainComponent } from './Main/Main.component';
// import { HomeoneComponent } from './Pages/Home/HomeOne/HomeOne.component';
// import { HomeTwoComponent } from './Pages/Home/HomeTwo/HomeTwo.component';
// import { HomeThreeComponent } from './Pages/Home/HomeThree/HomeThree.component';
import { CartComponent } from './Pages/Cart/Cart.component';
// import { NotFoundComponent } from './Pages/NotFound/NotFound.component';
import { StoreFrontModule } from './Pages/StoreFront/StoreFront.module';


export const AppRoutes : Routes = [
   {
      path : '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
   {
      path : '',
      component : MainComponent,
      children: [
         {
            // path : 'home',
            // component : HomeoneComponent

            path: 'home',loadChildren: ()=>
            import('./Pages/Products/Products.module').then (m => m.ProductsModule)
         },

         {
            path: 'storefront',loadChildren: ()=>
            import('./Pages/StoreFront/StoreFront.module').then (m => m.StoreFrontModule)
         },

         {
            path: 'storelist',loadChildren: ()=>
            import('./Pages/StoreList/StoreList.module').then (m => m.StoreListModule)
         },

         {
            path: 'products',loadChildren: ()=>
            import('./Pages/Products/Products.module').then (m => m.ProductsModule)
         },
         {
            path: 'search',loadChildren: ()=>
            import('./Pages/Search/Search.module').then (m => m.SearchModule)
         },
         {

            path: 'sell',loadChildren: ()=>
            import('./Pages/Sell/Sell.module').then (m => m.SellModule)
         },
         {
            path: 'terms_conditions',loadChildren: ()=>
            import('./Pages/TermsConditions/TermsConditions.module').then (m => m.TermsConditionsModule)
         },
         {
            path: 'data_protection',loadChildren: ()=>
            import('./Pages/DataProtection/DataProtection.module').then (m => m.DataProtectionModule)
         },
         {
            path: 'help_pqr',loadChildren: ()=>
            import('./Pages/HelpPqr/HelpPqr.module').then (m => m.HelpPqrModule)
         },
         {
            path: 'payment_information',loadChildren: ()=>
            import('./Pages/PaymentInformation/PaymentInformation.module').then (m => m.PaymentInformationModule)
         },{
            path: 'assisted_buy',loadChildren: ()=>
            import('./Pages/AssistedBuy/AssistedBuy.module').then (m => m.AssistedBuyModule)
         },

         {
            path: 'refreshpageafterwelcome',loadChildren: ()=>
            import('./Pages/RefreshPageAfterWelcome/RefreshPageAfterWelcome.module').then (m => m.RefreshPageAfterWelcomeModule)
         },
         {
            path: 'calculator', loadChildren: () =>
            import('./Pages/Calculator/Calculator.module').then (m => m.CalculatorModule),
            data: {calculatorTypeId: 1}
         },
         {
            path: 'calculator2', loadChildren: () =>
            import('./Pages/Calculator/Calculator.module').then (m => m.CalculatorModule),
            data: {calculatorTypeId: 2}
         },
         {
            path: 'cart',
            component: CartComponent
         },
        //  {
        //   path: 'not-found',
        //   component: NotFoundComponent
        //  },
         {
            path: 'session',loadChildren: ()=>
            import('./Pages/Session/Session.module').then (m => m.SessionModule)
         },
         {
            path: 'checkout',loadChildren: ()=>
            import('./Pages/Checkout/Checkout.module').then (m => m.CheckoutModule)
         },
        //  {
        //     path: '',loadChildren: ()=>
        //     import('./Pages/About/About.module').then( m=> m.AboutModule)
        //  },
        //  {
        //     path: 'blogs',loadChildren: ()=>
        //     import('./Pages/Blogs/Blogs.module').then (m => m.BlogsModule)
        //  },
         {
            path: 'account',loadChildren: ()=>
            import('./Pages/UserAccount/UserAccount.module').then (m => m.UserAccountModule)
         }
      ]
   },
   {
      path: '**',
      redirectTo: 'not-found'
   }
]
