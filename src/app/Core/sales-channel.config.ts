/**
 * How orders are closed.
 *
 * Products are cheap per unit and sales are wholesale-sized, so orders are
 * closed over WhatsApp instead of the online payment gateway.
 * Flip `onlinePaymentEnabled` to true to bring the gateway checkout back:
 * the /checkout route, header link and cart "Pagar" button all read it.
 */
export const SALES_CHANNEL = {
  onlinePaymentEnabled: false,
  whatsappNumber: '573202863947',
} as const;
