# indian-validators

[![npm version](https://img.shields.io/npm/v/indian-validators.svg)](https://www.npmjs.com/package/indian-validators)
[![bundle size](https://img.shields.io/bundlephobia/minzip/indian-validators)](https://bundlephobia.com/package/indian-validators)
[![tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/rohitjazz/indian-validators)
[![license](https://img.shields.io/npm/l/indian-validators)](LICENSE)

> Zero-dependency, fully-typed validators for Indian identifiers — PAN, Aadhaar, GST, IFSC, PIN Code, Phone, UPI.

No network calls. No external dependencies. Works in Node.js, browsers, and any TypeScript/JavaScript project.

---

## Install

```bash
npm install indian-validators
# or
yarn add indian-validators
# or
pnpm add indian-validators
```

---

## Quick Start

```ts
import {
  validatePan,
  validateAadhaar,
  validateGst,
  validateIfsc,
  validatePincode,
  validatePhone,
  validateUpi,
} from "indian-validators";

validatePan("ABCPD1234E");
// { valid: true, type: "individual" }

validatePhone("+919876543210");
// { valid: true, normalized: "9876543210", e164: "+919876543210", operator: "Airtel" }

validateUpi("someone@okicici");
// { valid: true, identifier: "someone", handle: "okicici", provider: "Google Pay (ICICI)" }
```

---

## API

All validators return an object with `valid: boolean`. On failure, an `error` string explains what went wrong. On success, additional parsed fields are returned.

---

### `validatePan(pan: string): PanResult`

Validates a PAN (Permanent Account Number) card.

**Format:** `AAAAA9999A` — 5 letters, 4 digits, 1 letter. The 4th character encodes the taxpayer type.

```ts
validatePan("ABCPD1234E")
// { valid: true, type: "individual" }

validatePan("AABCT1332Q")
// { valid: true, type: "company" }

validatePan("ABCD123")
// { valid: false, error: "PAN must be exactly 10 characters" }
```

**PAN types:** `individual` | `company` | `huf` | `firm` | `aop` | `trust` | `boi` | `local_authority` | `artificial_juridical` | `government`

---

### `validateAadhaar(aadhaar: string): AadhaarResult`

Validates an Aadhaar number including the Verhoeff checksum algorithm used by UIDAI.

Accepts plain 12-digit strings, or space/hyphen-separated formats.

> ⚠️ This validates **format only**. Never store or log Aadhaar numbers in your application.

```ts
validateAadhaar("234123412346")
// { valid: true }

validateAadhaar("2341 2341 2346")
// { valid: true }

validateAadhaar("034123412346")
// { valid: false, error: "Aadhaar cannot start with 0 or 1" }

validateAadhaar("234123412347")
// { valid: false, error: "Invalid Aadhaar: checksum mismatch" }
```

---

### `validateGst(gstin: string): GstResult`

Validates a GSTIN (Goods and Services Tax Identification Number) including state code lookup and mod-36 checksum.

**Format:** `22AAAAA0000A1Z5` — 2-digit state code + 10-char PAN + entity number + Z + check digit.

```ts
validateGst("22AAAAA0000A1Z5")
// {
//   valid: true,
//   stateCode: "22",
//   state: "Chhattisgarh",
//   pan: "AAAAA0000A",
//   entityNumber: "1"
// }

validateGst("22AAAAA0000A1Z9")
// { valid: false, error: "Invalid GSTIN: checksum mismatch (expected 5)" }
```

---

### `validateIfsc(ifsc: string): IfscResult`

Validates an IFSC (Indian Financial System Code).

**Format:** `SBIN0001234` — 4-letter bank code + `0` + 6-char branch code.

```ts
validateIfsc("SBIN0001234")
// {
//   valid: true,
//   bankCode: "SBIN",
//   bankName: "State Bank of India",
//   branchCode: "001234"
// }

validateIfsc("HDFC0001234")
// { valid: true, bankCode: "HDFC", bankName: "HDFC Bank", branchCode: "001234" }

validateIfsc("SBIN1001234")
// { valid: false, error: "Invalid IFSC format..." }
```

---

### `validatePincode(pincode: string | number): PincodeResult`

Validates an Indian PIN code (Postal Index Number).

**Format:** 6 digits, first digit 1–9 (never 0).

```ts
validatePincode("400001")
// { valid: true, zone: "Western Zone (Maharashtra, Goa, MP, Chhattisgarh)" }

validatePincode(110001)
// { valid: true, zone: "Northern Zone (Delhi, Haryana, Punjab, HP, J&K)" }

validatePincode("000001")
// { valid: false, error: "PIN code cannot start with 0" }
```

---

### `validatePhone(phone: string): PhoneResult`

Validates an Indian mobile number. Accepts multiple common formats.

**Accepted formats:** `9876543210`, `+919876543210`, `919876543210`, `09876543210`

```ts
validatePhone("+919876543210")
// { valid: true, normalized: "9876543210", e164: "+919876543210", operator: "Airtel" }

validatePhone("6012345678")
// { valid: true, normalized: "6012345678", e164: "+916012345678", operator: "Jio" }

validatePhone("1234567890")
// { valid: false, error: "Indian mobile numbers must start with 6, 7, 8, or 9" }
```

---

### `validateUpi(upi: string): UpiResult`

Validates a UPI Virtual Payment Address (VPA).

**Format:** `identifier@handle` — e.g. `name@paytm`, `9876543210@okicici`

```ts
validateUpi("someone@okicici")
// { valid: true, identifier: "someone", handle: "okicici", provider: "Google Pay (ICICI)" }

validateUpi("9876543210@paytm")
// { valid: true, identifier: "9876543210", handle: "paytm", provider: "Paytm" }

validateUpi("ranjit.kumar@ybl")
// { valid: true, identifier: "ranjit.kumar", handle: "ybl", provider: "PhonePe (Yes Bank)" }

validateUpi("missingat")
// { valid: false, error: 'UPI ID must contain "@" symbol' }
```

---

## TypeScript Types

All return types are exported:

```ts
import type {
  PanResult, PanType,
  AadhaarResult,
  GstResult,
  IfscResult,
  PincodeResult,
  PhoneResult,
  UpiResult,
} from "indian-validators";
```

---

## Why This Library

Every Indian startup's dev team writes these validators from scratch. This library aims to be the definitive, well-tested, zero-dependency solution so you never have to write `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` again.

- ✅ Validates format **and** checksums (Aadhaar Verhoeff, GST mod-36)
- ✅ Returns structured data, not just `true/false`
- ✅ Full TypeScript types, zero `any`
- ✅ Zero runtime dependencies
- ✅ Works in Node.js, browsers, and edge runtimes
- ✅ ~4KB minzipped

---

## Contributing

PRs welcome! If you find an edge case or want to add a new validator (Vehicle Registration, Voter ID, Driving Licence, etc.), open an issue first.

```bash
git clone https://github.com/rohitjazz/indian-validators
cd indian-validators
npm install
npm test
```

---

## License

MIT © Ranjit Singh
