import { memo } from "react";

import { isLetter } from "../../../games/LetterGuess/utils";

interface RevealableWordProps {
  characters: readonly string[];
  visibleLetters: ReadonlySet<string>;
}

const RevealableWord = ({
  characters,
  visibleLetters,
}: RevealableWordProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-1 font-mono text-4xl font-bold">
      {characters.map((value: string, index: number) => {
        const isSpace = value === " ";
        const isLetterCharacter = isLetter(value);
        const isVisible = isLetterCharacter && visibleLetters.has(value);
        const displayValue = isVisible || !isLetterCharacter ? value : "_";

        return (
          <span
            key={`${index}-${value}-${isVisible}`}
            className={
              isSpace
                ? "w-2"
                : isVisible
                  ? "animate-pulse text-blue-600 [animation-iteration-count:3]"
                  : isLetterCharacter
                    ? "text-blue-300"
                    : "text-blue-600"
            }
          >
            {displayValue}
          </span>
        );
      })}
    </div>
  );
};

export default memo(RevealableWord);
