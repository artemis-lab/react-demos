import { memo } from "react";

import { isLetter } from "../../../games/LetterGuess/utils";

interface RevealableWordProps {
  characters: readonly string[];
  visibleLetters: ReadonlySet<string>;
}

const getDisplayValue = (
  character: string,
  index: number,
  visibleLetters: ReadonlySet<string>,
): string => {
  // Show actual character if visible or not a letter
  if (visibleLetters.has(character) || !isLetter(character)) {
    return character;
  }

  // Show underscore with space for hidden characters
  return index > 0 ? " _" : "_";
};

const RevealableWord = ({
  characters,
  visibleLetters,
}: RevealableWordProps) => {
  return (
    <div>
      {characters.map((value: string, index: number) => (
        <span key={index}>{getDisplayValue(value, index, visibleLetters)}</span>
      ))}
    </div>
  );
};

export default memo(RevealableWord);
