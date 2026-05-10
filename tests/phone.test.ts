import { validatePhone } from "../src/phone";

describe("validatePhone", () => {
  describe("valid phone numbers", () => {
    it("validates plain 10-digit number", () => {
      const result = validatePhone("9876543210");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe("9876543210");
      expect(result.e164).toBe("+919876543210");
    });

    it("validates with +91 prefix", () => {
      const result = validatePhone("+919876543210");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe("9876543210");
    });

    it("validates with 91 prefix (no +)", () => {
      const result = validatePhone("919876543210");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe("9876543210");
    });

    it("validates with leading 0", () => {
      const result = validatePhone("09876543210");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe("9876543210");
    });

    it("strips spaces and dashes", () => {
      const result = validatePhone("98765 43210");
      expect(result.valid).toBe(true);
    });

    it("detects operator for known series", () => {
      const result = validatePhone("9871234567");
      expect(result.valid).toBe(true);
      expect(result.operator).toBeDefined();
    });

    it("validates Jio number (6x series)", () => {
      const result = validatePhone("6012345678");
      expect(result.valid).toBe(true);
      expect(result.operator).toBe("Jio");
    });

    it("validates number starting with 7", () => {
      const result = validatePhone("7012345678");
      expect(result.valid).toBe(true);
    });

    it("validates number starting with 8", () => {
      const result = validatePhone("8012345678");
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid phone numbers", () => {
    it("rejects number starting with 5", () => {
      const result = validatePhone("5876543210");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("6, 7, 8, or 9");
    });

    it("rejects number starting with 1", () => {
      const result = validatePhone("1876543210");
      expect(result.valid).toBe(false);
    });

    it("rejects 9-digit number", () => {
      const result = validatePhone("987654321");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("10 digits");
    });

    it("rejects 11-digit number without country code", () => {
      const result = validatePhone("98765432101");
      expect(result.valid).toBe(false);
    });

    it("rejects alphabetic characters", () => {
      const result = validatePhone("98765ABCDE");
      expect(result.valid).toBe(false);
    });

    it("rejects empty string", () => {
      const result = validatePhone("");
      expect(result.valid).toBe(false);
    });

    it("rejects non-string input", () => {
      // @ts-expect-error testing runtime guard
      const result = validatePhone(null);
      expect(result.valid).toBe(false);
    });
  });
});
