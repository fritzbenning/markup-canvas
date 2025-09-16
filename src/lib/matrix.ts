/**
 * Matrix Calculation Functions
 * Core transformation matrix operations for zoom and pan
 */

import type {
	Transform,
	Point,
	ZoomBoundaryResult,
	ZoomBoundaryOptions,
} from "../types/index.js";

/**
 * Calculates a transformation matrix for scale and translation
 */
export function calculateMatrix(
	scale: number,
	translateX: number,
	translateY: number,
): DOMMatrix {
	// Validate inputs and use fallback values if invalid
	if (typeof scale !== "number" || !Number.isFinite(scale) || scale <= 0) {
		scale = 1.0;
	}
	if (typeof translateX !== "number" || !Number.isFinite(translateX)) {
		translateX = 0;
	}
	if (typeof translateY !== "number" || !Number.isFinite(translateY)) {
		translateY = 0;
	}

	// Create matrix directly for better performance
	return new DOMMatrix([
		scale,
		0,
		0,
		0,
		0,
		scale,
		0,
		0,
		0,
		0,
		1,
		0,
		translateX,
		translateY,
		0,
		1,
	]);
}

/**
 * Clamps zoom level to enforce 5%-400% bounds
 */
export function clampZoom(scale: number): number {
	const MIN_ZOOM = 0.05; // 5%
	const MAX_ZOOM = 4; // 400%

	if (typeof scale !== "number" || !Number.isFinite(scale)) {
		return 1.0; // Default to 100% if invalid
	}

	return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
}

/**
 * Enhanced zoom boundary management with user feedback
 */
export function clampZoomWithFeedback(
	scale: number,
	options: ZoomBoundaryOptions = {},
): ZoomBoundaryResult {
	const config: Required<ZoomBoundaryOptions> = {
		minZoom: 0.1,
		maxZoom: 3.5,
		provideFeedback: true,
		logBoundaryHits: false,
		onBoundaryHit: () => {},
		...options,
	};

	const result: ZoomBoundaryResult = {
		scale: scale,
		clamped: false,
		hitBoundary: null,
		message: null,
	};

	// Validate input
	if (
		typeof scale !== "number" ||
		!Number.isFinite(scale) ||
		Number.isNaN(scale)
	) {
		result.scale = 1.0;
		result.clamped = true;
		result.message = "Invalid scale value, reset to 100%";

		if (config.provideFeedback && config.logBoundaryHits) {
			console.warn("Invalid zoom scale provided:", scale);
		}

		if (config.onBoundaryHit) {
			config.onBoundaryHit("invalid", scale, result.scale);
		}

		return result;
	}

	// Check boundaries
	if (scale < config.minZoom) {
		result.scale = config.minZoom;
		result.clamped = true;
		result.hitBoundary = "min";
		result.message = `Minimum zoom level reached (${Math.round(
			config.minZoom * 100,
		)}%)`;

		if (config.provideFeedback && config.logBoundaryHits) {
			console.info(`Zoom clamped to minimum: ${config.minZoom}`);
		}

		if (config.onBoundaryHit) {
			config.onBoundaryHit("min", scale, result.scale);
		}
	} else if (scale > config.maxZoom) {
		result.scale = config.maxZoom;
		result.clamped = true;
		result.hitBoundary = "max";
		result.message = `Maximum zoom level reached (${Math.round(
			config.maxZoom * 100,
		)}%)`;

		if (config.provideFeedback && config.logBoundaryHits) {
			console.info(`Zoom clamped to maximum: ${config.maxZoom}`);
		}

		if (config.onBoundaryHit) {
			config.onBoundaryHit("max", scale, result.scale);
		}
	}

	return result;
}

/**
 * Converts canvas coordinates to content coordinates
 */
export function canvasToContent(
	canvasX: number,
	canvasY: number,
	matrix: DOMMatrix,
): Point {
	// Validate inputs
	if (typeof canvasX !== "number" || !Number.isFinite(canvasX)) canvasX = 0;
	if (typeof canvasY !== "number" || !Number.isFinite(canvasY)) canvasY = 0;

	if (!matrix || typeof matrix.inverse !== "function") {
		return { x: canvasX, y: canvasY };
	}

	try {
		// Use inverse matrix to convert from canvas to content space
		const inverseMatrix = matrix.inverse();
		const point = new DOMPoint(canvasX, canvasY);
		const transformed = point.matrixTransform(inverseMatrix);

		return {
			x: transformed.x,
			y: transformed.y,
		};
	} catch (error) {
		console.warn("Matrix inversion failed:", error);
		return { x: canvasX, y: canvasY };
	}
}

/**
 * Converts content coordinates to canvas coordinates
 */
export function contentToCanvas(
	contentX: number,
	contentY: number,
	matrix: DOMMatrix,
): Point {
	// Validate inputs
	if (typeof contentX !== "number" || !Number.isFinite(contentX)) contentX = 0;
	if (typeof contentY !== "number" || !Number.isFinite(contentY)) contentY = 0;

	if (!matrix || typeof matrix.transformPoint !== "function") {
		return { x: contentX, y: contentY };
	}

	try {
		const point = new DOMPoint(contentX, contentY);
		const transformed = point.matrixTransform(matrix);

		return {
			x: transformed.x,
			y: transformed.y,
		};
	} catch (error) {
		console.warn("Matrix transformation failed:", error);
		return { x: contentX, y: contentY };
	}
}

/**
 * Calculates zoom-to-mouse transformation
 */
export function getZoomToMouseTransform(
	mouseX: number,
	mouseY: number,
	currentTransform: Transform,
	zoomDelta: number,
): Transform {
	// Validate inputs
	if (typeof mouseX !== "number" || !Number.isFinite(mouseX)) mouseX = 0;
	if (typeof mouseY !== "number" || !Number.isFinite(mouseY)) mouseY = 0;
	if (typeof zoomDelta !== "number" || !Number.isFinite(zoomDelta))
		zoomDelta = 1.0;

	if (!currentTransform || typeof currentTransform !== "object") {
		currentTransform = { scale: 1.0, translateX: 0, translateY: 0 };
	}

	const {
		scale: currentScale,
		translateX: currentTx,
		translateY: currentTy,
	} = currentTransform;

	// Calculate new scale
	const newScale = clampZoom(currentScale * zoomDelta);

	// If scale didn't change (hit bounds), return current transform
	if (Math.abs(newScale - currentScale) < 0.001) {
		return {
			scale: currentScale,
			translateX: currentTx,
			translateY: currentTy,
		};
	}

	// Get current matrix
	const currentMatrix = calculateMatrix(currentScale, currentTx, currentTy);

	// Convert mouse position to content coordinates
	const contentPoint = canvasToContent(mouseX, mouseY, currentMatrix);

	// Calculate new translation to keep the content point under the mouse
	const newTx = mouseX - contentPoint.x * newScale;
	const newTy = mouseY - contentPoint.y * newScale;

	return {
		scale: newScale,
		translateX: newTx,
		translateY: newTy,
	};
}

/**
 * Creates a fallback identity matrix for error recovery
 */
export function createIdentityMatrix(): DOMMatrix {
	return new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
