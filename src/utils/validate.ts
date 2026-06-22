// Lightweight client-side validation for the COD checkout form.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strip spaces, dashes and a leading +92 / 92 down to local digits. */
export function normalizePkPhone(raw: string): string {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("92")) digits = "0" + digits.slice(2);
  return digits;
}

/** Pakistani mobile numbers: 03xx xxxxxxx (11 digits, starts with 03). */
export function isValidPkPhone(raw: string): boolean {
  const digits = normalizePkPhone(raw);
  return /^03\d{9}$/.test(digits);
}

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim());
}

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  deliveryAddress: string;
};

/** Returns the first user-facing error message, or null when valid. */
export function validateCheckout(form: CheckoutInput): string | null {
  if (form.customerName.trim().length < 2) return "Please enter your full name.";
  if (!isValidPkPhone(form.customerPhone)) return "Enter a valid mobile number, e.g. 0301 2345678.";
  if (form.customerEmail.trim() && !isValidEmail(form.customerEmail)) return "Enter a valid email address or leave it empty.";
  if (form.city.trim().length < 2) return "Please enter your city.";
  if (form.deliveryAddress.trim().length < 10) return "Please enter a complete delivery address.";
  return null;
}
