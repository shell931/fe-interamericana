import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

const CURRENCY = 'COP';

/**
 * Meta (Facebook) Pixel wrapper for the SPA.
 * - Loads fbevents.js only when a pixel id is configured (prod).
 * - Fires PageView on every Angular route change (SPA has no real page loads).
 * - Every call is a safe no-op when the pixel is disabled or blocked.
 */
@Injectable({ providedIn: 'root' })
export class MetaPixelService {
  private enabled = false;
  private lastViewContentId: string | null = null;

  constructor(private router: Router) {}

  init(): void {
    const pixelId: string = (environment as any).metaPixelId;
    if (this.enabled || !pixelId || typeof window === 'undefined') {
      return;
    }

    /* Official Meta base snippet, unrolled */
    if (!window.fbq) {
      const n: any = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      window.fbq = n;
      if (!window._fbq) { window._fbq = n; }
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }

    window.fbq('init', pixelId);
    this.enabled = true;

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.track('PageView'));
  }

  viewContent(product: any): void {
    const id = this.productId(product);
    if (!id || id === this.lastViewContentId) { return; }
    this.lastViewContentId = id;
    this.track('ViewContent', {
      content_ids: [id],
      content_name: product?.name,
      content_type: 'product',
      value: this.unitPrice(product),
      currency: CURRENCY,
    });
  }

  addToCart(item: any): void {
    const id = this.productId(item);
    if (!id) { return; }
    const quantity = Number(item?.quantity) || 1;
    this.track('AddToCart', {
      content_ids: [id],
      content_name: item?.name,
      content_type: 'product',
      contents: [{ id, quantity }],
      value: this.unitPrice(item) * quantity,
      currency: CURRENCY,
    });
  }

  initiateCheckout(cartItems: any[], total: number): void {
    const items = (cartItems || []).filter((p) => this.productId(p));
    if (!items.length) { return; }
    this.track('InitiateCheckout', {
      content_ids: items.map((p) => this.productId(p)),
      contents: items.map((p) => ({ id: this.productId(p), quantity: Number(p.quantity) || 1 })),
      content_type: 'product',
      num_items: items.reduce((acc, p) => acc + (Number(p.quantity) || 1), 0),
      value: Number(total) || 0,
      currency: CURRENCY,
    });
  }

  addPaymentInfo(total: number | string): void {
    this.track('AddPaymentInfo', { value: Number(total) || 0, currency: CURRENCY });
  }

  private track(event: string, params?: Record<string, any>): void {
    if (!this.enabled || !window.fbq) { return; }
    try {
      params ? window.fbq('track', event, params) : window.fbq('track', event);
    } catch {
      /* pixel blocked or failed: never break the store */
    }
  }

  /** Product id must match the `id` column of the Meta catalog feed. */
  private productId(p: any): string | null {
    const id = p?.id_product ?? p?.id;
    return id !== undefined && id !== null && id !== '' ? String(id) : null;
  }

  private unitPrice(p: any): number {
    const discount = Number(p?.discount_price);
    return discount > 0 ? discount : Number(p?.price) || 0;
  }
}
