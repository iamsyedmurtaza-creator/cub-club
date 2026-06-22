import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Product } from "../types";
import { formatPKR } from "../utils/format";
import { useCart } from "../contexts/CartContext";
import ProductArt from "./ProductArt";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const isOut = product.stock_quantity <= 0;
  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <article className="group bg-white transition duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f7f7f3] shadow-store">
          <ProductArt imageUrl={product.main_image_url} title={product.name} categoryName={product.categories?.name} />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.is_featured ? <span className="bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">New</span> : null}
            {isOut ? <span className="bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Out</span> : product.stock_quantity <= 5 ? <span className="bg-honey px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">Low</span> : null}
          </div>
          {discount ? (
            <div className="absolute right-3 top-3 bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              -{discount}%
            </div>
          ) : null}
          <button
            disabled={isOut}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-center gap-2 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ink opacity-0 shadow-store transition duration-300 hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <ShoppingBag size={16} /> {isOut ? "Out of stock" : "Quick add"}
          </button>
        </div>
      </Link>
      <div className="px-1 py-4 text-center sm:text-left">
        <Link to={`/product/${product.slug}`} className="block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">{product.categories?.name ?? "Cub Club"}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-5 text-ink sm:text-base">{product.name}</h3>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="text-sm font-bold text-red-600">{formatPKR(product.price)}</span>
            {product.compare_at_price ? <span className="text-xs font-medium text-ink/35 line-through">{formatPKR(product.compare_at_price)}</span> : null}
          </div>
        </Link>
        <button
          disabled={isOut}
          onClick={() => addItem(product)}
          className="mt-3 flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-honey hover:text-ink disabled:cursor-not-allowed disabled:bg-ink/20 md:hidden"
        >
          <ShoppingBag size={16} /> {isOut ? "Out" : "Add"}
        </button>
      </div>
    </article>
  );
}
