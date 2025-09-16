/**
 * Zoomable HTML Container
 * High-performance canvas with zoom and pan capabilities
 */

// Import functions for internal use
import { createCanvas } from "./lib/canvas.js";
import {
	setupKeyboardNavigation,
	setupMouseDrag,
	setupTouchEvents,
	setupWheelZoom,
} from "./lib/events.js";

// Export matrix calculation functions
export {
	calculateMatrix,
	clampZoom,
	clampZoomWithFeedback,
	contentToCanvas,
	createIdentityMatrix,
	getZoomToMouseTransform,
	safeCalculateMatrix,
	canvasToContent,
} from "./lib/matrix.js";

// Export transform application functions
export {
	applyTransform,
	disableSmoothTransitions,
	enableHardwareAcceleration,
	enableSmoothTransitions,
	safeApplyTransform,
	validateMatrix,
} from "./lib/transform.js";

// Export canvas management functions
export {
	addContentToCanvas,
	createCanvas,
	getCanvasBounds,
} from "./lib/canvas.js";

// Export event handling functions
export {
	setupKeyboardNavigation,
	setupMouseDrag,
	setupTouchEvents,
	setupWheelZoom,
} from "./lib/events.js";

// Export ruler functions
export { createRulers } from "./lib/rulers.js";

// Type definitions
interface MarkupCanvasOptions {
	contentWidth?: number;
	contentHeight?: number;
	enableAcceleration?: boolean;
	enableEventHandling?: boolean;
	smoothTransition?: boolean;
	zoomSpeed?: number;
	fineZoomSpeed?: number;
	enableLeftDrag?: boolean;
	enableMiddleDrag?: boolean;
	requireSpaceForMouseDrag?: boolean;
	enableClickToZoom?: boolean;
	clickZoomLevel?: number;
	clickZoomDuration?: number;
	requireOptionForClickZoom?: boolean;
	onTransformUpdate?: (transform: Transform) => void;
}

interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

interface Canvas {
	container: HTMLElement;
	transformLayer: HTMLElement;
	contentLayer: HTMLElement;
	config: any;
	transform: Transform;
	getBounds: () => any;
	addContent: (element: HTMLElement, options?: any) => boolean;
	updateTransform: (newTransform: Partial<Transform>) => boolean;
	reset: () => boolean;
	handleResize: () => boolean;
	setZoom: (zoomLevel: number) => boolean;
	setInteractionMode: (mode: string) => boolean;
	canvasToContent: (x: number, y: number) => { x: number; y: number };
	zoomToPoint: (
		x: number,
		y: number,
		targetScale: number,
		duration?: number,
	) => boolean;
	resetView: (duration?: number) => boolean;
	zoomToFitContent: (duration?: number) => boolean;
	cleanup?: () => void;
}

/**
 * Initialize a complete markup canvas with all event handlers
 */
export function createMarkupCanvas(
	container: HTMLElement,
	options: MarkupCanvasOptions = {},
): Canvas | null {
	if (!container) {
		console.error("Container element is required");
		return null;
	}

	// Create canvas
	const canvas = createCanvas(container, options);
	if (!canvas) {
		console.error("Failed to create canvas");
		return null;
	}

	// Set up event handlers
	const cleanupFunctions: (() => void)[] = [];

	try {
		// Wheel zoom
		const wheelCleanup = setupWheelZoom(canvas, {
			smoothTransition:
				options.smoothTransition !== undefined
					? options.smoothTransition
					: true,
			zoomSpeed: options.zoomSpeed !== undefined ? options.zoomSpeed : 0.15,
			fineZoomSpeed:
				options.fineZoomSpeed !== undefined ? options.fineZoomSpeed : 0.05,
		});
		cleanupFunctions.push(wheelCleanup);

		// Mouse drag
		const dragCleanup = setupMouseDrag(canvas, {
			enableLeftDrag:
				options.enableLeftDrag !== undefined ? options.enableLeftDrag : true,
			enableMiddleDrag:
				options.enableMiddleDrag !== undefined
					? options.enableMiddleDrag
					: true,
			requireSpaceForMouseDrag: options.requireSpaceForMouseDrag || false,
			enableClickToZoom:
				options.enableClickToZoom !== undefined
					? options.enableClickToZoom
					: true,
			clickZoomLevel:
				options.clickZoomLevel !== undefined ? options.clickZoomLevel : 1.0,
			clickZoomDuration:
				options.clickZoomDuration !== undefined
					? options.clickZoomDuration
					: 300,
			requireOptionForClickZoom:
				options.requireOptionForClickZoom !== undefined
					? options.requireOptionForClickZoom
					: false,
		});
		cleanupFunctions.push(dragCleanup);

		// Keyboard navigation
		const keyboardCleanup = setupKeyboardNavigation(canvas, {
			panStep: 50,
			fastPanMultiplier: 3,
		});
		cleanupFunctions.push(keyboardCleanup);

		// Touch events
		const touchCleanup = setupTouchEvents(canvas, {
			enableSingleTouchPan: true,
			enableMultiTouch: true,
		});
		cleanupFunctions.push(touchCleanup);

		// Add cleanup method to canvas
		(canvas as any).cleanup = () => {
			cleanupFunctions.forEach((cleanup) => {
				cleanup();
			});
		};

		console.log("Zoomable container initialized successfully");
		return canvas;
	} catch (error) {
		console.error("Failed to set up event handlers:", error);

		// Clean up any handlers that were successfully created
		cleanupFunctions.forEach((cleanup) => {
			try {
				cleanup();
			} catch (cleanupError) {
				console.warn("Error during cleanup:", cleanupError);
			}
		});

		return null;
	}
}
