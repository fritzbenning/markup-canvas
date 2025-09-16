/**
 * Zoom to Mouse
 * Functions for calculating zoom transformations that keep content under the mouse cursor
 */

import type { Transform } from "../../types/index.js";
import { calculateMatrix } from "./matrix-calculation.js";
import { clampZoom } from "./zoom-clamping.js";
import { canvasToContent } from "./coordinate-conversion.js";
import {
	SCALE_CHANGE_THRESHOLD,
	DEFAULT_SCALE,
	DEFAULT_TRANSLATE_X,
	DEFAULT_TRANSLATE_Y,
} from "./constants.js";

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
		currentTransform = {
			scale: DEFAULT_SCALE,
			translateX: DEFAULT_TRANSLATE_X,
			translateY: DEFAULT_TRANSLATE_Y,
		};
	}

	const {
		scale: currentScale,
		translateX: currentTx,
		translateY: currentTy,
	} = currentTransform;

	// Calculate new scale
	const newScale = clampZoom(currentScale * zoomDelta);

	// If scale didn't change (hit bounds), return current transform
	if (Math.abs(newScale - currentScale) < SCALE_CHANGE_THRESHOLD) {
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
