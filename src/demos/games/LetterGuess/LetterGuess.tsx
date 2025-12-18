import { useCallback, useState } from "react";

import { LetterGuessGame } from "../../../games/LetterGuess";
import LetterKeyboard from "./LetterKeyboard";
import RemainingAttempts from "./RemainingAttempts";
import RevealableWord from "./RevealableWord";

const LetterGuess = () => {
  const [game, setGame] = useState<LetterGuessGame>(() =>
    LetterGuessGame.create(5, "HELLO, WORLD!"),
  );

  const onKeyClick = useCallback((letter: string): void => {
    setGame((prev: LetterGuessGame) => prev.guessLetter(letter));
  }, []);

  const attemptsRemaining = game.getAttemptsRemaining();
  const characters = game.getTargetCharacters();
  const clickedLetters = game.getClickedLetters();
  const isGameOver = game.isGameOver();
  const visibleLetters = game.getVisibleLetters();

  return (
    <div className="m-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <RevealableWord
          characters={characters}
          visibleLetters={visibleLetters}
        />
        <RemainingAttempts count={attemptsRemaining} />
      </div>
      <LetterKeyboard
        clickedLetters={clickedLetters}
        disabled={isGameOver}
        onKeyClick={onKeyClick}
      />
      {isGameOver && <div>Game over!</div>}
    </div>
  );
};

export default LetterGuess;
