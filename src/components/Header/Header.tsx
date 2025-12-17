import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white/80 px-8 py-4 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl">
        <Link
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
          to="/"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    </header>
  );
};

export default Header;
