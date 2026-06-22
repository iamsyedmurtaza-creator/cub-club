import { useEffect } from "react";
import { storeConfig } from "./storeConfig";

type SeoOptions = {
  /** Page title without the brand suffix (e.g. "Girls Dresses"). Omit for the brand default. */
  title?: string;
  description?: string;
  /** Absolute or root-relative image URL for social cards. */
  image?: string;
  /** Root-relative path for the canonical URL, e.g. "/product/soft-tee". */
  path?: string;
  /** Open Graph type. "website" for listings, "product" for product pages. */
  type?: string;
  /** Optional structured data object injected as JSON-LD. */
  jsonLd?: Record<string, unknown> | null;
};

const DEFAULT_DESCRIPTION =
  "Cub Club sells export-quality kids garments in Pakistan with soft fabrics, clean stitching and easy cash on delivery.";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (!storeConfig.siteUrl) return undefined; // can't build an absolute URL without the domain
  return `${storeConfig.siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Imperatively manage document head tags for the current page (client-side SPA SEO). */
export function useSeo({ title, description, image, path, type = "website", jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${storeConfig.name}` : `${storeConfig.name} | Export Quality Kids Garments in Pakistan`;
    const desc = description || DEFAULT_DESCRIPTION;
    const canonical = path && storeConfig.siteUrl ? `${storeConfig.siteUrl}${path}` : undefined;
    const ogImage = absolute(image) || absolute("/cubclub-logo.png");

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", type);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    if (ogImage) {
      upsertMeta("property", "og:image", ogImage);
      upsertMeta("name", "twitter:image", ogImage);
    }
    if (canonical) {
      upsertCanonical(canonical);
      upsertMeta("property", "og:url", canonical);
    }

    const existing = document.getElementById("seo-jsonld");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "seo-jsonld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, image, path, type, jsonLd]);
}
