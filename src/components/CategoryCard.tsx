import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "../types";
import { categoryImage } from "../lib/designAssets";

const titleMap: Record<string, string> = {
  "toddler-garments": "Garments",
  "girls": "Girls",
  "boys": "Boys",
  "infants": "Infants",
  "new-arrivals": "New Drop",
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/category/${category.slug}`} className="group relative block overflow-hidden bg-white shadow-store">
      <div className="aspect-[4/4.6] overflow-hidden bg-cream">
        <img src={category.image_url || categoryImage(category.slug)} alt={category.name} className="image-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">{titleMap[category.slug] ?? "Cub Club"}</p>
        <h3 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{category.name}</h3>
        <span className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-ink transition group-hover:bg-honey">
          Shop now <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
