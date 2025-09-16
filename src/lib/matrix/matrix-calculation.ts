/**
 * Matrix Calculation
 * Core transformation matrix operations
 */

import {
	DEFAULT_SCALE,
	DEFAULT_TRANSLATE_X,
	DEFAULT_TRANSLATE_Y,
} from "./constants.js";

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
		scale = DEFAULT_SCALE;
	}
	if (typeof translateX !== "number" || !Number.isFinite(translateX)) {
		translateX = DEFAULT_TRANSLATE_X;
	}
	if (typeof translateY !== "number" || !Number.isFinite(translateY)) {
		translateY = DEFAULT_TRANSLATE_Y;
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
 * Creates a fallback identity matrix for error recovery
 */
export function createIdentityMatrix(): DOMMatrix {
	return new DOMMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}
