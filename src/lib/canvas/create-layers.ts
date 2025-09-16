/**
 * Layer Creation
 * Functions for creating and managing canvas layers
 */

import type { CanvasOptions } from "../../types/index.js";
import { CSS_CLASSES, SMOOTH_TRANSITION } from "./constants.js";

export interface CanvasLayers {
	transformLayer: HTMLElement;
	contentLayer: HTMLElement;
}

/**
 * Creates the transform and content layers for the canvas
 */
export function createCanvasLayers(
	container: HTMLElement,
	config: Required<CanvasOptions>,
): CanvasLayers {
	// Store existing content before creating new structure
	const existingContent = Array.from(container.children);

	// Create or find transform layer
	let transformLayer = container.querySelector(
		`.${CSS_CLASSES.TRANSFORM_LAYER}`,
	) as HTMLElement;
	if (!transformLayer) {
		transformLayer = document.createElement("div");
		transformLayer.className = CSS_CLASSES.TRANSFORM_LAYER;
		container.appendChild(transformLayer);
	}

	// Set transform layer dimensions and properties
	setupTransformLayer(transformLayer, config);

	// Create or find content layer
	let contentLayer = transformLayer.querySelector(
		`.${CSS_CLASSES.CONTENT_LAYER}`,
	) as HTMLElement;
	if (!contentLayer) {
		contentLayer = document.createElement("div");
		contentLayer.className = CSS_CLASSES.CONTENT_LAYER;
		transformLayer.appendChild(contentLayer);

		// Move existing content into the content layer (except the transform layer itself)
		moveExistingContent(existingContent, contentLayer, transformLayer);
	}

	// Set content layer properties
	setupContentLayer(contentLayer);

	return { transformLayer, contentLayer };
}

/**
 * Sets up the transform layer with proper styles and dimensions
 */
function setupTransformLayer(
	transformLayer: HTMLElement,
	config: Required<CanvasOptions>,
): void {
	transformLayer.style.position = "absolute";
	transformLayer.style.top = `${config.rulerSize}px`;
	transformLayer.style.left = `${config.rulerSize}px`;
	transformLayer.style.width = `${config.width}px`;
	transformLayer.style.height = `${config.height}px`;
	transformLayer.style.transformOrigin = "0 0";

	// Add smooth transitions for zoom operations
	transformLayer.style.transition = SMOOTH_TRANSITION;
}

/**
 * Sets up the content layer with proper styles
 */
function setupContentLayer(contentLayer: HTMLElement): void {
	contentLayer.style.position = "relative";
	contentLayer.style.width = "100%";
	contentLayer.style.height = "100%";
	contentLayer.style.pointerEvents = "auto";
}

/**
 * Moves existing content into the content layer
 */
function moveExistingContent(
	existingContent: Element[],
	contentLayer: HTMLElement,
	transformLayer: HTMLElement,
): void {
	existingContent.forEach((child) => {
		if (
			child !== transformLayer &&
			!child.classList.contains(CSS_CLASSES.TRANSFORM_LAYER)
		) {
			contentLayer.appendChild(child);
		}
	});
}
