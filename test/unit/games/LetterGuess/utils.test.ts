import { describe, expect, it } from "vitest";

import { isLetter } from "../../../../src/games/LetterGuess/utils";

describe("isLetter", () => {
  describe("valid letters", () => {
    it("should return true for lowercase letters a-z", () => {
      const letters = "abcdefghijklmnopqrstuvwxyz".split("");
      letters.forEach((letter) => {
        expect(isLetter(letter)).toBe(true);
      });
    });

    it("should return true for uppercase letters A-Z", () => {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      letters.forEach((letter) => {
        expect(isLetter(letter)).toBe(true);
      });
    });
  });

  describe("invalid characters", () => {
    it("should return false for numbers", () => {
      const numbers = "0123456789".split("");
      numbers.forEach((number) => {
        expect(isLetter(number)).toBe(false);
      });
    });

    it("should return false for spaces", () => {
      expect(isLetter(" ")).toBe(false);
    });

    it("should return false for special characters", () => {
      const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
      specialChars.forEach((char) => {
        expect(isLetter(char)).toBe(false);
      });
    });

    it("should return false for punctuation", () => {
      const punctuation = [".", ",", "?", ";", ":", "'", '"', "-", "_"];
      punctuation.forEach((char) => {
        expect(isLetter(char)).toBe(false);
      });
    });

    it("should return false for empty string", () => {
      expect(isLetter("")).toBe(false);
    });

    it("should return false for multi-character strings", () => {
      expect(isLetter("ab")).toBe(false);
      expect(isLetter("ABC")).toBe(false);
    });

    it("should return false for unicode characters", () => {
      expect(isLetter("ñ")).toBe(false);
      expect(isLetter("é")).toBe(false);
      expect(isLetter("ü")).toBe(false);
      expect(isLetter("中")).toBe(false);
    });
  });
});
