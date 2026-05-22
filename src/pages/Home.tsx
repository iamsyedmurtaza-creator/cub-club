import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Headphones, RotateCcw, ShieldCheck, Shirt, Sparkles, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { lifestyleImages } from "../lib/designAssets";
import { fetchProducts } from "../lib/storeApi";
import { Product } from "../types";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const collections = [
  { title: "Girls", label: "Pretty everyday wear", image: lifestyleImages.girls, to: "/shop?q=girls" },
  { title: "Boys", label: "Soft casual outfits", image: lifestyleImages.boys, to: "/shop?q=boys" },
  { title: "Infants", label: "Gentle baby clothing", image: lifestyleImages.infants, to: "/shop?q=infant" },
  { title: "New Arrivals", label: "Fresh export-quality pieces", image: lifestyleImages.newDrop, to: "/shop" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: true })
      .then((p) => setProducts(p.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-paper">
      <section className="relative overflow-hidden bg-white">
        <div className="grid lg:h-[620px] lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="container-page order-2 flex items-center py-9 sm:py-12 lg:order-1 lg:py-10"
          >
            <div className="w-full max-w-xl">
              <p className="eyebrow max-w-full break-words">Export-quality kids clothing</p>
              <h1 className="hero-title mt-4 font-display font-black uppercase leading-[0.92] tracking-[-0.045em] text-ink">
                <span>Fresh fits</span>
                <span>for little</span>
                <span>cubs.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] font-medium leading-7 text-ink/65 sm:text-lg sm:leading-8">
                Cub Club brings export-quality garments for Pakistani kids — clean style, soft fabrics, everyday comfort and easy cash-on-delivery shopping.
              </p>
              <div className="mt-7 grid gap-3 sm:flex sm:flex-row">
                <Link to="/shop" className="btn-primary w-full sm:w-auto">
                  Shop new arrivals <ArrowRight className="ml-2" size={17} />
                </Link>
                <Link to="/category/toddler-garments" className="btn-secondary w-full sm:w-auto">
                  Explore garments
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-image group relative order-1 overflow-hidden lg:order-2 lg:h-full"
          >
            <img src={lifestyleImages.hero} alt="Child wearing premium Cub Club clothing" className="h-full w-full object-cover object-center transition duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent lg:bg-gradient-to-r lg:from-white/0 lg:via-white/0 lg:to-black/10" />
            <div className="absolute bottom-4 left-4 right-4 max-w-[300px] bg-white/94 p-4 shadow-soft backdrop-blur sm:bottom-10 sm:left-10 sm:right-auto sm:w-80 sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-honey sm:text-[10px]">Cub Club drop</p>
              <h2 className="mt-2 text-xl font-black uppercase leading-tight text-ink sm:text-2xl">Premium clothes. Easy ordering.</h2>
              <Link to="/shop" className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink hover:text-honey sm:mt-4 sm:text-xs">
                Start shopping <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-black/5 bg-ink py-3 text-white">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-10">
              <span>Export-quality garments</span>
              <span>Soft kids clothing</span>
              <span>Cash on delivery</span>
              <span>Pakistan delivery</span>
              <span>New season outfits</span>
            </div>
          ))}
        </div>
      </div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.55 }}
        className="container-page section-pad"
      >
        <div className="mb-9 text-center">
          <p className="eyebrow">Our collections</p>
          <h2 className="section-title">Shop the Cub Club edit</h2>
          <p className="section-subtitle mx-auto max-w-2xl">Clean, photo-led kidswear collections that feel like a real clothing store, not a software landing page.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item) => (
            <Link key={item.title} to={item.to} className="group relative block overflow-hidden bg-white shadow-store">
              <div className="aspect-[4/4.6] overflow-hidden bg-cream">
                <img src={item.image} alt={item.title} className="image-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">{item.label}</p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{item.title}</h3>
                <span className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-ink transition group-hover:bg-honey">
                  Shop now <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      <section className="container-page pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reveal}
          transition={{ duration: 0.55 }}
          className="grid overflow-hidden bg-white shadow-store lg:grid-cols-2"
        >
          <div className="relative min-h-[340px] overflow-hidden">
            <img src={lifestyleImages.story} alt="Export-quality kids garments" className="h-full w-full object-cover" />
            <div className="absolute left-6 top-6 bg-honey px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-ink">New season</div>
          </div>
          <div className="flex items-center p-7 sm:p-10 lg:p-14">
            <div>
              <p className="eyebrow">Soft everyday garments</p>
              <h2 className="mt-3 max-w-lg text-4xl font-black uppercase leading-tight tracking-[-0.03em] text-ink sm:text-5xl">Export-quality clothing, made for daily comfort.</h2>
              <p className="mt-5 max-w-xl text-sm font-medium leading-8 text-ink/60">Cub Club focuses only on kids garments: soft outfits, clean stitching, playful seasonal looks, and easy COD ordering for parents in Pakistan.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <MiniTrust icon={<Shirt size={18} />} title="Clothes" text="Garments only" />
                <MiniTrust icon={<ShieldCheck size={18} />} title="Quality" text="Export-quality feel" />
                <MiniTrust icon={<RotateCcw size={18} />} title="Easy" text="Simple ordering" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.55 }}
        className="container-page section-pad"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured garments</p>
            <h2 className="section-title">What parents are viewing</h2>
          </div>
          <Link to="/shop" className="hidden text-xs font-bold uppercase tracking-[0.16em] text-ink transition hover:text-honey sm:inline-flex">Shop all</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse bg-white shadow-store" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      <section className="container-page pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="relative min-h-[390px] overflow-hidden bg-ink text-white"
        >
          <img src={lifestyleImages.sale} alt="Kids clothing sale banner" className="absolute inset-0 h-full w-full object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="relative max-w-xl p-8 sm:p-12 lg:p-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-honey">Cash on delivery</p>
            <h2 className="mt-4 text-5xl font-black uppercase leading-none tracking-[-0.04em] sm:text-6xl">Order online. Pay when it arrives.</h2>
            <p className="mt-5 text-sm font-medium leading-8 text-white/75">Perfect for Pakistan. Customers can checkout without card payments, then Cub Club confirms the order before delivery.</p>
            <Link to="/shop" className="mt-8 inline-flex bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:bg-honey">
              Shop now
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-black/5 bg-white py-10">
        <div className="container-page grid gap-6 text-center sm:grid-cols-3">
          <Support icon={<Sparkles size={24} />} title="Quality" text="Export-quality garments for everyday wear." />
          <Support icon={<Truck size={24} />} title="Delivery" text="Cash on delivery for Pakistani customers." />
          <Support icon={<Headphones size={24} />} title="Support" text="Email us at cubclub.official@gmail.com." />
        </div>
      </section>
    </div>
  );
}

function MiniTrust({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="border border-black/10 bg-paper p-4">
      <div className="mb-3 text-honey">{icon}</div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">{title}</p>
      <p className="mt-1 text-xs font-medium text-ink/50">{text}</p>
    </div>
  );
}

function Support({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="mx-auto max-w-xs">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-black/10 text-honey">{icon}</div>
      <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-ink/55">{text}</p>
    </div>
  );
}
