import { CartItem, Order } from "../types";
import { formatPKR, shortId } from "../utils/format";
import { hasWhatsApp, storeConfig } from "./storeConfig";

/** Build a wa.me link for a free-text message, or null if no number is set. */
export function whatsappLink(message: string): string | null {
  if (!hasWhatsApp) return null;
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Prefilled "I just ordered" message customers can send to confirm by WhatsApp. */
export function orderWhatsAppLink(order: Order, items: CartItem[]): string | null {
  const lines = items.map(
    (i) => `• ${i.product.name} × ${i.quantity} — ${formatPKR(i.product.price * i.quantity)}`,
  );
  const message = [
    `Hi ${storeConfig.name}! I just placed an order 🧸`,
    "",
    `Order: ${shortId(order.id)}`,
    `Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    "",
    ...lines,
    "",
    `Total: ${formatPKR(order.total)} (Cash on Delivery)`,
    `Address: ${order.delivery_address}, ${order.city}`,
  ].join("\n");
  return whatsappLink(message);
}

/** General "I have a question" contact link. */
export function contactWhatsAppLink(): string | null {
  return whatsappLink(`Hi ${storeConfig.name}! I have a question about your kids garments.`);
}
