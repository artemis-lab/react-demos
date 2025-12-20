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
      className="flex min-w-fit flex-nowrap justify-center gap-1 font-mono text-2xl font-bold sm:text-3xl md:text-4xl"
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
