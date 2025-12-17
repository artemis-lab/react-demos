import { DemoCard } from "../components/DemoCard";
const Home = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">React Demos</h1>
      <p className="mb-8 border-b border-gray-200 pb-6 text-lg text-gray-600">
        Collection of React demo components showcasing various patterns and
        techniques.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Challenges
          </h2>
          <div className="grid gap-4">
            <DemoCard
              description="Capture The Flag challenge with DOM parsing. Displays the flag one character at a time with animated reveal."
              title="Flag Capture"
              to="/challenges/flag-capture"
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Games</h2>
          <div className="grid gap-4">
            <DemoCard
              description="Classic Tic-Tac-Toe game demonstrating separation of game logic from UI, immutable state patterns, and win condition algorithms."
              title="Tic-Tac-Toe"
              to="/games/tic-tac-toe"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
