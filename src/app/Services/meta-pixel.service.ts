import { Injectable } from '@angular/core';

declare global {
   interface Window {
      fbq?: (...args: any[]) => void;
   }
}

export const META_PIXEL_ID = '1461117445867720';
export const META_PIXEL_CURRENCY = 'COP';

const PENDING_PURCHASE_KEY = 'meta_pending_purchase';
const SENT_PURCHASE_KEY = 'meta_purchase_sent';
const INITIATE_CHECKOUT_KEY = 'meta_initiate_checkout';

export interface MetaPixelContent {
   id: string;
   quantity: number;
   item_price: number;
}

export interface MetaPendingPurchase {
   value: number;
   currency: string;
   contents: MetaPixelContent[];
   content_ids: string[];
   content_type: string;
   num_items: number;
   eventID?: string;
}

@Injectable({
   providedIn: 'root'
})
export class MetaPixelService {

   onRouteChange(url: string, isInitialLoad: boolean): void {
      if (!isInitialLoad) {
         this.trackPageView();
      }
      this.maybeTrackInitiateCheckout(url);
      this.maybeTrackPendingPurchase(url);
   }

   trackPageView(): void {
      this.call('track', 'PageView');
   }

   trackViewContent(product: any): void {
      if (!product) {
         return;
      }
      const contentId = this.productId(product);
      const value = this.toNumber(product.price != null ? product.price : product.total_price);
      this.call('track', 'ViewContent', {
         content_ids: contentId ? [contentId] : [],
         content_name: product.name || product.name_product || '',
         content_type: 'product',
         content_category: product.category || product.type || '',
         value: value,
         currency: META_PIXEL_CURRENCY
      });
   }

   trackAddToCart(product: any): void {
      if (!product) {
         return;
      }
      const contentId = this.productId(product);
      const quantity = this.toNumber(product.quantity) || 1;
      const itemPrice = this.toNumber(product.price);
      this.call('track', 'AddToCart', {
         content_ids: contentId ? [contentId] : [],
         content_name: product.name || '',
         content_type: 'product',
         contents: [{
            id: contentId,
            quantity: quantity,
            item_price: itemPrice
         }],
         value: itemPrice * quantity,
         currency: META_PIXEL_CURRENCY
      });
   }

   trackInitiateCheckout(products: any[]): void {
      const payload = this.cartPayload(products);
      this.call('track', 'InitiateCheckout', {
         content_ids: payload.content_ids,
         contents: payload.contents,
         content_type: 'product',
         num_items: payload.num_items,
         value: payload.value,
         currency: META_PIXEL_CURRENCY
      });
   }

