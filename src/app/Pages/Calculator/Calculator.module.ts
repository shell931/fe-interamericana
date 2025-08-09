import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CalculatorRoutes} from './Calculator.routing';
import {CalculatorComponent} from './Calculator/Calculator.component';
import {RouterModule} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import { CardCalculatorComponent } from './CardCalculator/CardCalculator.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';


@NgModule({
  declarations: [
    CalculatorComponent,
    CardCalculatorComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(CalculatorRoutes),
        MatCardModule,
        MatProgressSpinnerModule,
        FlexModule,
        MatButtonModule,
        ReactiveFormsModule,
        NgxMaskModule,
    ]
})
export class CalculatorModule {
}
