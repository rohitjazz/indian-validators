/**
 * Indian PIN Code (Postal Index Number) Validator
 *
 * Format: 6 digits
 *   - First digit: postal zone (1–9, never 0)
 *   - Second digit: sub-zone
 *   - Third digit: sorting district
 *   - Last 3 digits: delivery post office
 *
 * Zone map (first digit):
 *   1 → Delhi, Haryana, Punjab, HP, J&K, Chandigarh
 *   2 → UP, Uttarakhand
 *   3 → Rajasthan, Gujarat
 *   4 → Maharashtra, Goa, MP, Chhattisgarh
 *   5 → AP, Telangana, Karnataka
 *   6 → Tamil Nadu, Kerala, Puducherry, Lakshadweep
 *   7 → West Bengal, Odisha, Assam, NE States, Andaman
 *   8 → Bihar, Jharkhand, Odisha
 *   9 → Army Post Office (APO/FPO)
 */

const PIN_REGEX = /^[1-9][0-9]{5}$/;

const ZONE_MAP: Record<string, string> = {
  "1": "Northern Zone (Delhi, Haryana, Punjab, HP, J&K)",
  "2": "Northern Zone (UP, Uttarakhand)",
  "3": "Western Zone (Rajasthan, Gujarat)",
  "4": "Western Zone (Maharashtra, Goa, MP, Chhattisgarh)",
  "5": "Southern Zone (AP, Telangana, Karnataka)",
  "6": "Southern Zone (Tamil Nadu, Kerala, Puducherry)",
  "7": "Eastern Zone (WB, Odisha, Assam, NE States)",
  "8": "Eastern Zone (Bihar, Jharkhand)",
  "9": "Army Postal Service",
};

export interface PincodeResult {
  valid: boolean;
  zone?: string;
  error?: string;
}

/**
 * Validates an Indian PIN code.
 *
 * @param pincode - The PIN code to validate (string or number)
 * @returns `{ valid: true, zone }` or `{ valid: false, error }`
 *
 * @example
 * validatePincode("400001") // { valid: true, zone: "Western Zone (Maharashtra...)" }
 * validatePincode("000001") // { valid: false, error: "PIN code cannot start with 0" }
 */
export function validatePincode(pincode: string | number): PincodeResult {
  if (pincode === null || pincode === undefined) {
    return { valid: false, error: "PIN code must be a non-empty value" };
  }

  const str = String(pincode).trim();

  if (str.length === 0) {
    return { valid: false, error: "PIN code must be a non-empty value" };
  }

  if (!/^\d+$/.test(str)) {
    return { valid: false, error: "PIN code must contain digits only" };
  }

  if (str.length !== 6) {
    return { valid: false, error: "PIN code must be exactly 6 digits" };
  }

  if (!PIN_REGEX.test(str)) {
    return { valid: false, error: "PIN code cannot start with 0" };
  }

  const zone = ZONE_MAP[str[0]];

  return { valid: true, zone };
}
