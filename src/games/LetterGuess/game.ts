import { type CharacterInfo, type GameState, type GameStatus } from "./types";
import { isLetter } from "./utils";
import { WORD_LIST } from "./words";

class LetterGuessGame {
  private readonly clickedLetters: ReadonlySet<string>;
  private readonly maxAttempts: number;
  private readonly targetUniqueLetters: ReadonlySet<string>;
  private readonly targetWord: string;
  private readonly visibleLetters: ReadonlySet<string>;

  private constructor(state: GameState) {
    this.clickedLetters = state.clickedLetters;
    this.maxAttempts = state.maxAttempts;
    this.targetWord = state.targetWord;
    this.targetUniqueLetters = state.targetUniqueLetters;
    this.visibleLetters = state.visibleLetters;
  }

  /**
   * Extracts unique letters from a word.
   * @param word - The word to extract letters from
   * @returns Set of unique letters (uppercase)
   */
  private static getUniqueLetters(word: string): Set<string> {
    const normalizedWord = word.toUpperCase();
    const uniqueLetters = new Set<string>();
    for (const character of normalizedWord) {
      if (isLetter(character)) {
        uniqueLetters.add(character);
      }
    }
    return uniqueLetters;
  }

  /**
   * Calculates the maximum number of incorrect attempts based on word length.
   * @param wordLength - The total length of the word
   * @returns Number of max attempts (5-12 based on word length)
   */
  private static calculateMaxAttempts(wordLength: number): number {
    // Short words (<=6 characters) get 5 attempts
    if (wordLength <= 6) {
      return 5;
    }
    // Medium words (7-12 characters) get 6-8 attempts
    if (wordLength <= 12) {
      return 6 + Math.floor((wordLength - 7) / 2);
    }
    // Long words (13-18 characters) get 9-11 attempts
    if (wordLength <= 18) {
      return 9 + Math.floor((wordLength - 13) / 2);
    }
    // Very long words (19+ characters) get 12 attempts (maximum)
    return 12;
  }

  /**
   * Internal helper to create a game from a word with optional auto-calculated max attempts.
   * @param targetWord - The word to use
   * @param maxAttempts - Optional max attempts; if not provided, auto-calculated based on difficulty
   * @returns A new LetterGuessGame instance
   * @throws {Error} If word contains no letters or maxAttempts is less than 1
   */
  private static createFromWord(
    targetWord: string,
    maxAttempts?: number,
  ): LetterGuessGame {
    // Normalize and validate word
    const normalizedTargetWord = targetWord.toUpperCase();
    const uniqueLetters = this.getUniqueLetters(targetWord);

    if (uniqueLetters.size === 0) {
      throw new Error("Word must contain at least one letter");
    }

    // Calculate or use provided max attempts
    const finalMaxAttempts =
      maxAttempts ?? this.calculateMaxAttempts(normalizedTargetWord.length);

    if (finalMaxAttempts < 1) {
      throw new Error("maxAttempts must be at least 1");
    }

    // Create game instance
    return new LetterGuessGame({
      clickedLetters: new Set<string>(),
      maxAttempts: finalMaxAttempts,
      targetUniqueLetters: uniqueLetters,
      targetWord: normalizedTargetWord,
      visibleLetters: new Set<string>(),
    });
  }

  /**
   * Creates a new Letter Guess game with a random word from the word list.
   * Max attempts are automatically calculated based on word difficulty.
   * @returns A new LetterGuessGame instance
   * @throws {Error} If the word list is empty or word contains no letters
   * @example
   * const game = LetterGuessGame.createRandom();
   */
  static createRandom(): LetterGuessGame {
    if (WORD_LIST.length === 0) {
      throw new Error("Word list cannot be empty");
    }
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    const randomWord = WORD_LIST[randomIndex];
    if (!randomWord) {
      throw new Error("Failed to select a random word");
    }

    return this.createFromWord(randomWord);
  }

  /**
   * Creates a new Letter Guess game with a custom word and difficulty.
   * @param maxAttempts - Maximum number of incorrect guesses allowed (minimum 1)
   * @param targetWord - The word or phrase to guess (case-insensitive)
   * @returns A new LetterGuessGame instance
   * @throws {Error} If word contains no letters or maxAttempts is less than 1
   * @example
   * const game = LetterGuessGame.create(5, "TYPESCRIPT");
   */
  static create(maxAttempts: number, targetWord: string): LetterGuessGame {
    return this.createFromWord(targetWord, maxAttempts);
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
   * Returns detailed information about each character in the target word.
   * @returns Array of CharacterInfo objects containing display value, visibility, and character metadata
   */
  getCharacters(): readonly CharacterInfo[] {
    return this.targetWord.split("").map((character) => {
      const isSpace = character === " ";
      const isLetterCharacter = isLetter(character);
      const isVisible = isLetterCharacter && this.visibleLetters.has(character);
      const displayValue = isVisible || !isLetterCharacter ? character : "_";

      return {
        displayValue,
        isLetter: isLetterCharacter,
        isSpace,
        isVisible,
        value: character,
      };
    });
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
    }
    if (attemptsRemaining === 0) {
      return "lost";
    }
    return "in_progress";
  }

  /**
   * Makes a guess by clicking a letter.
   * @param letter - The letter to guess (case-insensitive)
   * @returns A new LetterGuessGame instance with the guess applied, or the current instance if the guess is invalid
   * @remarks
   * - Returns a new instance if the guess is valid
   * - Returns the current instance (unchanged) if the game is over or the letter was already clicked
   * - Decrements attempts if the guessed letter is not in the target word
   * - Game status becomes "won" if all letters are revealed, or "lost" if attempts reach 0
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
