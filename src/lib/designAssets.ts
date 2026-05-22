export const lifestyleImages = {
  hero:
    "/images/hero.jpg",
  girls:
    "/images/girls.jpg",
  boys:
    "/images/boys.jpg",
  infants:
    "/images/infants.jpg",
  newDrop:
    "/images/new-arrivals.jpg",
  sale:
    "/images/quality-section.jpg",
  story:
    "/images/cod-banner.jpg",
};

export function categoryImage(slug?: string | null) {
  if (slug === "girls") return lifestyleImages.girls;
  if (slug === "boys") return lifestyleImages.boys;
  if (slug === "infants") return lifestyleImages.infants;
  if (slug === "new-arrivals") return lifestyleImages.newDrop;
  return lifestyleImages.boys;
}

export function productMood(productName: string, categoryName?: string | null) {
  const text = `${productName} ${categoryName ?? ""}`.toLowerCase();
  if (text.includes("girl") || text.includes("dress") || text.includes("frock")) return "dress";
  if (text.includes("set") || text.includes("suit") || text.includes("short")) return "set";
  return "tee";
}
