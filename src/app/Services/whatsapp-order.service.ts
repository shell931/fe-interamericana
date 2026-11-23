import { Injectable } from '@angular/core';
import { SALES_CHANNEL } from '../Core/sales-channel.config';

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

  private url(text: string): string {
    return `https://wa.me/${SALES_CHANNEL.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  /** $4.200 — Colombian thousands separator, no decimals. */
  private money(value: number): string {
    return '$' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
