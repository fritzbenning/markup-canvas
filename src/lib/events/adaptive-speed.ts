/**
 * Adaptive speed calculations for zoom and pan operations
 */

import type { EventCanvas as Canvas } from "../../types/index.js";
import {
	REFERENCE_DISPLAY_AREA,
	ADAPTIVE_ZOOM_CONSTANTS,
} from "./constants.js";

/**
 * Gets display-size adaptive zoom speed based on canvas dimensions
 */
export function getAdaptiveZoomSpeed(
	canvas: Canvas,
	baseSpeed: number,
): number {
	if (!canvas?.getBounds) {
		return baseSpeed;
	}

	try {
		const bounds = canvas.getBounds();
		const displayArea = bounds.width * bounds.height;

		// Calculate scale factor with aggressive scaling optimized for larger displays
		// Use power of 0.85 for even more dramatic differences on large screens
		const rawScaleFactor =
			(displayArea / REFERENCE_DISPLAY_AREA) **
			ADAPTIVE_ZOOM_CONSTANTS.POWER_FACTOR;

		// Wider bounds for more dramatic effect (0.2x to 3x adjustment)
		const clampedScaleFactor = Math.max(
			ADAPTIVE_ZOOM_CONSTANTS.MIN_SCALE_FACTOR,
			Math.min(ADAPTIVE_ZOOM_CONSTANTS.MAX_SCALE_FACTOR, rawScaleFactor),
		);

		return baseSpeed * clampedScaleFactor;
	} catch (error) {
		console.warn(
			"Failed to calculate adaptive zoom speed, using base speed:",
			error,
		);
		return baseSpeed;
	}
}
