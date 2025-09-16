/**
 * Transform Application Functions
 * Functions for applying transformations to DOM elements
 */

/**
 * Applies transformation matrix to a DOM element
 */
export function applyTransform(
	element: HTMLElement,
	matrix: DOMMatrix,
): boolean {
	// Fast path for real-time operations - minimal validation
	if (element?.style && matrix) {
		try {
			// Apply matrix3d transform for hardware acceleration
			// Use template literal for better performance
			element.style.transform = `matrix3d(${matrix.m11}, ${matrix.m12}, ${matrix.m13}, ${matrix.m14}, ${matrix.m21}, ${matrix.m22}, ${matrix.m23}, ${matrix.m24}, ${matrix.m31}, ${matrix.m32}, ${matrix.m33}, ${matrix.m34}, ${matrix.m41}, ${matrix.m42}, ${matrix.m43}, ${matrix.m44})`;

			return true;
		} catch (error) {
			// Fallback with full validation only on error
			console.warn("Fast transform failed, using fallback:", error);
		}
	}

	// Fallback path with full validation
	if (!element?.style) {
		console.warn("Invalid element provided to applyTransform");
		return false;
	}

	if (!matrix) {
		console.warn("Invalid matrix provided to applyTransform");
		return false;
	}

	try {
		// Validate matrix values
		if (!validateMatrix(matrix)) {
			console.warn("Invalid matrix values detected");
			return false;
		}

		// Apply matrix3d transform for hardware acceleration
		const matrixString = `matrix3d(${matrix.m11}, ${matrix.m12}, ${matrix.m13}, ${matrix.m14}, ${matrix.m21}, ${matrix.m22}, ${matrix.m23}, ${matrix.m24}, ${matrix.m31}, ${matrix.m32}, ${matrix.m33}, ${matrix.m34}, ${matrix.m41}, ${matrix.m42}, ${matrix.m43}, ${matrix.m44})`;

		element.style.transform = matrixString;
		element.style.webkitTransform = matrixString; // Safari support

		return true;
	} catch (error) {
		console.error("Failed to apply transform:", error);
		return false;
	}
}

/**
 * Enables smooth transitions on transform layer
 */
export function enableSmoothTransitions(
	element: HTMLElement,
	duration = 0.2,
): boolean {
	if (!element?.style) {
		console.warn("Invalid element provided to enableSmoothTransitions");
		return false;
	}

	try {
		const easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Smooth ease-out
		const transitionValue = `transform ${duration}s ${easing}`;

		element.style.transition = transitionValue;
		element.style.webkitTransition = transitionValue;

		return true;
	} catch (error) {
		console.error("Failed to enable smooth transitions:", error);
		return false;
	}
}

/**
 * Disables smooth transitions on transform layer for real-time operations
 */
export function disableSmoothTransitions(element: HTMLElement): boolean {
	if (!element?.style) {
		console.warn("Invalid element provided to disableSmoothTransitions");
		return false;
	}

	try {
		element.style.transition = "none";
		element.style.webkitTransition = "none";

		return true;
	} catch (error) {
		console.error("Failed to disable smooth transitions:", error);
		return false;
	}
}

/**
 * Enables hardware acceleration hints on an element
 */
export function enableHardwareAcceleration(element: HTMLElement): boolean {
	if (!element?.style) {
		console.warn("Invalid element provided to enableHardwareAcceleration");
		return false;
	}

	try {
		// Set CSS properties for hardware acceleration
		element.style.transform = element.style.transform || "translateZ(0)";
		element.style.webkitTransform =
			element.style.webkitTransform || "translateZ(0)";
		element.style.backfaceVisibility = "hidden";
		element.style.webkitBackfaceVisibility = "hidden";

		return true;
	} catch (error) {
		console.error("Failed to enable hardware acceleration:", error);
		return false;
	}
}

/**
 * Validates transformation matrix for NaN and Infinity values
 */
export function validateMatrix(matrix: DOMMatrix): boolean {
	if (!matrix) return false;

	// Check all matrix components for valid numbers
	const values = [
		matrix.m11,
		matrix.m12,
		matrix.m13,
		matrix.m14,
		matrix.m21,
		matrix.m22,
		matrix.m23,
		matrix.m24,
		matrix.m31,
		matrix.m32,
		matrix.m33,
		matrix.m34,
		matrix.m41,
		matrix.m42,
		matrix.m43,
		matrix.m44,
	];

	return values.every(
		(value) =>
			typeof value === "number" &&
			Number.isFinite(value) &&
			!Number.isNaN(value),
	);
}