   stagePurchase(products: any[], eventID?: string): void {
      const payload = this.cartPayload(products);
      const pending: MetaPendingPurchase = {
         value: payload.value,
         currency: META_PIXEL_CURRENCY,
         contents: payload.contents,
         content_ids: payload.content_ids,
         content_type: 'product',
         num_items: payload.num_items,
         eventID: eventID ? String(eventID) : undefined
      };
      try {
         sessionStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(pending));
      } catch (e) {
         // Ignore storage errors (private mode, disabled storage).
      }
   }

   trackPurchaseNow(products: any[], eventID?: string): void {
      this.stagePurchase(products, eventID);
      this.flushPendingPurchase();
   }

   private maybeTrackInitiateCheckout(url: string): void {
      const path = this.normalizePath(url);
      if (this.isCheckoutStart(path)) {
         if (this.readSession(INITIATE_CHECKOUT_KEY)) {
            return;
         }
         let products = [];
         try {
            products = JSON.parse(localStorage.getItem('cart_item')) || [];
         } catch (e) {
            products = [];
         }
         this.trackInitiateCheckout(products);
         this.writeSession(INITIATE_CHECKOUT_KEY, '1');
         return;
      }
      if (!this.isCheckoutFlow(path)) {
         this.removeSession(INITIATE_CHECKOUT_KEY);
      }
   }

   private maybeTrackPendingPurchase(url: string): void {
      const path = this.normalizePath(url);
      if (path.indexOf('/checkout/final-receipt-fail') === 0) {
         this.removeSession(PENDING_PURCHASE_KEY);
         return;
      }
      const isSuccessReturn = path.indexOf('/checkout/final-receipt') === 0
         || path.indexOf('/account/order-history') === 0;
      if (!isSuccessReturn) {
         return;
      }
      if (this.hasFailedStatus(url)) {
         this.removeSession(PENDING_PURCHASE_KEY);
         return;
      }
      this.flushPendingPurchase();
   }

   private flushPendingPurchase(): void {
      const raw = this.readSession(PENDING_PURCHASE_KEY);
      if (!raw) {
         return;
      }
      let pending: MetaPendingPurchase;
      try {
         pending = JSON.parse(raw);
      } catch (e) {
         this.removeSession(PENDING_PURCHASE_KEY);
         return;
      }
      if (pending.eventID && this.wasPurchaseSent(pending.eventID)) {
         this.removeSession(PENDING_PURCHASE_KEY);
         return;
      }
      const params: any = {
         value: this.toNumber(pending.value),
         currency: pending.currency || META_PIXEL_CURRENCY,
         contents: pending.contents || [],
         content_ids: pending.content_ids || [],
         content_type: pending.content_type || 'product',
         num_items: this.toNumber(pending.num_items)
      };
      if (pending.eventID) {
         this.call('track', 'Purchase', params, { eventID: pending.eventID });
         this.markPurchaseSent(pending.eventID);
      } else {
         this.call('track', 'Purchase', params);
      }
      this.removeSession(PENDING_PURCHASE_KEY);
   }

   private cartPayload(products: any[]): {
      value: number;
      contents: MetaPixelContent[];
      content_ids: string[];
      num_items: number;
   } {
      const list = products || [];
      const contents: MetaPixelContent[] = list.map((product) => {
         const quantity = this.toNumber(product && product.quantity) || 1;
         const itemPrice = this.toNumber(product && product.price);
         return {
            id: this.productId(product),
            quantity: quantity,
            item_price: itemPrice
         };
      });
      const value = contents.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);
      const numItems = contents.reduce((sum, item) => sum + item.quantity, 0);
      return {
         value: value,
         contents: contents,
         content_ids: contents.map((item) => item.id).filter((id) => !!id),
         num_items: numItems
      };
   }

   private productId(product: any): string {
      if (!product) {
         return '';
      }
      const id = product.id_product || product.id || product.produc_code || product.product_code || '';
      return id === undefined || id === null ? '' : String(id);
   }

   private toNumber(value: any): number {
      const parsed = Number(value);
      return isFinite(parsed) ? parsed : 0;
   }

   private normalizePath(url: string): string {
      const path = (url || '').split('?')[0];
      return path.replace(/^\/interamericana/, '') || '/';
   }

   private isCheckoutStart(path: string): boolean {
      return path === '/checkout'
         || path === '/checkout/signin'
         || path === '/checkout/payment'
         || path.indexOf('/checkout/signin') === 0
         || path.indexOf('/checkout/payment') === 0;
   }

   private isCheckoutFlow(path: string): boolean {
      return this.isCheckoutStart(path);
   }

   private hasFailedStatus(url: string): boolean {
      const query = (url || '').split('?')[1] || '';
      return /(?:^|&)(?:status|result)=(?:failed|fail|rejected|error)(?:&|$)/i.test(query);
   }

   private wasPurchaseSent(eventID: string): boolean {
      const sent = this.readSentPurchases();
      return sent.indexOf(eventID) !== -1;
   }

   private markPurchaseSent(eventID: string): void {
      const sent = this.readSentPurchases();
      sent.push(eventID);
      try {
         localStorage.setItem(SENT_PURCHASE_KEY, JSON.stringify(sent.slice(-50)));
      } catch (e) {
         // Ignore storage errors.
      }
   }

   private readSentPurchases(): string[] {
      try {
         const raw = localStorage.getItem(SENT_PURCHASE_KEY);
         const parsed = raw ? JSON.parse(raw) : [];
         return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
         return [];
      }
   }

   private call(...args: any[]): void {
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
         window.fbq.apply(window, args);
      }
   }

   private readSession(key: string): string {
      try {
         return sessionStorage.getItem(key);
      } catch (e) {
         return null;
      }
   }

   private writeSession(key: string, value: string): void {
      try {
         sessionStorage.setItem(key, value);
      } catch (e) {
         // Ignore storage errors.
      }
   }

   private removeSession(key: string): void {
      try {
         sessionStorage.removeItem(key);
      } catch (e) {
         // Ignore storage errors.
      }
   }
}
