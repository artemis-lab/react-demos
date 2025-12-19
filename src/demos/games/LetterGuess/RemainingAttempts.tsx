import { Circle } from "lucide-react";
import { memo } from "react";

const getAttemptsColor = (count: number): string => {
  if (count <= 1) {
    return "text-red-600";
  }
  if (count <= 2) {
    return "text-yellow-600";
  }
  return "text-green-600";
};

interface RemainingAttemptsProps {
  count: number;
}

const RemainingAttempts = ({ count }: RemainingAttemptsProps) => {
  const textColor = getAttemptsColor(count);

  return (
    <div
      aria-live="polite"
      className="flex items-center justify-center gap-2 text-lg"
    >
      <Circle
        aria-hidden="true"
        className={`${textColor} fill-current`}
        size={16}
      />
      <span>
        Remaining {count === 1 ? "attempt" : "attempts"}:{" "}
        <strong className={textColor}>{count}</strong>
      </span>
    </div>
  );
};

export default memo(RemainingAttempts);
