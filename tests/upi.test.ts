import { validateUpi } from "../src/upi";

describe("validateUpi", () => {
  describe("valid UPI IDs", () => {
    it("validates name-based UPI ID", () => {
      const result = validateUpi("someone@okicici");
      expect(result.valid).toBe(true);
      expect(result.identifier).toBe("someone");
      expect(result.handle).toBe("okicici");
      expect(result.provider).toBe("Google Pay (ICICI)");
    });

    it("validates phone-number-based UPI ID", () => {
      const result = validateUpi("9876543210@paytm");
      expect(result.valid).toBe(true);
      expect(result.identifier).toBe("9876543210");
      expect(result.handle).toBe("paytm");
      expect(result.provider).toBe("Paytm");
    });

    it("validates UPI with dot in identifier", () => {
      const result = validateUpi("ranjit.kumar@ybl");
      expect(result.valid).toBe(true);
      expect(result.provider).toContain("PhonePe");
    });

    it("validates UPI with underscore", () => {
      const result = validateUpi("ranjit_dev@oksbi");
      expect(result.valid).toBe(true);
    });

    it("is case-insensitive (normalizes to lowercase)", () => {
      const result = validateUpi("Ranjit@PAYTM");
      expect(result.valid).toBe(true);
      expect(result.handle).toBe("paytm");
    });

    it("validates unknown PSP handle (no provider returned)", () => {
      const result = validateUpi("user@unknownbank");
      expect(result.valid).toBe(true);
      expect(result.provider).toBeUndefined();
    });
  });

  describe("invalid UPI IDs", () => {
    it("rejects empty string", () => {
      const result = validateUpi("");
      expect(result.valid).toBe(false);
    });

    it("rejects UPI without @", () => {
      const result = validateUpi("someoneatpaytm");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("@");
    });

    it("rejects UPI with multiple @", () => {
      const result = validateUpi("a@b@c");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("exactly one");
    });

    it("rejects identifier shorter than 3 characters", () => {
      const result = validateUpi("ab@paytm");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("3 characters");
    });

    it("rejects handle shorter than 2 characters", () => {
      const result = validateUpi("user@a");
      expect(result.valid).toBe(false);
    });

    it("rejects handle starting with a digit", () => {
      const result = validateUpi("user@1paytm");
      expect(result.valid).toBe(false);
    });

    it("rejects UPI exceeding 256 characters", () => {
      const longId = "a".repeat(251) + "@paytm";
      const result = validateUpi(longId);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("256");
    });

    it("rejects non-string input", () => {
      // @ts-expect-error testing runtime guard
      const result = validateUpi(null);
      expect(result.valid).toBe(false);
    });
  });
});
