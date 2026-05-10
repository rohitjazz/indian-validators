/**
 * indian-validators
 *
 * Zero-dependency, fully-typed validators for Indian identifiers.
 * Validates format and structure — does not make network calls.
 *
 * @module indian-validators
 */

export { validatePan } from "./pan";
export type { PanResult, PanType } from "./pan";

export { validateAadhaar } from "./aadhaar";
export type { AadhaarResult } from "./aadhaar";

export { validateGst } from "./gst";
export type { GstResult } from "./gst";

export { validateIfsc } from "./ifsc";
export type { IfscResult } from "./ifsc";

export { validatePincode } from "./pincode";
export type { PincodeResult } from "./pincode";

export { validatePhone } from "./phone";
export type { PhoneResult } from "./phone";

export { validateUpi } from "./upi";
export type { UpiResult } from "./upi";
