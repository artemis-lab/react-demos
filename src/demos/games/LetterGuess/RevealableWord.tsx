import { memo } from "react";

import { isLetter } from "../../../games/LetterGuess/utils";

const getCharacterClassName = (
  isSpace: boolean,
  isVisible: boolean,
  isLetterCharacter: boolean,
): string => {
  if (isSpace) {
    return "w-2";
  }
  if (isVisible) {
    return "animate-pulse text-blue-600 [animation-iteration-count:3]";
  }
  if (isLetterCharacter) {
    return "text-blue-300";
  }
  return "text-blue-600";
};

interface RevealableWordProps {
  characters: readonly string[];
  visibleLetters: ReadonlySet<string>;
}

const RevealableWord = ({
  characters,
  visibleLetters,
}: RevealableWordProps) => {
  return (
    <div
      aria-live="polite"
      className="flex flex-wrap justify-center gap-1 font-mono text-4xl font-bold"
      role="text"
    >
      {characters.map((value, index) => {
        const isSpace = value === " ";
        const isLetterCharacter = isLetter(value);
        const isVisible = isLetterCharacter && visibleLetters.has(value);
        const displayValue = isVisible || !isLetterCharacter ? value : "_";

        return (
          <span
            key={index}
            className={getCharacterClassName(
              isSpace,
              isVisible,
              isLetterCharacter,
            )}
          >
            {displayValue}
          </span>
        );
      })}
    </div>
  );
};

export default memo(RevealableWord);
