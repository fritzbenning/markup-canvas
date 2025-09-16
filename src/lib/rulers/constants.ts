import type { RulerOptions } from "../../types/index.js";

// Static ruler size - always 24px
export const RULER_SIZE = 24;

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

export const RULER_Z_INDEX = {
  GRID: 100,
  RULERS: 1000,
  CORNER: 1001,
} as const;

export const TICK_SETTINGS = {
  MAJOR_HEIGHT: 6,
  MINOR_HEIGHT: 4,
  MAJOR_WIDTH: 8,
  MINOR_WIDTH: 4,
  MAJOR_MULTIPLIER: 5,
} as const;

export const GRID_SETTINGS = {
  BASE_SIZE: 100,
  MIN_SIZE: 20,
  MAX_SIZE: 200,
} as const;
