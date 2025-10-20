import { HashRouter, Route, Routes } from "react-router-dom";
import DefaultExample from "./examples";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DefaultExample />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
