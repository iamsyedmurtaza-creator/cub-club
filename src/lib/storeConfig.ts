// Central place for Cub Club contact details and storefront settings.
//
// To turn on WhatsApp ordering, set your number below (or via the
// VITE_WHATSAPP_NUMBER env var) in INTERNATIONAL format, digits only:
//   Pakistan example: 0301 2345678  ->  "923012345678"
// Leave it blank and the WhatsApp buttons stay hidden automatically.

const env = import.meta.env as Record<string, string | undefined>;

const RAW_WHATSAPP = env.VITE_WHATSAPP_NUMBER || ""; // e.g. "923012345678"

export const storeConfig = {
  name: "Cub Club",
  // Production URL, no trailing slash. Needed for canonical/OG/sitemap URLs.
  siteUrl: (env.VITE_SITE_URL || "").replace(/\/+$/, ""),
  email: env.VITE_STORE_EMAIL || "cubclub.official@gmail.com",
  whatsappNumber: RAW_WHATSAPP.replace(/[^\d]/g, ""),
  instagramUrl: env.VITE_INSTAGRAM_URL || "",
  facebookUrl: env.VITE_FACEBOOK_URL || "",
  freeDeliveryThreshold: 8000,
  deliveryFee: 250,
};

// A valid international mobile number is at least ~11 digits.
export const hasWhatsApp = storeConfig.whatsappNumber.length >= 11;
