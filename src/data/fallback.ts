import { Category, Product } from "../types";

const now = new Date().toISOString();

export const fallbackCategories: Category[] = [
  { id: "cat-garments", name: "Toddler Garments", slug: "toddler-garments", description: "Soft export-quality outfits for tiny adventures.", image_url: null, sort_order: 1, is_active: true, created_at: now },
  { id: "cat-girls", name: "Girls", slug: "girls", description: "Pretty everyday wear for little girls.", image_url: null, sort_order: 2, is_active: true, created_at: now },
  { id: "cat-boys", name: "Boys", slug: "boys", description: "Clean casual outfits for little boys.", image_url: null, sort_order: 3, is_active: true, created_at: now },
  { id: "cat-new", name: "New Arrivals", slug: "new-arrivals", description: "Fresh export-quality pieces from Cub Club.", image_url: null, sort_order: 4, is_active: true, created_at: now },
];

export const fallbackProducts: Product[] = [
  { id: "demo-1", category_id: "cat-garments", name: "Cloud Soft Toddler Set", slug: "cloud-soft-toddler-set", short_description: "A cozy cotton outfit for everyday play.", description: "Soft, breathable and easy to wear. Perfect for everyday adventures, family visits and cozy home days.", price: 2499, compare_at_price: 3199, sku: "CC-DEMO-001", size: "1-3 years", color: "Cream", age_range: "1-3 years", material: "Cotton blend", stock_quantity: 12, is_featured: true, is_active: true, main_image_url: null, created_at: now, updated_at: now, categories: { name: "Toddler Garments", slug: "toddler-garments" } },
  { id: "demo-2", category_id: "cat-boys", name: "Sunny Stripe Tee", slug: "sunny-stripe-tee", short_description: "Bright, soft and playful.", description: "A happy little tee made for warm days and big smiles.", price: 1299, compare_at_price: 1699, sku: "CC-DEMO-002", size: "2-4 years", color: "Sunset", age_range: "2-4 years", material: "Cotton", stock_quantity: 9, is_featured: true, is_active: true, main_image_url: null, created_at: now, updated_at: now, categories: { name: "Boys", slug: "boys" } },
  { id: "demo-3", category_id: "cat-girls", name: "Little Bloom Dress", slug: "little-bloom-dress", short_description: "A soft dress for outings and family days.", description: "A lightweight, export-quality dress with a clean premium finish for little girls.", price: 2799, compare_at_price: 3499, sku: "CC-DEMO-003", size: "2-5 years", color: "Blush", age_range: "2-5 years", material: "Cotton blend", stock_quantity: 10, is_featured: true, is_active: true, main_image_url: null, created_at: now, updated_at: now, categories: { name: "Girls", slug: "girls" } },
  { id: "demo-4", category_id: "cat-new", name: "Everyday Cotton Tee", slug: "everyday-cotton-tee", short_description: "Clean everyday comfort.", description: "A soft everyday tee with a simple boutique look for daily wear.", price: 1499, compare_at_price: null, sku: "CC-DEMO-004", size: "3-6 years", color: "Sage", age_range: "3-6 years", material: "Cotton", stock_quantity: 18, is_featured: true, is_active: true, main_image_url: null, created_at: now, updated_at: now, categories: { name: "New Arrivals", slug: "new-arrivals" } },
];
