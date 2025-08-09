// libraries
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-SellResponse',
    templateUrl: './SellResponse.component.html',
    styleUrls: ['./SellResponse.component.scss']
})

export class SellResponseComponent implements OnInit {



    constructor(private route: ActivatedRoute,
    ) { }

    ngOnInit() {        
    }

}
