export type CharacterInfo = {
  displayValue: string;
  isLetter: boolean;
  isSpace: boolean;
  isVisible: boolean;
  value: string;
};

export type GameState = {
  clickedLetters: ReadonlySet<string>;
  maxAttempts: number;
  targetUniqueLetters: ReadonlySet<string>;
  targetWord: string;
  visibleLetters: ReadonlySet<string>;
};

export type GameStatus = "in_progress" | "lost" | "won";
