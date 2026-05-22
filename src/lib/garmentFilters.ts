import { Category, Product } from "../types";

export const garmentCategorySlugs = new Set([
  "toddler-garments",
  "boys",
  "girls",
  "infants",
  "new-arrivals",
  "summer-collection",
  "winter-collection",
  "sale",
]);

const blockedTerms = ["cot", "crib", "nursery", "accessor", "lunch", "bottle", "bag", "toy", "stroller"];

export function isPublicGarmentCategory(category: Category) {
  const slug = category.slug?.toLowerCase() ?? "";
  const name = category.name?.toLowerCase() ?? "";
  if (slug.includes("cot") || slug.includes("accessor")) return false;
  if (name.includes("cot") || name.includes("accessor") || name.includes("nursery")) return false;
  return true;
}

export function isPublicGarmentProduct(product: Product) {
  const categorySlug = product.categories?.slug?.toLowerCase() ?? "";
  const categoryName = product.categories?.name?.toLowerCase() ?? "";
  const productText = `${product.name} ${product.short_description ?? ""} ${product.description ?? ""}`.toLowerCase();

  if (categorySlug.includes("cot") || categorySlug.includes("accessor")) return false;
  if (categoryName.includes("cot") || categoryName.includes("accessor") || categoryName.includes("nursery")) return false;
  if (blockedTerms.some((term) => productText.includes(term))) return false;

  return true;
}
