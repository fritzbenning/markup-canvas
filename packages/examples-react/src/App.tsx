import { HashRouter, Link, Route, Routes } from "react-router-dom";
import RefExample from "./examples/RefExample";
import WindowExample from "./examples/WindowExample";
import "./App.css";

function Navigation() {
  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: "bold", marginRight: "auto" }}>MarkupCanvas Examples</span>
      <Link
        to="/"
        style={{ textDecoration: "none", padding: "0.5rem 1rem", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px" }}
      >
        Default (useMarkupCanvas)
      </Link>
      <Link
        to="/window"
        style={{ textDecoration: "none", padding: "0.5rem 1rem", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px" }}
      >
        Window (useMarkupCanvasWindow)
      </Link>
    </nav>
  );
}

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<RefExample />} />
        <Route path="/window" element={<WindowExample />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
