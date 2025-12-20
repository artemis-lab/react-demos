import { memo } from "react";

import type { GameStatus as GameStatusType } from "../../../games/LetterGuess/types";

type StatusContent = {
  colorClass: string;
  text: string;
};

const getStatusContent = (status: GameStatusType): StatusContent => {
  switch (status) {
    case "won":
      return {
        colorClass: "text-green-600",
        text: "You won!",
      };
    case "lost":
      return {
        colorClass: "text-red-600",
        text: "Game over!",
      };
    case "in_progress":
      return {
        colorClass: "text-blue-600",
        text: "In progress",
      };
  }
};

interface GameStatusProps {
  status: GameStatusType;
}

const GameStatus = ({ status }: GameStatusProps) => {
  const { text, colorClass } = getStatusContent(status);

  return (
    <span
      aria-live="polite"
      className={`min-w-fit text-sm font-semibold whitespace-nowrap sm:text-base md:text-lg ${colorClass}`}
    >
      {text}
    </span>
  );
};

export default memo(GameStatus);
