import { validateIfsc } from "../src/ifsc";

describe("validateIfsc", () => {
  describe("valid IFSC codes", () => {
    it("validates SBI IFSC", () => {
      const result = validateIfsc("SBIN0001234");
      expect(result.valid).toBe(true);
      expect(result.bankCode).toBe("SBIN");
      expect(result.bankName).toBe("State Bank of India");
      expect(result.branchCode).toBe("001234");
    });

    it("validates HDFC IFSC", () => {
      const result = validateIfsc("HDFC0001234");
      expect(result.valid).toBe(true);
      expect(result.bankCode).toBe("HDFC");
      expect(result.bankName).toBe("HDFC Bank");
    });

    it("validates ICICI IFSC", () => {
      const result = validateIfsc("ICIC0001234");
      expect(result.valid).toBe(true);
      expect(result.bankCode).toBe("ICIC");
    });

    it("is case-insensitive", () => {
      const result = validateIfsc("sbin0001234");
      expect(result.valid).toBe(true);
    });

    it("validates unknown bank without bankName", () => {
      const result = validateIfsc("ZZZZ0AAAAAA");
      expect(result.valid).toBe(true);
      expect(result.bankName).toBeUndefined();
    });

    it("handles alphanumeric branch codes", () => {
      const result = validateIfsc("SBIN0ABC123");
      expect(result.valid).toBe(true);
      expect(result.branchCode).toBe("ABC123");
    });
  });

  describe("invalid IFSC codes", () => {
    it("rejects empty string", () => {
      const result = validateIfsc("");
      expect(result.valid).toBe(false);
    });

    it("rejects wrong length (short)", () => {
      const result = validateIfsc("SBIN001234");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("11 characters");
    });

    it("rejects wrong length (long)", () => {
      const result = validateIfsc("SBIN00012345");
      expect(result.valid).toBe(false);
    });

    it("rejects when 5th character is not 0", () => {
      const result = validateIfsc("SBIN1001234");
      expect(result.valid).toBe(false);
    });

    it("rejects digits in bank code", () => {
      const result = validateIfsc("SB1N0001234");
      expect(result.valid).toBe(false);
    });

    it("rejects non-string input", () => {
      // @ts-expect-error testing runtime guard
      const result = validateIfsc(undefined);
      expect(result.valid).toBe(false);
    });
  });
});
