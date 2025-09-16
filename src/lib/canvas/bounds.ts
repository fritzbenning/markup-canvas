/**
 * Canvas Bounds
 * Functions for calculating canvas bounds and dimensions
 */

import { calculateMatrix } from "../matrix/matrix-calculation.js";
import { canvasToContent } from "../matrix/coordinate-conversion.js";
import type { BaseCanvas, CanvasBounds } from "../../types/index.js";

/**
 * Gets the current bounds and dimensions of a canvas
 */
export function getCanvasBounds(canvas: BaseCanvas): CanvasBounds {
	// Validate canvas
	if (!canvas?.container) {
		console.warn("Invalid canvas provided to getCanvasBounds");
		return createEmptyBounds();
	}

	try {
		const container = canvas.container;
		const config = canvas.config;
		const transform = canvas.transform || {
			scale: 1.0,
			translateX: 0,
			translateY: 0,
		};

		// Get canvas dimensions (subtract ruler size from available space)
		const containerRect = container.getBoundingClientRect();
		const totalWidth = containerRect.width || container.clientWidth || 0;
		const totalHeight = containerRect.height || container.clientHeight || 0;
		const rulerSize = config.rulerSize || 0;
		const canvasWidth = Math.max(0, totalWidth - rulerSize);
		const canvasHeight = Math.max(0, totalHeight - rulerSize);

		// Get content dimensions
		const contentWidth = config.width || 8000;
		const contentHeight = config.height || 8000;

		// Calculate visible area in content coordinates
		const visibleArea = calculateVisibleArea(
			canvasWidth,
			canvasHeight,
			contentWidth,
			contentHeight,
			transform,
		);

		return {
			// Canvas dimensions
			width: canvasWidth,
			height: canvasHeight,

			// Content dimensions
			contentWidth,
			contentHeight,

			// Current transform
			scale: transform.scale,
			translateX: transform.translateX,
			translateY: transform.translateY,

			// Visible area in content coordinates
			visibleArea,

			// Calculated properties
			scaledContentWidth: contentWidth * transform.scale,
			scaledContentHeight: contentHeight * transform.scale,

			// Bounds checking
			canPanLeft: transform.translateX < 0,
			canPanRight:
				transform.translateX + contentWidth * transform.scale > canvasWidth,
			canPanUp: transform.translateY < 0,
			canPanDown:
				transform.translateY + contentHeight * transform.scale > canvasHeight,

			// Zoom bounds
			canZoomIn: transform.scale < 3.5,
			canZoomOut: transform.scale > 0.1,
		};
	} catch (error) {
		console.error("Failed to calculate canvas bounds:", error);
		return createEmptyBounds();
	}
}

/**
 * Creates an empty bounds object for error cases
 */
function createEmptyBounds(): CanvasBounds {
	return {
		width: 0,
		height: 0,
		contentWidth: 0,
		contentHeight: 0,
		scale: 1,
		translateX: 0,
		translateY: 0,
		visibleArea: { x: 0, y: 0, width: 0, height: 0 },
		scaledContentWidth: 0,
		scaledContentHeight: 0,
		canPanLeft: false,
		canPanRight: false,
		canPanUp: false,
		canPanDown: false,
		canZoomIn: false,
		canZoomOut: false,
	};
}

/**
 * Calculates the visible area in content coordinates
 */
function calculateVisibleArea(
	canvasWidth: number,
	canvasHeight: number,
	contentWidth: number,
	contentHeight: number,
	transform: { scale: number; translateX: number; translateY: number },
) {
	const topLeft = canvasToContent(
		0,
		0,
		calculateMatrix(
			transform.scale,
			transform.translateX,
			transform.translateY,
		),
	);

	const bottomRight = canvasToContent(
		canvasWidth,
		canvasHeight,
		calculateMatrix(
			transform.scale,
			transform.translateX,
			transform.translateY,
		),
	);

	return {
		x: Math.max(0, Math.min(contentWidth, topLeft.x)),
		y: Math.max(0, Math.min(contentHeight, topLeft.y)),
		width: Math.max(
			0,
			Math.min(contentWidth - topLeft.x, bottomRight.x - topLeft.x),
		),
		height: Math.max(
			0,
			Math.min(contentHeight - topLeft.y, bottomRight.y - topLeft.y),
		),
	};
}
