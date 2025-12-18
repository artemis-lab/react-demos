import { memo, type MouseEvent } from "react";

const LAYOUT: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

interface LetterKeyboardProps {
  clickedLetters: ReadonlySet<string>;
  disabled: boolean;
  onKeyClick: (key: string) => void;
}

const LetterKeyboard = ({
  clickedLetters,
  disabled,
  onKeyClick,
}: LetterKeyboardProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const key = event.currentTarget.dataset.key;
    if (key) {
      onKeyClick(key);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {LAYOUT.map((row: string[], index: number) => {
        return (
          <div key={index} className="flex flex-row gap-2">
            {row.map((key: string) => {
              return (
                <button
                  key={key}
                  className="h-10 w-10 border border-gray-300 bg-gray-200 text-gray-800 hover:font-semibold hover:text-gray-950 disabled:cursor-not-allowed disabled:font-normal disabled:text-gray-400"
                  data-key={key}
                  disabled={disabled || clickedLetters.has(key)}
                  onClick={handleClick}
                >
                  {key.toUpperCase()}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default memo(LetterKeyboard);
