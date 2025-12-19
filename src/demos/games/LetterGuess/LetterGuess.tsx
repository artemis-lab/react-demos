import { useCallback, useState } from "react";

import { LetterGuessGame } from "../../../games/LetterGuess";
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

  const attemptsRemaining = game.getAttemptsRemaining();
  const characters = game.getTargetCharacters();
  const clickedLetters = game.getClickedLetters();
  const isGameOver = game.isGameOver();
  const visibleLetters = game.getVisibleLetters();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Letter Guess</h1>

        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <RevealableWord
            characters={characters}
            visibleLetters={visibleLetters}
          />
          <RemainingAttempts remaining={attemptsRemaining} />
        </div>

        <LetterKeyboard
          clickedLetters={clickedLetters}
          disabled={isGameOver}
          onLetterClick={onLetterClick}
        />

        {isGameOver && <div>Game over!</div>}
      </div>
    </div>
  );
};

export default LetterGuess;
