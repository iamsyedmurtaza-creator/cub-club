import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { categoryImage, lifestyleImages } from "../lib/designAssets";
import { fetchCategories, fetchProducts } from "../lib/storeApi";
import { useSeo } from "../lib/useSeo";
import { Category, Product } from "../types";

export default function Shop() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as "newest" | "price_asc" | "price_desc") || "newest";
  const sizeFilter = searchParams.get("size") ?? "";
  const colorFilter = searchParams.get("color") ?? "";
  const ageFilter = searchParams.get("age") ?? "";

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchProducts({ categorySlug, search, sort })])
      .then(([c, p]) => {
        setCategories(c);
        setProducts(p);
      })
      .finally(() => setLoading(false));
  }, [categorySlug, search, sort]);

  const activeCategory = useMemo(() => categories.find((c) => c.slug === categorySlug), [categories, categorySlug]);
  const title = activeCategory?.name ?? "Shop Cub Club";
  const heroImage = activeCategory ? categoryImage(activeCategory.slug) : lifestyleImages.hero;

  const uniqueValues = (pick: (p: Product) => string | null) =>
    Array.from(new Set(products.map(pick).filter((v): v is string => !!v))).sort();
  const sizes = useMemo(() => uniqueValues((p) => p.size), [products]);
  const colors = useMemo(() => uniqueValues((p) => p.color), [products]);
  const ages = useMemo(() => uniqueValues((p) => p.age_range), [products]);

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (!sizeFilter || p.size === sizeFilter) &&
          (!colorFilter || p.color === colorFilter) &&
          (!ageFilter || p.age_range === ageFilter),
      ),
    [products, sizeFilter, colorFilter, ageFilter],
  );
  const filtersActive = Boolean(sizeFilter || colorFilter || ageFilter);

  function clearFilters() {
    const next = new URLSearchParams(searchParams);
    next.delete("size");
    next.delete("color");
    next.delete("age");
    setSearchParams(next);
  }

  useSeo({
    title: activeCategory ? `${activeCategory.name} Kids Garments` : "Shop Kids Garments",
    description: activeCategory?.description || "Browse export-quality kids garments — girls, boys and infant clothing with cash on delivery across Pakistan.",
    image: heroImage,
    path: categorySlug ? `/category/${categorySlug}` : "/shop",
  });

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="bg-paper">
      <section className="relative min-h-[340px] overflow-hidden bg-ink text-white sm:min-h-[430px]">
        <img src={heroImage} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="container-page relative flex min-h-[340px] items-center sm:min-h-[430px]">
          <div className="max-w-2xl py-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-honey">Cub Club store</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-none tracking-[-0.04em] sm:text-7xl">{title}</h1>
            <p className="mt-5 max-w-xl text-sm font-medium leading-8 text-white/75 sm:text-base">
              Browse export-quality kids garments for everyday comfort, clean style and easy cash-on-delivery shopping in Pakistan.
            </p>
          </div>
        </motion.div>
      </section>

      <div className="container-page -mt-8 relative z-10">
        <div className="grid gap-3 bg-white p-4 shadow-soft ring-1 ring-black/5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input value={search} onChange={(e) => updateParam("q", e.target.value)} placeholder="Search products..." className="input-soft" />
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input-soft">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>
          {(sizes.length || colors.length || ages.length) ? (
            <div className="flex flex-wrap items-center gap-3">
              {sizes.length ? (
                <select value={sizeFilter} onChange={(e) => updateParam("size", e.target.value)} className="input-soft w-auto min-w-36">
                  <option value="">All sizes</option>
                  {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : null}
              {colors.length ? (
                <select value={colorFilter} onChange={(e) => updateParam("color", e.target.value)} className="input-soft w-auto min-w-36">
                  <option value="">All colors</option>
                  {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : null}
              {ages.length ? (
                <select value={ageFilter} onChange={(e) => updateParam("age", e.target.value)} className="input-soft w-auto min-w-36">
                  <option value="">All ages</option>
                  {ages.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              ) : null}
              {filtersActive ? (
                <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-[0.14em] text-cocoa/55 underline-offset-4 hover:text-honey hover:underline">Clear filters</button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="container-page section-pad">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          <Link to="/shop" className="shrink-0 border border-black/10 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:border-honey hover:text-honey">All</Link>
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`} className="shrink-0 border border-black/10 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ink transition hover:border-honey hover:text-honey">
              {category.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse bg-white shadow-store" />
            ))}
          </div>
        ) : visibleProducts.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center shadow-store">
            <p className="text-5xl">🧸</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-ink">No products found</h2>
            <p className="mt-2 text-sm font-medium text-ink/55">{filtersActive ? "Try clearing some filters." : "Try another category or search term."}</p>
            {filtersActive ? <button onClick={clearFilters} className="btn-secondary mt-5">Clear filters</button> : null}
          </div>
        )}
      </div>
    </div>
  );
}
