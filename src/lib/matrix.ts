/**
 * Matrix Calculation Functions
 * Re-exports from the modular matrix implementation
 */

// Re-export all matrix functionality from the modular implementation
export {
	calculateMatrix,
	createIdentityMatrix,
	clampZoom,
	clampZoomWithFeedback,
	canvasToContent,
	contentToCanvas,
	getZoomToMouseTransform,
} from "./matrix/index.js";
