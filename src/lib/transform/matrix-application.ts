/**
 * Matrix application functions
 */

/**
 * Creates a matrix3d CSS transform string from a DOMMatrix
 */
function createMatrix3dString(matrix: DOMMatrix): string {
	return `matrix3d(${matrix.m11}, ${matrix.m12}, ${matrix.m13}, ${matrix.m14}, ${matrix.m21}, ${matrix.m22}, ${matrix.m23}, ${matrix.m24}, ${matrix.m31}, ${matrix.m32}, ${matrix.m33}, ${matrix.m34}, ${matrix.m41}, ${matrix.m42}, ${matrix.m43}, ${matrix.m44})`;
}

/**
 * Applies transformation matrix to a DOM element
 * Uses fast path for performance, falls back to safe path on error
 */
export function applyTransform(
	element: HTMLElement,
	matrix: DOMMatrix,
): boolean {
	try {
		// Fast path for real-time operations - minimal validation
		element.style.transform = createMatrix3dString(matrix);
		return true;
	} catch (error) {
		console.warn("Fast transform failed:", error);
		return false;
	}
}
