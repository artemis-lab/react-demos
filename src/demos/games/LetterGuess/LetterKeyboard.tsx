import { memo, type MouseEvent, useCallback, useEffect, useState } from "react";

import { isLetter } from "../../../games/LetterGuess/utils";

// Button style constants
const BASE_STYLES =
  "h-12 w-12 rounded-lg text-lg font-semibold transition-all duration-200";
const DISABLED_STYLES =
  "cursor-not-allowed bg-gray-300 text-gray-500 shadow-sm";
const ENABLED_STYLES =
  "bg-linear-to-b from-gray-100 to-gray-200 text-gray-800 shadow-md hover:scale-105 hover:from-gray-200 hover:to-gray-300 hover:shadow-lg active:scale-95";

// Keyboard layout
const LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
] as const;

const PRESS_FEEDBACK_DURATION_MS = 150;

const getButtonClassName = (
  isDisabled: boolean,
  isPressed: boolean,
): string => {
  return [
    BASE_STYLES,
    isDisabled ? DISABLED_STYLES : ENABLED_STYLES,
    isPressed && "scale-95", // Will be false if not pressed
  ]
    .filter(Boolean) // Remove falsy values (false, null, undefined)
    .join(" ");
};

interface LetterKeyboardProps {
  clickedLetters: ReadonlySet<string>;
  disabled: boolean;
  onLetterClick: (letter: string) => void;
}

const LetterKeyboard = ({
  clickedLetters,
  disabled,
  onLetterClick,
}: LetterKeyboardProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const letter = event.currentTarget.dataset.key;
      if (letter) {
        onLetterClick(letter);
      }
    },
    [onLetterClick],
  );

  // Add physical keyboard support
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore keys with modifier keys (Ctrl, Alt, Meta/Cmd, Shift)
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const letter = event.key.toUpperCase();

      // Only process if game is not disabled, it's a letter, and not already clicked
      if (disabled || !isLetter(letter) || clickedLetters.has(letter)) {
        return;
      }

      // Prevent default browser behavior for handled keys
      event.preventDefault();

      // Visual feedback for keyboard press
      clearTimeout(timeoutId);
      setPressedKey(letter);
      timeoutId = setTimeout(
        () => setPressedKey(null),
        PRESS_FEEDBACK_DURATION_MS,
      );

      onLetterClick(letter);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [clickedLetters, disabled, onLetterClick]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        aria-label="Letter keyboard"
        className="flex flex-col items-center gap-2"
      >
        {LAYOUT.map((row, index) => (
          <div key={index} className="flex flex-row gap-2" role="group">
            {row.map((letter) => {
              const normalizedLetter = letter.toUpperCase();
              const isClicked = clickedLetters.has(normalizedLetter);
              const isDisabled = disabled || isClicked;
              const isPressed = pressedKey === normalizedLetter;

              return (
                <button
                  key={normalizedLetter}
                  aria-label={`Letter ${normalizedLetter}`}
                  aria-pressed={isPressed}
                  className={getButtonClassName(isDisabled, isPressed)}
                  data-key={normalizedLetter}
                  disabled={isDisabled}
                  type="button"
                  onClick={handleClick}
                >
                  {normalizedLetter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="text-sm text-gray-500">
        You can also use your keyboard
      </p>
    </div>
  );
};

export default memo(LetterKeyboard);
