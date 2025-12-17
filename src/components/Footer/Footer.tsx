const Footer = () => {
  return (
    <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
      <p>
        Created by{" "}
        <a
          className="text-indigo-600 hover:underline"
          href="https://github.com/artemis-lab"
          rel="noopener noreferrer"
          target="_blank"
        >
          artemis-lab
        </a>
      </p>
      <p className="mt-2">
        <a
          className="text-indigo-600 hover:underline"
          href="https://github.com/artemis-lab/react-demos"
          rel="noopener noreferrer"
          target="_blank"
        >
          View on GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
