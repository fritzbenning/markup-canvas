// Default canvas dimensions
export const DEFAULT_CANVAS_WIDTH = 8000;
export const DEFAULT_CANVAS_HEIGHT = 8000;

// Zoom constraints
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 3.5;

// Animation durations (in milliseconds)
export const DEFAULT_ANIMATION_DURATION = 300;
export const TRANSITION_CLEANUP_DELAY = 50;

// CSS transition values
export const SMOOTH_TRANSITION = "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Zoom to fit padding factor
export const ZOOM_FIT_PADDING = 0.9;

// CSS class names
export const CSS_CLASSES = {
  CANVAS_CONTAINER: "canvas-container",
  TRANSFORM_LAYER: "transform-layer",
  CONTENT_LAYER: "content-layer",
} as const;
