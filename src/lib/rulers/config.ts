import type { RulerOptions } from "../../types/index.js";

export const DEFAULT_RULER_CONFIG: Required<RulerOptions> = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderColor: "#ddd",
  textColor: "#666",
  majorTickColor: "#999",
  minorTickColor: "#ccc",
  fontSize: 10,
  fontFamily: "Monaco, Menlo, monospace",
  showGrid: true,
  gridColor: "rgba(0, 123, 255, 0.1)",
  units: "px",
};
