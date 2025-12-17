import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "./components/Layout";
import { FlagCapture } from "./demos/challenges/FlagCapture";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Home />} path="/" />
          <Route element={<FlagCapture />} path="/challenges/flag-capture" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
