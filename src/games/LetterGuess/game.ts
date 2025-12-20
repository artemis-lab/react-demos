import { isLetter } from "./utils";

type GameStatus = "in_progress" | "lost" | "won";

type GameState = {
  clickedLetters: ReadonlySet<string>;
  maxAttempts: number;
  targetUniqueLetters: ReadonlySet<string>;
  targetWord: string;
  visibleLetters: ReadonlySet<string>;
};

class LetterGuessGame {
  private readonly clickedLetters: ReadonlySet<string>;
  private readonly maxAttempts: number;
  private readonly targetWord: string;
  private readonly targetUniqueLetters: ReadonlySet<string>;
  private readonly visibleLetters: ReadonlySet<string>;

  private constructor(state: GameState) {
    this.clickedLetters = state.clickedLetters;
    this.maxAttempts = state.maxAttempts;
    this.targetWord = state.targetWord;
    this.targetUniqueLetters = state.targetUniqueLetters;
    this.visibleLetters = state.visibleLetters;
  }

  /**
   * Creates a new Letter Guess game with initial state.
   * @param maxAttempts - Maximum number of incorrect guesses allowed
   * @param targetWord - The word or phrase to guess (case-insensitive, will be normalized to uppercase)
   * @returns A new LetterGuessGame instance
   * @throws {Error} If targetWord contains no letters or maxAttempts is less than 1
   */
  static create(maxAttempts: number, targetWord: string): LetterGuessGame {
    // Validate maxAttempts
    if (maxAttempts < 1) {
      throw new Error("maxAttempts must be at least 1");
    }

    // Normalize target word to uppercase
    const normalizedTargetWord = targetWord.toUpperCase();

    // Count unique letters in target word
    const uniqueLetters = new Set<string>();
    for (const char of normalizedTargetWord) {
      if (isLetter(char)) {
        uniqueLetters.add(char);
      }
    }

    // Validate that target word contains at least one letter
    if (uniqueLetters.size === 0) {
      throw new Error("targetWord must contain at least one letter");
    }

    return new LetterGuessGame({
      clickedLetters: new Set<string>(),
      maxAttempts,
      targetUniqueLetters: uniqueLetters,
      targetWord: normalizedTargetWord,
      visibleLetters: new Set<string>(),
    });
  }

  /**
   * Returns the number of incorrect attempts remaining.
   * @returns The number of attempts left before the game is lost
   */
  getAttemptsRemaining(): number {
    const incorrectGuesses =
      this.clickedLetters.size - this.visibleLetters.size;
    return this.maxAttempts - incorrectGuesses;
  }

  /**
   * Returns a set of all letters that have been clicked/guessed.
   * @returns Set of clicked letter characters
   */
  getClickedLetters(): ReadonlySet<string> {
    return new Set(this.clickedLetters);
  }

  /**
   * Returns the current status of the game.
   * @returns The game status: "in_progress", "lost" or "won"
   */
  getStatus(): GameStatus {
    const remainingLettersCount =
      this.targetUniqueLetters.size - this.visibleLetters.size;
    const attemptsRemaining = this.getAttemptsRemaining();

    if (remainingLettersCount === 0) {
      return "won";
    } else if (attemptsRemaining === 0) {
      return "lost";
    }
    return "in_progress";
  }

  /**
   * Returns all characters in the target word (including punctuation and spaces).
   * @returns Array of all characters from the target word in order
   */
  getTargetCharacters(): readonly string[] {
    return this.targetWord.split("");
  }

  /**
   * Returns a set of letters that have been correctly guessed (present in target word).
   * @returns Set of visible letter characters
   */
  getVisibleLetters(): ReadonlySet<string> {
    return new Set(this.visibleLetters);
  }

  /**
   * Makes a guess by clicking a letter.
   * @param letter - The letter to guess (case-insensitive, will be normalized to uppercase)
   * @returns A new LetterGuessGame instance with the guess applied, or the current instance if the guess is invalid
   * @remarks
   * - Returns a new instance if the guess is valid
   * - Returns the current instance (unchanged) if the game is over or the letter was already clicked
   * - Decrements attempts if the guessed letter is not in the target word
   * - Updates game status to "won" if all letters are revealed, or "lost" if attempts reach 0
   */
  guessLetter(letter: string): LetterGuessGame {
    // Game is already over
    if (this.getStatus() !== "in_progress") {
      return this;
    }

    // Normalize input to uppercase
    const normalizedLetter = letter.toUpperCase();

    // Letter already clicked
    if (this.clickedLetters.has(normalizedLetter)) {
      return this;
    }

    // Add letter to clicked set
    const newClickedLetters = new Set([
      ...this.clickedLetters,
      normalizedLetter,
    ]);

    // Check if letter is in target word
    const isCorrectGuess = this.targetUniqueLetters.has(normalizedLetter);

    // Update visible letters incrementally
    const newVisibleLetters = isCorrectGuess
      ? new Set([...this.visibleLetters, normalizedLetter])
      : this.visibleLetters;

    return new LetterGuessGame({
      clickedLetters: newClickedLetters,
      maxAttempts: this.maxAttempts,
      targetUniqueLetters: this.targetUniqueLetters,
      targetWord: this.targetWord,
      visibleLetters: newVisibleLetters,
    });
  }

  /**
   * Resets the game to its initial state with the same max attempts and target word.
   * @returns A new LetterGuessGame instance with fresh initial state
   * @remarks
   * - Returns a new instance with empty clicked letters
   * - Resets attempts to the original maximum
   * - Status set to "in_progress"
   */
  reset(): LetterGuessGame {
    return LetterGuessGame.create(this.maxAttempts, this.targetWord);
  }
}

export { LetterGuessGame };

export type { GameStatus };
