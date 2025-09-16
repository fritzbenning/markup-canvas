/**
 * Canvas Creation
 * Main function for creating and initializing canvases
 */

import { calculateMatrix } from "../matrix.js";
import { applyTransform, enableHardwareAcceleration } from "../transform.js";
import type {
	BaseCanvas,
	CanvasOptions,
	Transform,
} from "../../types/index.js";
import { createCanvasConfig } from "./config.js";
import { setupCanvasContainer } from "./setup-container.js";
import { createCanvasLayers } from "./create-layers.js";
import { createCanvasMethods } from "./canvas-methods.js";

/**
 * Creates and initializes a canvas with the required DOM structure
 */
export function createCanvas(
	container: HTMLElement,
	options: CanvasOptions = {},
): BaseCanvas | null {
	// Validate container
	if (!container?.appendChild) {
		console.error("Invalid container element provided to createCanvas");
		return null;
	}

	// Set default options
	const config = createCanvasConfig(options);

	try {
		// Set up canvas container
		setupCanvasContainer(container);

		// Create canvas layers
		const { transformLayer, contentLayer } = createCanvasLayers(
			container,
			config,
		);

		// Enable hardware acceleration if requested
		if (config.enableAcceleration) {
			enableHardwareAcceleration(transformLayer);
		}

		// Initialize transform state
		const initialTransform: Transform = {
			scale: 1.0,
			translateX: 0,
			translateY: 0,
		};

		// Apply initial transform
		const initialMatrix = calculateMatrix(
			initialTransform.scale,
			initialTransform.translateX,
			initialTransform.translateY,
		);
		applyTransform(transformLayer, initialMatrix);

		// Create canvas object with methods
		const canvas: BaseCanvas = {
			// DOM references
			container,
			transformLayer,
			contentLayer,

			// Configuration
			config,

			// Current state
			transform: initialTransform,

			// Add all canvas methods
			...createCanvasMethods(),
		};

		console.log("Canvas created successfully:", {
			contentSize: `${config.width}x${config.height}`,
			acceleration: config.enableAcceleration,
			eventHandling: config.enableEventHandling,
		});

		return canvas;
	} catch (error) {
		console.error("Failed to create canvas:", error);
		return null;
	}
}
