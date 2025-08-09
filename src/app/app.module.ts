import { BrowserModule} from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { RouterModule } from '@angular/router';
// import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
// import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ToastaModule } from 'ngx-toasta';
import { BidiModule } from '@angular/cdk/bidi';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { DeviceDetectorModule } from 'ngx-device-detector';
import { environment } from '../environments/environment';
import { AppRoutes } from './app-routing.module';
import { Routes } from '@angular/router';
import { GlobalModule } from './Global/Global.module';
import { TemplatesModule } from './Templates/Templates.module';
// import { MenuItems } from './Core/menu/menu-items/menu-items';
import { EmbryoService } from './Services/Embryo.service';
import { AppComponent } from './app.component';
import { MainComponent } from './Main/Main.component';
import { HeaderOneComponent } from './Layouts/Header/HeaderOne/HeaderOne.component';
// import { HeaderTwoComponent } from './Layouts/Header/HeaderTwo/HeaderTwo.component';
// import { HeaderThreeComponent } from './Layouts/Header/HeaderThree/HeaderThree.component';
import { FooterOneComponent } from './Layouts/Footer/FooterOne/FooterOne.component';
// import { FooterTwoComponent } from './Layouts/Footer/FooterTwo/FooterTwo.component';
import { MenuComponent } from './Layouts/Menu/Menu/Menu.component';
// import { HomeoneComponent } from './Pages/Home/HomeOne/HomeOne.component';
// import { HomeTwoComponent } from './Pages/Home/HomeTwo/HomeTwo.component';
// import { HomeThreeComponent } from './Pages/Home/HomeThree/HomeThree.component';
import { CartComponent } from './Pages/Cart/Cart.component';
// import { NotFoundComponent } from './Pages/NotFound/NotFound.component';
import { SideBarMenuComponent } from './Layouts/Menu/SidebarMenu/SidebarMenu.component';
import { PaymentDetailSideBarComponent } from './Layouts/PaymentDetailSideBar/PaymentDetailSideBar.component';
import { UbicationDetailSideBarComponent } from './Layouts/UbicationDetailSideBar/UbicationDetailSideBar.component';
import { BalanceDetailSideBarComponent } from './Layouts/BalanceDetailSideBar/BalanceDetailSideBar.component';
// import { BinnacleSideBarComponent } from './Layouts/BinnacleSideBar/BinnacleSideBar.component';
// import { FixedHeaderComponent } from './Layouts/Header/FixedHeader/FixedHeader.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AdminPanelModule } from './AdminPanel/admin-panel.module';
import { AuthModule } from './auth/auth.module';
import { CookieService } from 'ngx-cookie-service';
import { MainModule } from './main/main.module';
// import { HeaderOneModule } from './Layouts/Header/HeaderOne/HeaderOne.module';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

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
import { MatFormFieldModule } from '@angular/material/form-field';
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

//Services

import { BinnacleComponent } from './AdminPanel/Widget/PopUp/Binnacle/Binnacle.component';
import {LoadScriptsService} from "./load-scripts.service";

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './Services/loader.interceptor';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

/********** Custom option for ngx-translate ******/
export function createTranslateLoader(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const routes: Routes = [
   {path: 'admin-panel', pathMatch: 'full', redirectTo:'auth'}

 ];


@NgModule({
   declarations: [
      AppComponent,
      MainComponent,
      // HomeoneComponent,
      HeaderOneComponent,
      FooterOneComponent,
      MenuComponent,
      SideBarMenuComponent,
      CartComponent,
      // NotFoundComponent,
      PaymentDetailSideBarComponent,
      UbicationDetailSideBarComponent,
      BalanceDetailSideBarComponent,
      BinnacleComponent,
      // BinnacleSideBarComponent
      // HomeTwoComponent,
      // HeaderTwoComponent,
      // FooterTwoComponent,
      // HomeThreeComponent,
      // HeaderThreeComponent,
      // FixedHeaderComponent
   ],
   imports: [
      MainModule,
      BrowserModule.withServerTransition({appId: 'embryo-seo-pre'}),
      BrowserAnimationsModule,
      RouterModule.forRoot(AppRoutes, {onSameUrlNavigation: 'reload'}),
      GlobalModule,
      TemplatesModule,
      MatButtonModule,
      FlexLayoutModule,
      MatCardModule,
      MatMenuModule,
      MatToolbarModule,
      MatIconModule,
      MatInputModule,
      MatDatepickerModule,
      MatFormFieldModule,
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
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      // LoadingBarRouterModule,
      LoadingBarModule,

      // AngularFireModule.initializeApp(environment.firebase, 'embryo'),
      // AngularFirestoreModule,
      // AngularFireDatabaseModule,
      ToastaModule.forRoot(),
      BidiModule,
      TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
         }
      }),
      // SlickCarouselModule,
      // PerfectScrollbarModule,
      // DeviceDetectorModule.forRoot(),
      AdminPanelModule,
      AuthModule,
      // HeaderOneModule,
      // NgxMatSelectSearchModule,
      MatAutocompleteModule,
      // SweetAlert2Module.forRoot(),
     NgxMaskModule.forRoot(),
  ],
   providers: [
      // MenuItems,
      EmbryoService,
      CookieService,
      LoadScriptsService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoaderInterceptor,
        multi: true
      }
      // {
      //   //  provide: PERFECT_SCROLLBAR_CONFIG,
      //   //  useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      // }
   ],
   exports : [
      RouterModule,
      ToastaModule
   ],

   bootstrap: [AppComponent]
})
export class AppModule { }
