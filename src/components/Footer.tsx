import { Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-cream pb-28 pt-12 md:pb-10">
      <div className="container-page grid gap-10 md:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img src="/cubclub-logo.png" alt="Cub Club" className="h-20 w-auto max-w-[190px] object-contain" />
          </Link>
          <p className="mt-4 max-w-sm text-sm font-medium leading-7 text-ink/55">
            Export-quality kids garments for Pakistani parents who want comfort, clean style, soft fabrics and easy cash-on-delivery ordering.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ink">Shop</h4>
          <div className="mt-4 grid gap-2 text-sm font-medium text-ink/60">
            <Link to="/category/toddler-garments">Toddler Garments</Link>
            <Link to="/shop?q=girls">Girls</Link>
            <Link to="/shop?q=boys">Boys</Link>
            <Link to="/shop">New Arrivals</Link>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ink">Support</h4>
          <div className="mt-4 grid gap-2 text-sm font-medium text-ink/60">
            <span>Cash on Delivery</span>
            <span>Order confirmation</span>
            <span>Pakistan delivery</span>
            <span>Returns & exchange</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.18em] text-ink">Contact</h4>
          <div className="mt-4 grid gap-3 text-sm font-medium text-ink/60">
            <a href="mailto:cubclub.official@gmail.com" className="flex items-center gap-2 hover:text-honey"><Mail size={16} /> cubclub.official@gmail.com</a>
            <div className="mt-2 flex gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Instagram size={18} /></span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink"><Facebook size={18} /></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
