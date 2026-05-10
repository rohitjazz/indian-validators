/**
 * Indian Mobile Phone Number Validator
 *
 * Rules:
 *  - 10 digits after stripping country code / leading zero
 *  - Must start with 6, 7, 8, or 9
 *  - Accepts formats: 9876543210, +919876543210, 919876543210, 09876543210
 *
 * Operator series map (first two digits):
 *   60–62 → Jio
 *   70–79 → Various (Airtel, BSNL, etc.)
 *   80–89 → Various
 *   90–99 → Various
 */

const OPERATOR_SERIES: Array<{ prefix: string; operator: string }> = [
  { prefix: "60", operator: "Jio" },
  { prefix: "61", operator: "Jio" },
  { prefix: "62", operator: "Jio" },
  { prefix: "63", operator: "Jio" },
  { prefix: "64", operator: "Jio" },
  { prefix: "65", operator: "Jio" },
  { prefix: "66", operator: "Jio" },
  { prefix: "67", operator: "Jio" },
  { prefix: "68", operator: "Jio" },
  { prefix: "69", operator: "Jio" },
  { prefix: "70", operator: "BSNL" },
  { prefix: "71", operator: "Airtel" },
  { prefix: "72", operator: "Airtel" },
  { prefix: "73", operator: "Airtel" },
  { prefix: "74", operator: "Airtel" },
  { prefix: "75", operator: "Vi (Vodafone Idea)" },
  { prefix: "76", operator: "Vi (Vodafone Idea)" },
  { prefix: "77", operator: "Vi (Vodafone Idea)" },
  { prefix: "78", operator: "Airtel" },
  { prefix: "79", operator: "BSNL" },
  { prefix: "80", operator: "Vi (Vodafone Idea)" },
  { prefix: "81", operator: "Airtel" },
  { prefix: "82", operator: "Airtel" },
  { prefix: "83", operator: "Airtel" },
  { prefix: "84", operator: "Vi (Vodafone Idea)" },
  { prefix: "85", operator: "Vi (Vodafone Idea)" },
  { prefix: "86", operator: "Airtel" },
  { prefix: "87", operator: "Vi (Vodafone Idea)" },
  { prefix: "88", operator: "Airtel" },
  { prefix: "89", operator: "BSNL" },
  { prefix: "90", operator: "Airtel" },
  { prefix: "91", operator: "Airtel" },
  { prefix: "92", operator: "Airtel" },
  { prefix: "93", operator: "Airtel" },
  { prefix: "94", operator: "BSNL" },
  { prefix: "95", operator: "Vi (Vodafone Idea)" },
  { prefix: "96", operator: "Vi (Vodafone Idea)" },
  { prefix: "97", operator: "Jio" },
  { prefix: "98", operator: "Airtel" },
  { prefix: "99", operator: "Airtel" },
];

function stripCountryCode(raw: string): string {
  // Remove all non-digit characters except leading +
  let s = raw.trim();

  // Remove leading +
  if (s.startsWith("+")) {
    s = s.substring(1);
  }

  // Remove country code 91 if present (must be followed by 10 digits starting with 6-9)
  if (s.startsWith("91") && s.length === 12 && /^[6-9]/.test(s[2])) {
    return s.substring(2);
  }

  // Remove leading 0
  if (s.startsWith("0") && s.length === 11) {
    return s.substring(1);
  }

  return s;
}

export interface PhoneResult {
  valid: boolean;
  normalized?: string;
  e164?: string;
  operator?: string;
  error?: string;
}

/**
 * Validates an Indian mobile phone number.
 * Accepts multiple formats including +91, 91, and leading 0.
 *
 * @param phone - The phone number string to validate
 * @returns `{ valid: true, normalized, e164, operator? }` or `{ valid: false, error }`
 *
 * @example
 * validatePhone("+919876543210")
 * // { valid: true, normalized: "9876543210", e164: "+919876543210", operator: "Airtel" }
 *
 * validatePhone("09876543210")
 * // { valid: true, normalized: "9876543210", e164: "+919876543210" }
 */
export function validatePhone(phone: string): PhoneResult {
  if (!phone || typeof phone !== "string") {
    return { valid: false, error: "Phone number must be a non-empty string" };
  }

  // Strip spaces, dashes, dots (common user formatting)
  const stripped = phone.replace(/[\s\-.()\u00A0]/g, "");
  const digits = stripCountryCode(stripped);

  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: "Phone number contains invalid characters" };
  }

  if (digits.length !== 10) {
    return {
      valid: false,
      error: `Phone number must be 10 digits (got ${digits.length})`,
    };
  }

  if (!/^[6-9]/.test(digits)) {
    return {
      valid: false,
      error: "Indian mobile numbers must start with 6, 7, 8, or 9",
    };
  }

  const prefix = digits.substring(0, 2);
  const entry = OPERATOR_SERIES.find((o) => o.prefix === prefix);

  return {
    valid: true,
    normalized: digits,
    e164: `+91${digits}`,
    ...(entry ? { operator: entry.operator } : {}),
  };
}
