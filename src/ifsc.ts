/**
 * IFSC (Indian Financial System Code) Validator
 *
 * Format: AAAA0BBBBBB (11 characters)
 *   Pos 1–4  : Bank code (uppercase letters, e.g. SBIN for SBI)
 *   Pos 5    : Always "0" (reserved for future use)
 *   Pos 6–11 : Branch code (alphanumeric)
 */

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Partial list of known bank codes for basic sanity check (not exhaustive)
const KNOWN_BANK_CODES: Record<string, string> = {
  SBIN: "State Bank of India",
  HDFC: "HDFC Bank",
  ICIC: "ICICI Bank",
  PUNB: "Punjab National Bank",
  UBIN: "Union Bank of India",
  BARB: "Bank of Baroda",
  CNRB: "Canara Bank",
  KKBK: "Kotak Mahindra Bank",
  AXIS: "Axis Bank",
  IOBA: "Indian Overseas Bank",
  IDIB: "Indian Bank",
  BKID: "Bank of India",
  CBIN: "Central Bank of India",
  ALLA: "Allahabad Bank",
  ANDB: "Andhra Bank",
  CORP: "Corporation Bank",
  DENA: "Dena Bank",
  ORBC: "Oriental Bank of Commerce",
  VIJB: "Vijaya Bank",
  UTBI: "United Bank of India",
  MAHB: "Bank of Maharashtra",
  PSIB: "Punjab & Sind Bank",
  UCBA: "UCO Bank",
  RATN: "RBL Bank",
  FDRL: "Federal Bank",
  KARB: "Karnataka Bank",
  KVBL: "Karur Vysya Bank",
  LAKH: "Lakshmi Vilas Bank",
  SRCB: "Saraswat Cooperative Bank",
  YESB: "Yes Bank",
  IDFC: "IDFC First Bank",
  INDB: "IndusInd Bank",
  CSBN: "City Union Bank",
  DCBL: "DCB Bank",
  NKGS: "NKGSB Cooperative Bank",
  PMCB: "PMC Bank",
  TMBL: "Tamilnad Mercantile Bank",
};

export interface IfscResult {
  valid: boolean;
  bankCode?: string;
  bankName?: string;
  branchCode?: string;
  error?: string;
}

/**
 * Validates an IFSC code.
 *
 * @param ifsc - The IFSC string to validate (case-insensitive)
 * @returns Result with parsed bank and branch info where available
 *
 * @example
 * validateIfsc("SBIN0001234")
 * // { valid: true, bankCode: "SBIN", bankName: "State Bank of India", branchCode: "001234" }
 */
export function validateIfsc(ifsc: string): IfscResult {
  if (!ifsc || typeof ifsc !== "string") {
    return { valid: false, error: "IFSC must be a non-empty string" };
  }

  const normalized = ifsc.trim().toUpperCase();

  if (normalized.length !== 11) {
    return { valid: false, error: "IFSC must be exactly 11 characters" };
  }

  if (!IFSC_REGEX.test(normalized)) {
    return {
      valid: false,
      error:
        "Invalid IFSC format. Expected: 4 letters + '0' + 6 alphanumeric (e.g. SBIN0001234)",
    };
  }

  const bankCode = normalized.substring(0, 4);
  const branchCode = normalized.substring(5);
  const bankName = KNOWN_BANK_CODES[bankCode];

  return {
    valid: true,
    bankCode,
    branchCode,
    ...(bankName ? { bankName } : {}),
  };
}
