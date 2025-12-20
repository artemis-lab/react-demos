import { useCallback, useState } from "react";

import { LetterGuessGame } from "../../../games/LetterGuess";
import GameStatus from "./GameStatus";
import LetterKeyboard from "./LetterKeyboard";
import RemainingAttempts from "./RemainingAttempts";
import RevealableWord from "./RevealableWord";

const LetterGuess = () => {
  const [game, setGame] = useState<LetterGuessGame>(() =>
    LetterGuessGame.create(5, "HELLO, WORLD!"),
  );

  const onLetterClick = useCallback((letter: string): void => {
    setGame((prev: LetterGuessGame) => prev.guessLetter(letter));
  }, []);

  const handleReset = useCallback(() => {
    setGame((prev: LetterGuessGame) => prev.reset());
  }, []);

  const attemptsRemaining = game.getAttemptsRemaining();
  const characters = game.getTargetCharacters();
  const clickedLetters = game.getClickedLetters();
  const status = game.getStatus();
  const visibleLetters = game.getVisibleLetters();

  const isGameOver = status !== "in_progress";

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl sm:gap-6 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Letter Guess
        </h1>

        <div className="flex w-full flex-col items-center gap-3 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-3 sm:gap-4 sm:p-4">
          <RevealableWord
            characters={characters}
            visibleLetters={visibleLetters}
          />
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <RemainingAttempts remaining={attemptsRemaining} />
            <GameStatus status={status} />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <LetterKeyboard
            clickedLetters={clickedLetters}
            disabled={isGameOver}
            onLetterClick={onLetterClick}
          />
        </div>

        <div className="w-full border-t border-gray-200 pt-4">
          <button
            aria-label="Start a new game"
            className="w-full rounded-lg border border-blue-300 bg-blue-50 px-6 py-2 text-sm font-medium text-blue-700 transition-colors duration-200 hover:bg-blue-100 active:bg-blue-200"
            onClick={handleReset}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterGuess;
