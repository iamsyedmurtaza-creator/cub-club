import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { CartItem, Order } from "../types";
import { orderWhatsAppLink } from "../lib/whatsapp";
import { formatPKR, shortId } from "../utils/format";

type SuccessState = { order?: Order; items?: CartItem[] };

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { order, items } = (useLocation().state as SuccessState | null) ?? {};
  const waLink = order && items ? orderWhatsAppLink(order, items) : null;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[3rem] bg-white p-8 text-center shadow-soft ring-1 ring-cocoa/5 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint text-cocoa">
          <CheckCircle2 size={44} />
        </div>
        <p className="label-soft mt-8">Order placed</p>
        <h1 className="font-display text-5xl font-extrabold leading-tight text-cocoa">
          Your Cub Club order has been placed.
        </h1>
        <p className="mt-4 text-base font-semibold leading-8 text-cocoa/60">
          We’ll contact you soon to confirm delivery. Payment will be collected through cash on delivery.
        </p>

        {orderId ? (
          <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-sm font-extrabold text-cocoa">
            Order ID: {shortId(orderId)}
          </p>
        ) : null}

        {order && items?.length ? (
          <div className="mt-6 grid gap-2 rounded-3xl bg-paper p-5 text-left text-sm font-bold text-cocoa/65 ring-1 ring-black/5">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-3">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPKR(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-cocoa/10 pt-3 text-base font-extrabold text-cocoa">
              <span>Total</span>
              <span>{formatPKR(order.total)}</span>
            </div>
          </div>
        ) : null}

        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-base font-extrabold text-white shadow-soft transition hover:brightness-105"
          >
            <MessageCircle size={20} /> Confirm order on WhatsApp
          </a>
        ) : null}

        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/shop" className="btn-primary">Continue shopping</Link>
          <Link to="/my-orders" className="btn-secondary">View my orders</Link>
        </div>
      </div>
    </div>
  );
}
