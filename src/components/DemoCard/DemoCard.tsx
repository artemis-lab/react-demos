import { Link } from "react-router-dom";

type DemoCardProps = {
  description: string;
  title: string;
  to: string;
};

const DemoCard = ({ description, title, to }: DemoCardProps) => {
  return (
    <Link
      className="block rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
      to={to}
    >
      <h3 className="mb-2 text-xl font-semibold text-indigo-600">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default DemoCard;
