import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { FlagCapture } from "./demos/challenges/FlagCapture";
import { LetterGuess } from "./demos/games/LetterGuess";
import { TicTacToe } from "./demos/games/TicTacToe";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Home />} path="/" />
          <Route element={<FlagCapture />} path="/challenges/flag-capture" />
          <Route element={<TicTacToe />} path="/games/tic-tac-toe" />
          <Route element={<LetterGuess />} path="/games/letter-guess" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
