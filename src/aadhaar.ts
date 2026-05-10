/**
 * Aadhaar Number Validator
 *
 * Rules:
 *  - Exactly 12 digits
 *  - First digit must not be 0 or 1
 *  - Passes the Verhoeff check digit algorithm (as used by UIDAI)
 *
 * NOTE: This library only validates the *format* of an Aadhaar number.
 *       It does not verify whether the number is issued by UIDAI or
 *       belongs to a real person. Never store or log Aadhaar numbers.
 */

// Verhoeff algorithm lookup tables
const VERHOEFF_D: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const VERHOEFF_INV: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function verhoeffCheck(digits: string): boolean {
  let c = 0;
  const reversed = digits.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    const digit = parseInt(reversed[i], 10);
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]];
  }
  return VERHOEFF_INV[c] === 0;
}

// Strips common separators people use when typing Aadhaar: spaces and hyphens
function normalizeAadhaar(input: string): string {
  return input.replace(/[\s\-]/g, "");
}

export interface AadhaarResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an Indian Aadhaar number.
 * Accepts plain 12-digit strings or space/hyphen-separated variants
 * (e.g. "1234 5678 9012" or "1234-5678-9012").
 *
 * @param aadhaar - The Aadhaar string to validate
 * @returns `{ valid: true }` or `{ valid: false, error }`
 *
 * @example
 * validateAadhaar("234123412346") // { valid: true }
 * validateAadhaar("1234 5678 9012") // evaluated after stripping spaces
 */
export function validateAadhaar(aadhaar: string): AadhaarResult {
  if (!aadhaar || typeof aadhaar !== "string") {
    return { valid: false, error: "Aadhaar must be a non-empty string" };
  }

  const normalized = normalizeAadhaar(aadhaar.trim());

  if (!/^\d+$/.test(normalized)) {
    return { valid: false, error: "Aadhaar must contain digits only" };
  }

  if (normalized.length !== 12) {
    return { valid: false, error: "Aadhaar must be exactly 12 digits" };
  }

  if (normalized[0] === "0" || normalized[0] === "1") {
    return {
      valid: false,
      error: "Aadhaar cannot start with 0 or 1",
    };
  }

  if (!verhoeffCheck(normalized)) {
    return { valid: false, error: "Invalid Aadhaar: checksum mismatch" };
  }

  return { valid: true };
}
