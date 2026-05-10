import { validatePincode } from "../src/pincode";

describe("validatePincode", () => {
  describe("valid PIN codes", () => {
    it("validates Mumbai PIN code", () => {
      const result = validatePincode("400001");
      expect(result.valid).toBe(true);
      expect(result.zone).toContain("Maharashtra");
    });

    it("validates Delhi PIN code", () => {
      const result = validatePincode("110001");
      expect(result.valid).toBe(true);
      expect(result.zone).toContain("Delhi");
    });

    it("accepts numeric input", () => {
      const result = validatePincode(400001);
      expect(result.valid).toBe(true);
    });

    it("trims whitespace", () => {
      const result = validatePincode("  400001  ");
      expect(result.valid).toBe(true);
    });

    it("validates APO PIN (starts with 9)", () => {
      const result = validatePincode("900001");
      expect(result.valid).toBe(true);
      expect(result.zone).toContain("Army");
    });
  });

  describe("invalid PIN codes", () => {
    it("rejects PIN starting with 0", () => {
      const result = validatePincode("000001");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("0");
    });

    it("rejects 5-digit PIN", () => {
      const result = validatePincode("40000");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("6 digits");
    });

    it("rejects 7-digit PIN", () => {
      const result = validatePincode("4000001");
      expect(result.valid).toBe(false);
    });

    it("rejects alphabetic input", () => {
      const result = validatePincode("40000A");
      expect(result.valid).toBe(false);
    });

    it("rejects empty string", () => {
      const result = validatePincode("");
      expect(result.valid).toBe(false);
    });

    it("rejects null", () => {
      // @ts-expect-error testing runtime guard
      const result = validatePincode(null);
      expect(result.valid).toBe(false);
    });
  });
});
