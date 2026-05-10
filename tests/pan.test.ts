import { validatePan } from "../src/pan";

describe("validatePan", () => {
  describe("valid PANs", () => {
    it("validates a standard individual PAN", () => {
      const result = validatePan("ABCPD1234E");
      expect(result.valid).toBe(true);
      expect(result.type).toBe("individual");
    });

    it("validates a company PAN", () => {
      const result = validatePan("AABCT1332Q"); // type char C = company
      expect(result.valid).toBe(true);
      expect(result.type).toBe("company");
    });

    it("validates an HUF PAN", () => {
      const result = validatePan("AAAHA1332Q"); // 4th char H = HUF
      expect(result.valid).toBe(true);
      expect(result.type).toBe("huf");
    });

    it("is case-insensitive", () => {
      const result = validatePan("abcpd1234e");
      expect(result.valid).toBe(true);
    });

    it("trims whitespace before validating", () => {
      const result = validatePan("  ABCPD1234E  ");
      expect(result.valid).toBe(true);
    });
  });

  describe("invalid PANs", () => {
    it("rejects empty string", () => {
      const result = validatePan("");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("rejects wrong length (short)", () => {
      const result = validatePan("ABCD1234E");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("10 characters");
    });

    it("rejects wrong length (long)", () => {
      const result = validatePan("ABCPD1234EX");
      expect(result.valid).toBe(false);
    });

    it("rejects invalid type character", () => {
      // 4th character must be one of P,C,F,H,B,G,J,T,L,A
      const result = validatePan("ABCXD1234E");
      expect(result.valid).toBe(false);
    });

    it("rejects digits in first 3 positions", () => {
      const result = validatePan("1BCPD1234E");
      expect(result.valid).toBe(false);
    });

    it("rejects letters where digits expected", () => {
      const result = validatePan("ABCPDABCDE");
      expect(result.valid).toBe(false);
    });

    it("rejects non-string input", () => {
      // @ts-expect-error testing runtime guard
      const result = validatePan(null);
      expect(result.valid).toBe(false);
    });
  });
});
