import { validateAadhaar } from "../src/aadhaar";

describe("validateAadhaar", () => {
  describe("valid Aadhaar numbers", () => {
    // These pass Verhoeff and first-digit rules
    it("validates a 12-digit number that passes Verhoeff", () => {
      // Verhoeff-valid test number from public test vectors
      const result = validateAadhaar("234123412346");
      expect(result.valid).toBe(true);
    });

    it("accepts space-separated format", () => {
      const result = validateAadhaar("2341 2341 2346");
      expect(result.valid).toBe(true);
    });

    it("accepts hyphen-separated format", () => {
      const result = validateAadhaar("2341-2341-2346");
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid Aadhaar numbers", () => {
    it("rejects empty string", () => {
      const result = validateAadhaar("");
      expect(result.valid).toBe(false);
    });

    it("rejects number starting with 0", () => {
      const result = validateAadhaar("034123412346");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("0 or 1");
    });

    it("rejects number starting with 1", () => {
      const result = validateAadhaar("134123412346");
      expect(result.valid).toBe(false);
    });

    it("rejects fewer than 12 digits", () => {
      const result = validateAadhaar("23412341234");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("12 digits");
    });

    it("rejects more than 12 digits", () => {
      const result = validateAadhaar("2341234123456");
      expect(result.valid).toBe(false);
    });

    it("rejects non-numeric characters", () => {
      const result = validateAadhaar("23412341234A");
      expect(result.valid).toBe(false);
    });

    it("rejects a number that fails Verhoeff checksum", () => {
      // Correct: 234123412346, so changing last digit should fail
      const result = validateAadhaar("234123412347");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("checksum");
    });

    it("rejects non-string input", () => {
      // @ts-expect-error testing runtime guard
      const result = validateAadhaar(null);
      expect(result.valid).toBe(false);
    });
  });
});
