// Default canvas dimensions
export const DEFAULT_CANVAS_WIDTH = 8000;
export const DEFAULT_CANVAS_HEIGHT = 8000;

// Zoom constraints
export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 10;

export const DEFAULT_ZOOM = 1.0;
export const DEFAULT_TRANSLATE_X = -24;
export const DEFAULT_TRANSLATE_Y = -24;

export const ZOOM_SPEED = 0.4;
export const FINE_ZOOM_SPEED = 0.3;

// Zoom factor limiting (per-frame control)
export const ZOOM_FACTOR_LIMIT = {
  MAX_ZOOM_FACTOR_PER_FRAME: 1.2, // Maximum zoom factor per frame (1.02 = 2% increase max)
  MIN_ZOOM_FACTOR_PER_FRAME: 0.8, // Minimum zoom factor per frame (0.98 = 2% decrease max)
  MIN_ZOOM_FACTOR_CHANGE: 0.0001, // Minimum zoom factor change to process
} as const;

// Validation thresholds
export const ZOOM_CHANGE_THRESHOLD = 0.001;

// Animation durations (in milliseconds)
export const DEFAULT_ANIMATION_DURATION = 200;
export const TRANSITION_CLEANUP_DELAY = 50;

// CSS transition values
export const TRANSITION_DURATION = 0.05;
export const EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Zoom to fit padding factor
export const ZOOM_FIT_PADDING = 0.9;

// CSS class names
export const CSS_CLASSES = {
  CANVAS_CONTAINER: "canvas-container",
  TRANSFORM_LAYER: "transform-layer",
  CONTENT_LAYER: "content-layer",
} as const;

// Rulers
export const RULER_SIZE = 24;

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
  LABEL_INTERVAL: 200, // Show labels every 200 units
} as const;

export const GRID_SETTINGS = {
  BASE_SIZE: 100,
  MIN_SIZE: 20,
  MAX_SIZE: 200,
} as const;
