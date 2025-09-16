/**
 * Canvas Configuration
 * Default configuration and validation for canvas options
 */

import type { CanvasOptions } from "../../types/index.js";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "./constants.js";

/**
 * Creates a validated configuration object with defaults
 */
export function createCanvasConfig(
	options: CanvasOptions = {},
): Required<CanvasOptions> {
	const config: Required<CanvasOptions> = {
		width: DEFAULT_CANVAS_WIDTH,
		height: DEFAULT_CANVAS_HEIGHT,
		enableAcceleration: true,
		enableEventHandling: true,
		rulerSize: 0,
		onTransformUpdate: () => {},
		...options,
	};

	// Validate and fix configuration values
	if (typeof config.width !== "number" || config.width <= 0) {
		console.warn("Invalid width, using default 8000px");
		config.width = DEFAULT_CANVAS_WIDTH;
	}

	if (typeof config.height !== "number" || config.height <= 0) {
		console.warn("Invalid height, using default 8000px");
		config.height = DEFAULT_CANVAS_HEIGHT;
	}

	return config;
}
