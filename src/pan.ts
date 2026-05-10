/**
 * PAN (Permanent Account Number) Validator
 *
 * Format: AAAAA9999A
 *   - Characters 1–3: Any uppercase letter (AAA)
 *   - Character 4:    Taxpayer type code (see PAN_TYPE_CODES)
 *   - Character 5:    First letter of surname / entity name
 *   - Characters 6–9: Sequential 4-digit number
 *   - Character 10:   Alphabetic check character
 */

export type PanType =
  | "individual"
  | "company"
  | "huf"
  | "firm"
  | "aop"
  | "trust"
  | "boi"
  | "local_authority"
  | "artificial_juridical"
  | "government";

const PAN_TYPE_CODES: Record<string, PanType> = {
  P: "individual",
  C: "company",
  H: "huf",
  F: "firm",
  A: "aop",
  T: "trust",
  B: "boi",
  L: "local_authority",
  J: "artificial_juridical",
  G: "government",
};

const PAN_REGEX = /^[A-Z]{3}[PCFHBGJTLA][A-Z]\d{4}[A-Z]$/;

export interface PanResult {
  valid: boolean;
  type?: PanType;
  error?: string;
}

/**
 * Validates an Indian PAN card number.
 *
 * @param pan - The PAN string to validate (case-insensitive)
 * @returns `{ valid: true, type }` on success, `{ valid: false, error }` on failure
 *
 * @example
 * validatePan("ABCPD1234E") // { valid: true, type: "individual" }
 * validatePan("1234")       // { valid: false, error: "PAN must be exactly 10 characters" }
 */
export function validatePan(pan: string): PanResult {
  if (!pan || typeof pan !== "string") {
    return { valid: false, error: "PAN must be a non-empty string" };
  }

  const normalized = pan.trim().toUpperCase();

  if (normalized.length !== 10) {
    return { valid: false, error: "PAN must be exactly 10 characters" };
  }

  if (!PAN_REGEX.test(normalized)) {
    return {
      valid: false,
      error:
        "Invalid PAN format. Expected format: AAAAA9999A (e.g. ABCDE1234F)",
    };
  }

  const typeChar = normalized[3];
  const type = PAN_TYPE_CODES[typeChar];

  return { valid: true, type };
}
