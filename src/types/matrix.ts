/**
 * Matrix calculation type definitions
 */

export interface Point {
	x: number;
	y: number;
}

export interface ZoomBoundaryResult {
	scale: number;
	clamped: boolean;
	hitBoundary: "min" | "max" | "invalid" | null;
	message: string | null;
}

export interface ZoomBoundaryOptions {
	minZoom?: number;
	maxZoom?: number;
	provideFeedback?: boolean;
	logBoundaryHits?: boolean;
	onBoundaryHit?: (
		boundary: string,
		originalScale: number,
		clampedScale: number,
	) => void;
}

export interface MatrixValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	correctedValues: {
		scale: number;
		translateX: number;
		translateY: number;
	};
}

export interface SafeMatrixResult {
	matrix: DOMMatrix;
	isValid: boolean;
	errors: string[];
	warnings: string[];
	usedFallback: boolean;
}

export interface SafeMatrixOptions {
	throwOnError?: boolean;
	logErrors?: boolean;
	logWarnings?: boolean;
}
