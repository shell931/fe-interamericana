import {Component, OnInit} from '@angular/core';
import {Calculator} from '../../../Models/Calculator';
import {CalculatorCardItem} from '../CardCalculator/CardCalculator.component';
import {CalculatorService} from '../../../Services/calculator.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-calculator',
  templateUrl: './Calculator.component.html',
  styleUrls: ['./Calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public calculateData: Calculator;
  public itemsKompralo: Array<CalculatorCardItem> = [];
  public itemsWithHoldings: Array<CalculatorCardItem> = [];
  public footerCommissions: CalculatorCardItem;
  public footerWithHoldings: CalculatorCardItem;
  public form: FormGroup;
  public calculatorTypeId: number;

  constructor(
    private calculatorService: CalculatorService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(async data => {
      this.calculatorTypeId = data.calculatorTypeId;
      await this.initValues();
    });
  }

  private async initValues(): Promise<any> {
    this.form = new FormGroup({
      amount: new FormControl(0, Validators.required),
      vatPercentage: new FormControl(0)
    });

    this.calculateData = await this.calculatorService.calculate(0, 0, this.calculatorTypeId);

    this.footerCommissions = {text: 'Total comisión Kómpralo', value: 0};
    this.footerWithHoldings = {text: 'Total Retenciones', value: 0};

    this.itemsKompralo = [
      {text: 'Comisión plataforma de pago ' + this.calculateData.perPaymentPlatformCommission, value: 0},
      {text: 'IVA comisión', value: 0},
      {text: 'Comisión Marketplace ' + this.calculateData.perMarketPlaceCommission, value: 0},
      {text: 'IVA Comisión', value: 0},
    ];

    this.itemsWithHoldings = [
      {text: 'Retención de renta', value: 0},
      {text: 'Retención ICA', value: 0},
      {text: 'Retención IVA', value: 0},
    ];
  }

  public async calculate(): Promise<any> {
    this.calculateData = await this.calculatorService.calculate(this.form.value.amount, this.form.value.vatPercentage, this.calculatorTypeId);
    this.footerCommissions = {text: 'Total comisión Kómpralo', value: this.calculateData.totalCommission};
    this.footerWithHoldings = {text: 'Total Retenciones', value: this.calculateData.totalWithholding};

    this.itemsKompralo = [
      {text: 'Comisión plataforma de pago ' + this.calculateData.perPaymentPlatformCommission, value: this.calculateData.paymentPlatformCommission},
      {text: 'IVA comisión', value: this.calculateData.vatCommission},
      {text: 'Comisión Marketplace ' + this.calculateData.perMarketPlaceCommission, value: this.calculateData.marketPlaceCommission},
      {text: 'IVA Comisión', value: this.calculateData.vatMarketPlaceCommission},
    ];

    this.itemsWithHoldings = [
      {text: 'Retención de renta', value: this.calculateData.rentWithholding},
      {text: 'Retención ICA', value: this.calculateData.icaWithholding},
      {text: 'Retención IVA', value: this.calculateData.vatWithholding},
    ];
  }

}
