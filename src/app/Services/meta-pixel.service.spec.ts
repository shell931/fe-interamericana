import { MetaPixelService } from './meta-pixel.service';

describe('MetaPixelService', () => {
   let service: MetaPixelService;
   let calls: any[];

   beforeEach(() => {
      calls = [];
      window.fbq = function () {
         calls.push(Array.prototype.slice.call(arguments));
      };
      sessionStorage.clear();
      localStorage.removeItem('meta_purchase_sent');
      localStorage.removeItem('cart_item');
      service = new MetaPixelService();
   });

   afterEach(() => {
      delete window.fbq;
      sessionStorage.clear();
      localStorage.removeItem('meta_purchase_sent');
      localStorage.removeItem('cart_item');
   });

   it('does not send a second PageView on the first Angular navigation', () => {
      service.onRouteChange('/home', true);
      expect(calls.length).toBe(0);
   });

   it('tracks PageView on later route changes', () => {
      service.onRouteChange('/products/accessories/118', false);
      expect(calls[0][0]).toBe('track');
      expect(calls[0][1]).toBe('PageView');
   });

   it('tracks ViewContent with COP value', () => {
      service.trackViewContent({ id: 118, name: 'Escobilla', price: 25000 });
      expect(calls[0][1]).toBe('ViewContent');
      expect(calls[0][2].currency).toBe('COP');
      expect(calls[0][2].value).toBe(25000);
      expect(calls[0][2].content_ids).toEqual(['118']);
   });

   it('tracks AddToCart with quantity', () => {
      service.trackAddToCart({ id_product: 9, name: 'Rodamiento', price: 10000, quantity: 2 });
      expect(calls[0][1]).toBe('AddToCart');
      expect(calls[0][2].value).toBe(20000);
      expect(calls[0][2].currency).toBe('COP');
   });

   it('tracks InitiateCheckout once per checkout session', () => {
      localStorage.setItem('cart_item', JSON.stringify([{ id_product: 1, price: 5000, quantity: 1 }]));
      service.onRouteChange('/checkout', true);
      service.onRouteChange('/checkout/payment', false);
      const checkoutEvents = calls.filter((call) => call[1] === 'InitiateCheckout');
      expect(checkoutEvents.length).toBe(1);
      expect(checkoutEvents[0][2].currency).toBe('COP');
      expect(checkoutEvents[0][2].value).toBe(5000);
   });

   it('tracks Purchase after payment return and does not duplicate', () => {
      service.stagePurchase([{ id_product: 1, price: 80000, quantity: 1 }], 'REF-1');
      service.onRouteChange('/checkout/final-receipt', true);
      service.onRouteChange('/checkout/final-receipt', false);
      const purchases = calls.filter((call) => call[1] === 'Purchase');
      expect(purchases.length).toBe(1);
      expect(purchases[0][2].value).toBe(80000);
      expect(purchases[0][2].currency).toBe('COP');
      expect(purchases[0][3].eventID).toBe('REF-1');
   });

   it('does not track Purchase on a failed receipt', () => {
      service.stagePurchase([{ id_product: 1, price: 80000, quantity: 1 }], 'REF-2');
      service.onRouteChange('/checkout/final-receipt-fail', true);
      expect(calls.filter((call) => call[1] === 'Purchase').length).toBe(0);
   });

   it('tracks Purchase when production returns to order history', () => {
      service.stagePurchase([{ id_product: 3, price: 12000, quantity: 1 }], 'REF-3');
      service.onRouteChange('/account/order-history', true);
      const purchases = calls.filter((call) => call[1] === 'Purchase');
      expect(purchases.length).toBe(1);
      expect(purchases[0][2].currency).toBe('COP');
   });
});
