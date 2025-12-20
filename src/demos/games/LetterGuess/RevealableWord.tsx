import { memo } from "react";

import type { CharacterInfo } from "../../../games/LetterGuess/types";

const getCharacterClassName = (
  isLetter: boolean,
  isSpace: boolean,
  isVisible: boolean,
): string => {
  if (isSpace) {
    return "w-2";
  }
  if (isVisible) {
    return "animate-pulse text-blue-600 [animation-iteration-count:3]";
  }
  if (isLetter) {
    return "text-blue-300";
  }
  return "text-blue-600";
};

interface RevealableWordProps {
  characters: readonly CharacterInfo[];
}

const RevealableWord = ({ characters }: RevealableWordProps) => {
  return (
    <div
      aria-live="polite"
      className="flex min-w-fit flex-nowrap justify-center gap-1 font-mono text-2xl font-bold sm:text-3xl md:text-4xl"
      role="text"
    >
      {characters.map((character, index) => {
        return (
          <span
            key={index}
            className={getCharacterClassName(
              character.isLetter,
              character.isSpace,
              character.isVisible,
            )}
          >
            {character.displayValue}
          </span>
        );
      })}
    </div>
  );
};

export default memo(RevealableWord);
