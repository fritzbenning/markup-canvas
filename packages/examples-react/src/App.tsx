import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Example from "./examples/Example";
import SimpleExample from "./examples/SimpleExample";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/simple" element={<SimpleExample />} />
        <Route path="/hook" element={<Navigate to="/" replace />} />
        <Route path="/component" element={<Navigate to="/simple" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
