/**
 * Zoomable HTML Container
 * High-performance canvas with zoom and pan capabilities
 */

// Import functions for internal use
import { createCanvas } from "./lib/canvas.js";
import {
	setupKeyboardNavigation,
	setupMouseDrag,
	setupMouseDragWithControls,
	setupTouchEvents,
	setupWheelZoom,
} from "./lib/events.js";
import { clampZoom } from "./lib/matrix.js";
import {
	enableSmoothTransitions,
	disableSmoothTransitions,
} from "./lib/transform.js";

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
	setupMouseDragWithControls,
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
	enableKeyboardControls?: boolean;
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
	// Exposed control functions for custom keyboard implementation
	panLeft: (distance?: number) => boolean;
	panRight: (distance?: number) => boolean;
	panUp: (distance?: number) => boolean;
	panDown: (distance?: number) => boolean;
	zoomIn: (factor?: number) => boolean;
	zoomOut: (factor?: number) => boolean;
	resetZoom: (duration?: number) => boolean;
	// Mouse drag control functions
	enableMouseDrag: () => boolean;
	disableMouseDrag: () => boolean;
	isMouseDragEnabled: () => boolean;
	// Additional utility functions
	centerContent: (duration?: number) => boolean;
	fitToScreen: (duration?: number) => boolean;
	getVisibleArea: () => { x: number; y: number; width: number; height: number };
	isPointVisible: (x: number, y: number) => boolean;
	scrollToPoint: (x: number, y: number, duration?: number) => boolean;
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
			zoomSpeed: options.zoomSpeed !== undefined ? options.zoomSpeed : 0.4,
			fineZoomSpeed:
				options.fineZoomSpeed !== undefined ? options.fineZoomSpeed : 0.2,
		});
		cleanupFunctions.push(wheelCleanup);

		// Mouse drag with control functions
		const dragSetup = setupMouseDragWithControls(canvas, {
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
		cleanupFunctions.push(dragSetup.cleanup);

		// Keyboard navigation (optional)
		if (options.enableKeyboardControls !== false) {
			const keyboardCleanup = setupKeyboardNavigation(canvas, {
				panStep: 50,
				fastPanMultiplier: 3,
			});
			cleanupFunctions.push(keyboardCleanup);
		}

		// Touch events
		const touchCleanup = setupTouchEvents(canvas, {
			enableSingleTouchPan: true,
			enableMultiTouch: true,
		});
		cleanupFunctions.push(touchCleanup);

		// Add exposed control functions for custom keyboard implementation
		(canvas as any).panLeft = (distance: number = 50) => {
			const newTransform: Partial<Transform> = {
				translateX: canvas.transform.translateX + distance,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).panRight = (distance: number = 50) => {
			const newTransform: Partial<Transform> = {
				translateX: canvas.transform.translateX - distance,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).panUp = (distance: number = 50) => {
			const newTransform: Partial<Transform> = {
				translateY: canvas.transform.translateY + distance,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).panDown = (distance: number = 50) => {
			const newTransform: Partial<Transform> = {
				translateY: canvas.transform.translateY - distance,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).zoomIn = (factor: number = 0.1) => {
			const newScale = clampZoom(canvas.transform.scale * (1 + factor));
			const newTransform: Partial<Transform> = {
				scale: newScale,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).zoomOut = (factor: number = 0.1) => {
			const newScale = clampZoom(canvas.transform.scale * (1 - factor));
			const newTransform: Partial<Transform> = {
				scale: newScale,
			};
			return canvas.updateTransform(newTransform);
		};

		(canvas as any).resetZoom = (duration: number = 0) => {
			if (canvas.resetView) {
				return canvas.resetView(duration);
			}
			return false;
		};

		// Mouse drag control functions
		(canvas as any).enableMouseDrag = () => {
			return dragSetup.enable();
		};

		(canvas as any).disableMouseDrag = () => {
			return dragSetup.disable();
		};

		(canvas as any).isMouseDragEnabled = () => {
			return dragSetup.isEnabled();
		};

		// Additional utility functions
		(canvas as any).centerContent = (duration: number = 300) => {
			const bounds = canvas.getBounds();
			const centerX =
				(bounds.width - bounds.contentWidth * canvas.transform.scale) / 2;
			const centerY =
				(bounds.height - bounds.contentHeight * canvas.transform.scale) / 2;

			if (duration > 0) {
				enableSmoothTransitions(canvas.transformLayer, duration / 1000);
			}

			const result = canvas.updateTransform({
				translateX: centerX,
				translateY: centerY,
			});

			if (duration > 0) {
				setTimeout(() => {
					if (canvas.transformLayer) {
						disableSmoothTransitions(canvas.transformLayer);
					}
				}, duration + 50);
			}

			return result;
		};

		(canvas as any).fitToScreen = (duration: number = 300) => {
			return canvas.zoomToFitContent(duration);
		};

		(canvas as any).getVisibleArea = () => {
			const bounds = canvas.getBounds();
			return bounds.visibleArea;
		};

		(canvas as any).isPointVisible = (x: number, y: number) => {
			const visibleArea = (canvas as any).getVisibleArea();
			return (
				x >= visibleArea.x &&
				x <= visibleArea.x + visibleArea.width &&
				y >= visibleArea.y &&
				y <= visibleArea.y + visibleArea.height
			);
		};

		(canvas as any).scrollToPoint = (
			x: number,
			y: number,
			duration: number = 300,
		) => {
			const bounds = canvas.getBounds();
			const centerX = bounds.width / 2;
			const centerY = bounds.height / 2;

			// Calculate new translation to center the point
			const newTranslateX = centerX - x * canvas.transform.scale;
			const newTranslateY = centerY - y * canvas.transform.scale;

			if (duration > 0) {
				enableSmoothTransitions(canvas.transformLayer, duration / 1000);
			}

			const result = canvas.updateTransform({
				translateX: newTranslateX,
				translateY: newTranslateY,
			});

			if (duration > 0) {
				setTimeout(() => {
					if (canvas.transformLayer) {
						disableSmoothTransitions(canvas.transformLayer);
					}
				}, duration + 50);
			}

			return result;
		};

		// Add cleanup method to canvas
		(canvas as any).cleanup = () => {
			cleanupFunctions.forEach((cleanup) => {
				cleanup();
			});
		};

		console.log("Zoomable container initialized successfully");
		return canvas as Canvas;
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
