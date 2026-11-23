import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { WhatsappOrderService } from '../../../Services/whatsapp-order.service';
import { MetaPixelService } from '../../../Services/meta-pixel.service';
// import { MenuItems } from '../../../Core/menu/menu-items/menu-items';

@Component({
  selector: 'FooterOne',
  templateUrl: './FooterOne.component.html',
  styleUrls: ['./FooterOne.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ]
})
export class FooterOneComponent implements OnInit {

   readonly whatsappContactUrl: string;

   constructor(
    //  public menuItems : MenuItems,
               public translate: TranslateService,
               whatsappOrder: WhatsappOrderService,
               private metaPixel: MetaPixelService) {
      this.whatsappContactUrl = whatsappOrder.contactUrl();
   }

   onWhatsappContact() {
      this.metaPixel.contact();
   }

   ngOnInit() {
    this.gotoTop();
    
   }

   gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
 

}

