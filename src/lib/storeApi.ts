import { supabase } from "./supabase";
import { fallbackCategories, fallbackProducts } from "../data/fallback";
import { CartItem, Category, Order, OrderStatus, Product } from "../types";
import { isPublicGarmentCategory, isPublicGarmentProduct } from "./garmentFilters";

function normalizeProduct(row: any): Product {
  return {
    ...row,
    price: Number(row.price ?? 0),
    compare_at_price: row.compare_at_price === null || row.compare_at_price === undefined ? null : Number(row.compare_at_price),
    stock_quantity: Number(row.stock_quantity ?? 0),
  } as Product;
}

function normalizeOrder(row: any): Order {
  return {
    ...row,
    subtotal: Number(row.subtotal ?? 0),
    delivery_fee: Number(row.delivery_fee ?? 0),
    total: Number(row.total ?? 0),
    order_items: row.order_items?.map((item: any) => ({
      ...item,
      unit_price: Number(item.unit_price ?? 0),
      line_total: Number(item.line_total ?? 0),
    })),
  } as Order;
}

export async function fetchCategories(includeInactive = false): Promise<Category[]> {
  let query = supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (!includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error || !data?.length) return includeInactive ? fallbackCategories : fallbackCategories.filter(isPublicGarmentCategory);
  const categories = data as Category[];
  return includeInactive ? categories : categories.filter(isPublicGarmentCategory);
}

export async function fetchProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  includeInactive?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc";
}): Promise<Product[]> {
  let query = supabase.from("products").select("*, categories(name, slug)");
  if (!options?.includeInactive) query = query.eq("is_active", true);
  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.search) query = query.ilike("name", `%${options.search}%`);
  if (options?.categorySlug) {
    const { data: category } = await supabase.from("categories").select("id").eq("slug", options.categorySlug).maybeSingle();
    if (category?.id) query = query.eq("category_id", category.id);
  }
  if (options?.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (options?.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error || !data?.length) {
    let demo = fallbackProducts;
    if (options?.categorySlug) demo = demo.filter((p) => p.categories?.slug === options.categorySlug);
    if (options?.featured) demo = demo.filter((p) => p.is_featured);
    if (options?.search) demo = demo.filter((p) => p.name.toLowerCase().includes(options.search!.toLowerCase()));
    if (options?.sort === "price_asc") demo = [...demo].sort((a, b) => a.price - b.price);
    if (options?.sort === "price_desc") demo = [...demo].sort((a, b) => b.price - a.price);
    return options?.includeInactive ? demo : demo.filter(isPublicGarmentProduct);
  }
  const products = data.map(normalizeProduct);
  return options?.includeInactive ? products : products.filter(isPublicGarmentProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*, categories(name, slug)").eq("slug", slug).maybeSingle();
  if (error || !data) return fallbackProducts.find((product) => product.slug === slug) ?? null;
  return normalizeProduct(data);
}

export async function fetchProductImages(productId: string) {
  const { data, error } = await supabase.from("product_images").select("*").eq("product_id", productId).order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function createOrder(input: {
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  items: CartItem[];
  deliveryFee: number;
}) {
  const subtotal = input.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = subtotal + input.deliveryFee;
  const { data: order, error: orderError } = await supabase.from("orders").insert({
    user_id: input.userId ?? null,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    customer_email: input.customerEmail || null,
    delivery_address: input.deliveryAddress,
    city: input.city,
    notes: input.notes || null,
    payment_method: "cash_on_delivery",
    status: "pending",
    subtotal,
    delivery_fee: input.deliveryFee,
    total,
  }).select("*").single();
  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id.startsWith("demo-") ? null : item.product.id,
    product_name: item.product.name,
    product_sku: item.product.sku,
    size: item.product.size,
    color: item.product.color,
    quantity: item.quantity,
    unit_price: item.product.price,
    line_total: item.product.price * item.quantity,
  }));
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;
  return normalizeOrder(order);
}

export async function fetchUserOrders() {
  const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalizeOrder);
}

export async function fetchAdminOrders() {
  const { data, error } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(normalizeOrder);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

export async function saveProduct(product: Partial<Product> & { name: string; slug: string; price: number }, id?: string) {
  const payload = {
    category_id: product.category_id || null,
    name: product.name,
    slug: product.slug,
    description: product.description || null,
    short_description: product.short_description || null,
    price: product.price,
    compare_at_price: product.compare_at_price || null,
    sku: product.sku || null,
    size: product.size || null,
    color: product.color || null,
    age_range: product.age_range || null,
    material: product.material || null,
    stock_quantity: Number(product.stock_quantity ?? 0),
    is_featured: Boolean(product.is_featured),
    is_active: Boolean(product.is_active),
    main_image_url: product.main_image_url || null,
  };
  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await supabase.from("products").insert(payload).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function setProductActive(productId: string, isActive: boolean) {
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", productId);
  if (error) throw error;
}

export async function uploadProductImage(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  const path = `products/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveCategory(input: Partial<Category> & { name: string; slug: string }, id?: string) {
  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.image_url || null,
    sort_order: Number(input.sort_order ?? 0),
    is_active: Boolean(input.is_active),
  };
  if (id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) throw error;
    return id;
  }
  const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
  if (error) throw error;
  return data.id as string;
}
