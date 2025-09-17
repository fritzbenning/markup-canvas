// Package Export

// Export canvas management functions
export {
  addContentToCanvas,
  createCanvas,
  getCanvasBounds,
} from "./lib/canvas/index.js";
// Export event handling functions
export {
  setupKeyboardNavigation,
  setupMouseDrag,
  setupMouseDragWithControls,
  setupTouchEvents,
  setupWheelZoom,
} from "./lib/events/index.js";
// Export main canvas class as default
// Also keep named export for backwards compatibility
export { MarkupCanvas, MarkupCanvas as default } from "./lib/markup-canvas.js";

export {
  canvasToContent,
  contentToCanvas,
} from "./lib/matrix/coordinate-conversion.js";

// Export matrix calculation functions
export {
  calculateMatrix,
  createIdentityMatrix,
} from "./lib/matrix/matrix-calculation.js";
export { clampZoom } from "./lib/matrix/zoom-clamping.js";
export { getZoomToMouseTransform } from "./lib/matrix/zoom-to-mouse.js";

// Export ruler functions
export { createRulers } from "./lib/rulers/index.js";

// Export transform application functions
export {
  applyTransform,
  disableSmoothTransitions,
  enableHardwareAcceleration,
  enableSmoothTransitions,
} from "./lib/transform/index.js";

// Export types
export type * from "./types/index.js";
