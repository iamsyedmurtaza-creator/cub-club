export const lifestyleImages = {
  hero:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1800&q=85",
  girls:
    "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1200&q=85",
  boys:
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=85",
  infants:
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=85",
  newDrop:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85",
  sale:
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1800&q=85",
  story:
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=85",
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
