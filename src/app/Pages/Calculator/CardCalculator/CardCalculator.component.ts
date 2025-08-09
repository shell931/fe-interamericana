import {Component, Input, OnInit} from '@angular/core';

export interface CalculatorCardItem {
  text: string;
  value: number;
}

@Component({
  selector: 'app-card-calculator',
  templateUrl: './CardCalculator.component.html',
  styleUrls: ['./CardCalculator.component.css']
})
export class CardCalculatorComponent implements OnInit {

  @Input() title: string;

  @Input() items: Array<CalculatorCardItem> = [];

  @Input() footer: CalculatorCardItem;

  constructor() { }

  ngOnInit(): void {
  }

}
