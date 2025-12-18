/**
 * Checks if a character is a letter (a-z, A-Z).
 * @param value - The character to check
 * @returns True if the character is a letter, false otherwise
 */
export const isLetter = (value: string): boolean => {
  return /^[a-z]$/i.test(value);
};
