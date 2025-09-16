/**
 * Matrix Constants
 * Shared constants used across matrix functionality
 */

// Zoom bounds
export const MIN_ZOOM = 0.05; // 5%
export const MAX_ZOOM = 4.0; // 400%

// Enhanced zoom bounds (more restrictive for UI)
export const DEFAULT_MIN_ZOOM = 0.1; // 10%
export const DEFAULT_MAX_ZOOM = 3.5; // 350%

// Default transform values
export const DEFAULT_SCALE = 1.0;
export const DEFAULT_TRANSLATE_X = 0;
export const DEFAULT_TRANSLATE_Y = 0;

// Validation thresholds
export const SCALE_CHANGE_THRESHOLD = 0.001;

// Matrix array indices for DOMMatrix constructor
export const MATRIX_INDICES = {
	SCALE_X: 0,
	SKEW_Y: 1,
	SKEW_X: 4,
	SCALE_Y: 5,
	TRANSLATE_X: 12,
	TRANSLATE_Y: 13,
} as const;
