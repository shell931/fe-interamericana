import { Injectable } from '@angular/core';
import { SALES_CHANNEL } from '../Core/sales-channel.config';

const SENT_ORDER_KEY = 'last_whatsapp_order';
const SENT_ORDER_TTL_MS = 48 * 60 * 60 * 1000;

export interface OrderLine {
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
}

/** Builds wa.me links: the cart order message and the generic contact one. */
@Injectable({ providedIn: 'root' })
export class WhatsappOrderService {

  toOrderLines(cartItems: any[]): OrderLine[] {
    return (cartItems || []).map((p) => ({
      name: String(p?.name ?? '').trim(),
      code: String(p?.produc_code ?? p?.product_code ?? '').trim() || undefined,
      quantity: Number(p?.quantity) || 1,
      unitPrice: Number(p?.price) || 0,
    }));
  }

  total(lines: OrderLine[]): number {
    return lines.reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
  }

  buildOrderMessage(lines: OrderLine[]): string {
    const body = lines.map((l) => {
      const code = l.code ? ` (${l.code})` : '';
      return `• ${l.name}${code} x ${l.quantity} — ${this.money(l.unitPrice)} c/u — ${this.money(l.unitPrice * l.quantity)}`;
    });
    return [
      'Hola, quiero hacer este pedido:',
      '',
      ...body,
      '',
      `Total estimado: ${this.money(this.total(lines))} COP`,
    ].join('\n');
  }

  orderUrl(lines: OrderLine[]): string {
    return this.url(this.buildOrderMessage(lines));
  }

  contactUrl(text = 'Hola, necesito información sobre sus productos'): string {
    return this.url(text);
  }

  /** Keeps the cart that was just sent, so it can be restored if the customer never sent the message. */
  rememberSentOrder(cartItems: any[]): void {
    try {
      localStorage.setItem(SENT_ORDER_KEY, JSON.stringify({ at: Date.now(), items: cartItems || [] }));
    } catch { /* storage unavailable: restore just won't be offered */ }
  }

  /** The last sent cart, or null when there is none or it is older than the restore window. */
  lastSentOrder(): any[] | null {
    try {
      const saved = JSON.parse(localStorage.getItem(SENT_ORDER_KEY) || 'null');
      if (!saved?.items?.length || Date.now() - Number(saved.at) > SENT_ORDER_TTL_MS) { return null; }
      return saved.items;
    } catch {
      return null;
    }
  }

  forgetSentOrder(): void {
    try { localStorage.removeItem(SENT_ORDER_KEY); } catch { /* ignore */ }
  }

  private url(text: string): string {
    return `https://wa.me/${SALES_CHANNEL.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  /** $4.200 — Colombian thousands separator, no decimals. */
  private money(value: number): string {
    return '$' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
