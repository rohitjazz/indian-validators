/**
 * UPI ID (Virtual Payment Address) Validator
 *
 * Format: <identifier>@<handle>
 *   identifier : mobile number, email-like, or a random string (min 3, max 256 chars)
 *   @          : mandatory separator
 *   handle     : the bank/PSP handle (e.g. okaxis, paytm, upi, ybl)
 *
 * Rules defined by NPCI:
 *   - Total length: 3–256 characters
 *   - Exactly one "@" symbol
 *   - Handle part: lowercase alphanumeric, dots allowed, min 2 chars
 */

// NPCI-registered handles (non-exhaustive but covers 99% of real-world usage)
const KNOWN_HANDLES: Record<string, string> = {
  upi: "BHIM UPI",
  ybl: "PhonePe (Yes Bank)",
  ibl: "PhonePe (ICICI Bank)",
  axl: "PhonePe (Axis Bank)",
  okhdfcbank: "Google Pay (HDFC)",
  okicici: "Google Pay (ICICI)",
  oksbi: "Google Pay (SBI)",
  okaxis: "Google Pay (Axis)",
  paytm: "Paytm",
  ptyes: "Paytm (Yes Bank)",
  ptsbi: "Paytm (SBI)",
  pthdfc: "Paytm (HDFC)",
  apl: "Amazon Pay",
  rapl: "Amazon Pay",
  freecharge: "Freecharge",
  mahb: "Bank of Maharashtra",
  sbi: "SBI Pay",
  hdfcbank: "HDFC Bank",
  icici: "ICICI Bank",
  axisbank: "Axis Bank",
  kotak: "Kotak Mahindra Bank",
  rbl: "RBL Bank",
  federal: "Federal Bank",
  indus: "IndusInd Bank",
  idfc: "IDFC First Bank",
  juspay: "JusPay",
  ikwik: "MobiKwik",
  hsbc: "HSBC Bank",
  citi: "Citibank",
  barodampay: "Bank of Baroda",
  cub: "City Union Bank",
  dbs: "DBS Bank",
  dlb: "Dhanlaxmi Bank",
  kvb: "Karur Vysya Bank",
  lvb: "Lakshmi Vilas Bank",
  scb: "Standard Chartered Bank",
  tjsb: "TJSB Bank",
  uco: "UCO Bank",
  unionbank: "Union Bank of India",
  vijb: "Vijaya Bank",
  yesbankltd: "Yes Bank",
};

// The identifier part allows a broad set — alphanumeric, dot, underscore, hyphen
const UPI_IDENTIFIER_REGEX = /^[a-zA-Z0-9.\-_+]{3,}$/;
const UPI_HANDLE_REGEX = /^[a-zA-Z][a-zA-Z0-9.]{1,}$/;

export interface UpiResult {
  valid: boolean;
  identifier?: string;
  handle?: string;
  provider?: string;
  error?: string;
}

/**
 * Validates a UPI Virtual Payment Address (VPA).
 *
 * @param upi - The UPI ID string to validate
 * @returns Parsed result with identifier, handle, and provider name where known
 *
 * @example
 * validateUpi("someone@okicici")
 * // { valid: true, identifier: "someone", handle: "okicici", provider: "Google Pay (ICICI)" }
 *
 * validateUpi("9876543210@paytm")
 * // { valid: true, identifier: "9876543210", handle: "paytm", provider: "Paytm" }
 */
export function validateUpi(upi: string): UpiResult {
  if (!upi || typeof upi !== "string") {
    return { valid: false, error: "UPI ID must be a non-empty string" };
  }

  const trimmed = upi.trim().toLowerCase();

  if (trimmed.length > 256) {
    return { valid: false, error: "UPI ID must not exceed 256 characters" };
  }

  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount === 0) {
    return { valid: false, error: 'UPI ID must contain "@" symbol' };
  }
  if (atCount > 1) {
    return { valid: false, error: 'UPI ID must contain exactly one "@" symbol' };
  }

  const [identifier, handle] = trimmed.split("@");

  if (!identifier || identifier.length < 3) {
    return {
      valid: false,
      error: "UPI identifier (before @) must be at least 3 characters",
    };
  }

  if (!UPI_IDENTIFIER_REGEX.test(identifier)) {
    return {
      valid: false,
      error:
        "UPI identifier contains invalid characters. Allowed: letters, digits, dot, hyphen, underscore, +",
    };
  }

  if (!handle || handle.length < 2) {
    return {
      valid: false,
      error: "UPI handle (after @) must be at least 2 characters",
    };
  }

  if (!UPI_HANDLE_REGEX.test(handle)) {
    return {
      valid: false,
      error:
        "UPI handle contains invalid characters. Must start with a letter and contain only letters, digits, or dots",
    };
  }

  const provider = KNOWN_HANDLES[handle];

  return {
    valid: true,
    identifier,
    handle,
    ...(provider ? { provider } : {}),
  };
}
