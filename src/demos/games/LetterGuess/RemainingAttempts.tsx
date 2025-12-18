interface RemainingAttemptsProps {
  count: number;
}

const RemainingAttempts = ({ count }: RemainingAttemptsProps) => {
  return <div>Remaining attempts: {count}</div>;
};

export default RemainingAttempts;
