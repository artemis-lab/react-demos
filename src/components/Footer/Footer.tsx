import { useLocation } from "react-router-dom";

const GITHUB_PROFILE = "https://github.com/artemis-lab";
const GITHUB_REPO = `${GITHUB_PROFILE}/react-demos`;

// GitHub source folder paths indexed by route
const FOLDER_BY_ROUTE: Record<string, string> = {
  "/challenges/flag-capture": "/tree/master/src/demos/challenges/FlagCapture",
  "/games/letter-guess": "/tree/master/src/demos/games/LetterGuess",
  "/games/tic-tac-toe": "/tree/master/src/demos/games/TicTacToe",
};

const getGitHubLink = (route: string): string => {
  const folder = FOLDER_BY_ROUTE[route];
  return folder ? `${GITHUB_REPO}${folder}` : GITHUB_REPO;
};

const Footer = () => {
  const location = useLocation();
  const githubLink = getGitHubLink(location.pathname);
  const isHomePage = location.pathname === "/";

  return (
    <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-600">
      <p>
        Created by{" "}
        <a
          className="text-indigo-600 hover:underline"
          href={GITHUB_PROFILE}
          rel="noopener noreferrer"
          target="_blank"
        >
          artemis-lab
        </a>
      </p>
      <p className="mt-1">
        <a
          className="text-indigo-600 hover:underline"
          href={githubLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {isHomePage ? "View on GitHub" : "View Source Code"}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
