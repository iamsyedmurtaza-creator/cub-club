// Build-time sitemap generator for Cub Club.
// Runs automatically before `npm run build` (see package.json "prebuild").
// Reads active categories + products from Supabase and writes public/sitemap.xml.
// It never fails the build: on any error it falls back to the static routes.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Load env from process.env, falling back to a local .env file.
function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    const path = resolve(root, file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && env[match[1]] === undefined) {
        env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

const env = loadEnv();
const SITE_URL = (env.VITE_SITE_URL || "https://www.cubclub.pk").replace(/\/+$/, "");
const SUPABASE_URL = (env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || "";

const staticRoutes = ["/", "/shop"];

async function fetchSlugs(table, select) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&is_active=eq.true`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${res.statusText}`);
  return res.json();
}

function urlEntry(path, lastmod) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ""}\n  </url>`;
}

async function main() {
  const entries = staticRoutes.map((p) => urlEntry(p));
  try {
    const [categories, products] = await Promise.all([
      fetchSlugs("categories", "slug"),
      fetchSlugs("products", "slug,updated_at"),
    ]);
    for (const c of categories) entries.push(urlEntry(`/category/${c.slug}`));
    for (const p of products) entries.push(urlEntry(`/product/${p.slug}`, p.updated_at));
    console.log(`[sitemap] ${categories.length} categories, ${products.length} products`);
  } catch (err) {
    console.warn(`[sitemap] Could not fetch dynamic routes (${err.message}). Writing static routes only.`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  const outDir = resolve(root, "public");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "sitemap.xml"), xml);
  console.log(`[sitemap] Wrote public/sitemap.xml with ${entries.length} URLs (base: ${SITE_URL})`);
}

main().catch((err) => {
  console.warn(`[sitemap] Skipped: ${err.message}`);
  process.exit(0);
});
