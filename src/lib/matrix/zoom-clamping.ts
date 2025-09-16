/**
 * Zoom Clamping
 * Functions for constraining zoom levels within bounds
 */

import type {
	ZoomBoundaryResult,
	ZoomBoundaryOptions,
} from "../../types/index.js";
import {
	MIN_ZOOM,
	MAX_ZOOM,
	DEFAULT_MIN_ZOOM,
	DEFAULT_MAX_ZOOM,
	DEFAULT_SCALE,
} from "./constants.js";

/**
 * Clamps zoom level to enforce 5%-400% bounds
 */
export function clampZoom(scale: number): number {
	if (typeof scale !== "number" || !Number.isFinite(scale)) {
		return DEFAULT_SCALE; // Default to 100% if invalid
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
		minZoom: DEFAULT_MIN_ZOOM,
		maxZoom: DEFAULT_MAX_ZOOM,
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
		result.scale = DEFAULT_SCALE;
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
