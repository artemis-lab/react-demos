import { Circle } from "lucide-react";
import { memo } from "react";

const getAttemptsColor = (remaining: number): string => {
  if (remaining <= 1) {
    return "text-red-600";
  }
  if (remaining <= 2) {
    return "text-yellow-600";
  }
  return "text-green-600";
};

interface RemainingAttemptsProps {
  remaining: number;
}

const RemainingAttempts = ({ remaining }: RemainingAttemptsProps) => {
  const textColor = getAttemptsColor(remaining);

  return (
    <div
      aria-live="polite"
      className="flex min-w-fit items-center justify-center gap-2 text-sm whitespace-nowrap sm:text-base md:text-lg"
    >
      <Circle
        aria-hidden="true"
        className={`${textColor} fill-current`}
        size={16}
      />
      <span>
        Remaining {remaining === 1 ? "attempt" : "attempts"}:{" "}
        <strong className={textColor}>{remaining}</strong>
      </span>
    </div>
  );
};

export default memo(RemainingAttempts);
