import { WhatsappOrderService } from './whatsapp-order.service';
import { MetaPixelService } from './meta-pixel.service';
import { SALES_CHANNEL } from '../Core/sales-channel.config';

describe('WhatsappOrderService', () => {
  const service = new WhatsappOrderService();
  const cart = [
    { id_product: 142, name: 'Rodamiento 6201-RS', produc_code: '6201-RS', price: 4200, quantity: 50 },
    { id_product: 77, name: 'Escobilla de grafito', produc_code: '', price: '1800', quantity: '100' },
  ];

  it('maps cart items into order lines', () => {
    expect(service.toOrderLines(cart)).toEqual([
      { name: 'Rodamiento 6201-RS', code: '6201-RS', quantity: 50, unitPrice: 4200 },
      { name: 'Escobilla de grafito', code: undefined, quantity: 100, unitPrice: 1800 },
    ]);
  });

  it('defaults missing quantity to 1', () => {
    expect(service.toOrderLines([{ name: 'X', price: 1000 }])[0].quantity).toBe(1);
  });

  it('builds the order message with COP thousands separators and total', () => {
    const msg = service.buildOrderMessage(service.toOrderLines(cart));
    expect(msg).toBe([
      'Hola, quiero hacer este pedido:',
      '',
      '• Rodamiento 6201-RS (6201-RS) x 50 — $4.200 c/u — $210.000',
      '• Escobilla de grafito x 100 — $1.800 c/u — $180.000',
      '',
      'Total estimado: $390.000 COP',
    ].join('\n'));
  });

  it('points the order link to the configured WhatsApp number with an encoded message', () => {
    const url = service.orderUrl(service.toOrderLines(cart));
    expect(url.startsWith(`https://wa.me/${SALES_CHANNEL.whatsappNumber}?text=`)).toBeTrue();
    const text = decodeURIComponent(url.split('?text=')[1]);
    expect(text).toContain('Total estimado: $390.000 COP');
  });

  it('builds the generic contact link', () => {
    expect(service.contactUrl()).toBe(
      `https://wa.me/${SALES_CHANNEL.whatsappNumber}?text=${encodeURIComponent('Hola, necesito información sobre sus productos')}`);
  });
});

describe('MetaPixelService.lead', () => {
  it('sends Lead with value, COP and the catalog ids', () => {
    const pixel = new MetaPixelService({ events: { pipe: () => ({ subscribe: () => {} }) } } as any);
    const fbq = jasmine.createSpy('fbq');
    (window as any).fbq = fbq;
    (pixel as any).enabled = true;

    pixel.lead([
      { id_product: 142, quantity: 50 },
      { id_product: 77, quantity: 100 },
    ], 390000);

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', {
      content_ids: ['142', '77'],
      contents: [{ id: '142', quantity: 50 }, { id: '77', quantity: 100 }],
      content_type: 'product',
      num_items: 150,
      value: 390000,
      currency: 'COP',
    });
    delete (window as any).fbq;
  });
});
