/**
 * GSTIN (Goods and Services Tax Identification Number) Validator
 *
 * Format: 22AAAAA0000A1Z5 (15 characters)
 *   Pos 1–2  : State code (01–38)
 *   Pos 3–12 : PAN of the taxpayer
 *   Pos 13   : Entity number (1–9, A–Z) — nth registration in that state
 *   Pos 14   : Always "Z"
 *   Pos 15   : Check digit (alphanumeric, computed via a mod-36 algorithm)
 */

// Map of valid Indian state/UT codes as of 2024
const STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman & Diu",
  "26": "Dadra & Nagar Haveli",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory",
  "99": "Centre Jurisdiction",
};

const GSTIN_REGEX =
  /^[0-9]{2}[A-Z]{3}[PCFHBGJTLA][A-Z]\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const CHECKSUM_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function computeGstCheckDigit(gstin14: string): string {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const val = CHECKSUM_CHARS.indexOf(gstin14[i]);
    const factor = i % 2 === 0 ? 1 : 2;
    const product = val * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  const remainder = sum % 36;
  return CHECKSUM_CHARS[(36 - remainder) % 36];
}

export interface GstResult {
  valid: boolean;
  state?: string;
  stateCode?: string;
  pan?: string;
  entityNumber?: string;
  error?: string;
}

/**
 * Validates a GSTIN (GST Identification Number).
 *
 * @param gstin - The GSTIN string to validate (case-insensitive)
 * @returns Full result object with parsed fields on success
 *
 * @example
 * validateGst("22AAAAA0000A1Z5")
 * // { valid: true, state: "Chhattisgarh", stateCode: "22", pan: "AAAAA0000A", entityNumber: "1" }
 */
export function validateGst(gstin: string): GstResult {
  if (!gstin || typeof gstin !== "string") {
    return { valid: false, error: "GSTIN must be a non-empty string" };
  }

  const normalized = gstin.trim().toUpperCase();

  if (normalized.length !== 15) {
    return { valid: false, error: "GSTIN must be exactly 15 characters" };
  }

  if (!GSTIN_REGEX.test(normalized)) {
    return {
      valid: false,
      error:
        "Invalid GSTIN format. Expected: 22AAAAA0000A1Z5",
    };
  }

  const stateCode = normalized.substring(0, 2);
  const state = STATE_CODES[stateCode];

  if (!state) {
    return { valid: false, error: `Invalid state code: ${stateCode}` };
  }

  const expectedCheck = computeGstCheckDigit(normalized.substring(0, 14));
  if (normalized[14] !== expectedCheck) {
    return {
      valid: false,
      error: `Invalid GSTIN: checksum mismatch (expected ${expectedCheck})`,
    };
  }

  return {
    valid: true,
    stateCode,
    state,
    pan: normalized.substring(2, 12),
    entityNumber: normalized[12],
  };
}
