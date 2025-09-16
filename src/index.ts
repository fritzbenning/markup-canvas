// Main index file - exports all public API functions and types

// Export matrix calculation functions
export {
  calculateMatrix,
  createIdentityMatrix,
} from "./lib/matrix/matrix-calculation.js";
export {
  clampZoom,
  clampZoomWithFeedback,
} from "./lib/matrix/zoom-clamping.js";
export {
  canvasToContent,
  contentToCanvas,
} from "./lib/matrix/coordinate-conversion.js";
export { getZoomToMouseTransform } from "./lib/matrix/zoom-to-mouse.js";

// Export transform application functions
export {
  applyTransform,
  disableSmoothTransitions,
  enableHardwareAcceleration,
  enableSmoothTransitions,
} from "./lib/transform/index.js";

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

// Export ruler functions
export { createRulers } from "./lib/rulers/index.js";

// Export main canvas creation function
export { createMarkupCanvas } from "./lib/create-markup-canvas.js";

// Export types
export type * from "./types/index.js";
