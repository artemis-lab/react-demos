interface RemainingAttemptsProps {
  count: number;
}

const RemainingAttempts = ({ count }: RemainingAttemptsProps) => {
  const textColor =
    count <= 1
      ? "text-red-600"
      : count <= 2
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="text-center text-lg">
      Remaining attempts:{" "}
      <span className={`font-bold ${textColor}`}>{count}</span>
    </div>
  );
};

export default RemainingAttempts;
