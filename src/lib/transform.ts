/**
 * Transform Application Functions
 * Functions for applying transformations to DOM elements
 */

import { createIdentityMatrix, safeCalculateMatrix } from "./matrix.js";

// Type definitions
interface Transform {
	scale: number;
	translateX: number;
	translateY: number;
}

interface SafeTransformOptions {
	logErrors?: boolean;
	logWarnings?: boolean;
	useRepair?: boolean;
	fallbackToIdentity?: boolean;
}

interface SafeTransformResult {
	success: boolean;
	usedFallback: boolean;
	errors: string[];
	warnings: string[];
}

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

/**
 * Safely applies transform with error handling and fallback
 */
export function safeApplyTransform(
	element: HTMLElement,
	transform: Transform,
	options: SafeTransformOptions = {},
): SafeTransformResult {
	const config: Required<SafeTransformOptions> = {
		logErrors: true,
		logWarnings: false,
		useRepair: true,
		fallbackToIdentity: true,
		...options,
	};

	const result: SafeTransformResult = {
		success: false,
		usedFallback: false,
		errors: [],
		warnings: [],
	};

	if (!element?.style) {
		result.errors.push("Invalid element provided");
		if (config.logErrors) {
			console.error("safeApplyTransform: Invalid element provided");
		}
		return result;
	}

	if (!transform || typeof transform !== "object") {
		result.errors.push("Invalid transform object provided");
		if (config.logErrors) {
			console.error("safeApplyTransform: Invalid transform object provided");
		}
		return result;
	}

	try {
		// Use safe matrix calculation
		const matrixResult = safeCalculateMatrix(
			transform.scale,
			transform.translateX,
			transform.translateY,
			{
				throwOnError: false,
				logErrors: config.logErrors,
				logWarnings: config.logWarnings,
			},
		);

		result.errors.push(...matrixResult.errors);
		result.warnings.push(...matrixResult.warnings);

		let matrix = matrixResult.matrix;

		if (!matrixResult.isValid) {
			result.usedFallback = true;

			if (!matrix || !validateMatrix(matrix)) {
				if (config.fallbackToIdentity) {
					matrix = createIdentityMatrix();
					result.usedFallback = true;
					result.warnings.push("Used identity matrix fallback");
				} else {
					result.errors.push("Could not create valid matrix");
					return result;
				}
			}
		}

		// Apply the transform
		const applySuccess = applyTransform(element, matrix);

		if (applySuccess) {
			result.success = true;
		} else {
			result.errors.push("Failed to apply transform to element");

			// Try one more time with identity matrix if not already used
			if (!result.usedFallback && config.fallbackToIdentity) {
				const identityMatrix = createIdentityMatrix();
				const identitySuccess = applyTransform(element, identityMatrix);

				if (identitySuccess) {
					result.success = true;
					result.usedFallback = true;
					result.warnings.push("Applied identity matrix as final fallback");
				}
			}
		}
	} catch (error) {
		result.errors.push(
			`Transform application failed: ${(error as Error).message}`,
		);

		if (config.logErrors) {
			console.error("safeApplyTransform error:", error);
		}

		// Final fallback attempt
		if (config.fallbackToIdentity) {
			try {
				const identityMatrix = createIdentityMatrix();
				const fallbackSuccess = applyTransform(element, identityMatrix);

				if (fallbackSuccess) {
					result.success = true;
					result.usedFallback = true;
					result.warnings.push("Used identity matrix after error");
				}
			} catch (fallbackError) {
				result.errors.push(
					`Fallback also failed: ${(fallbackError as Error).message}`,
				);
			}
		}
	}

	return result;
}
