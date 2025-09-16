/**
 * Container Setup
 * Functions for setting up the canvas container element
 */

import { CSS_CLASSES } from "./constants.js";

/**
 * Sets up the canvas container with proper styles and attributes
 */
export function setupCanvasContainer(container: HTMLElement): void {
	// Set up canvas container styles - preserve existing position and dimensions
	const currentPosition = getComputedStyle(container).position;
	if (currentPosition === "static") {
		container.style.position = "relative";
	}
	container.style.overflow = "hidden";
	container.style.cursor = "grab";

	// Make container focusable for keyboard events
	if (!container.hasAttribute("tabindex")) {
		container.setAttribute("tabindex", "0");
	}

	// Ensure container has proper dimensions
	ensureContainerDimensions(container);

	// Add canvas-specific classes if not present
	if (!container.classList.contains(CSS_CLASSES.CANVAS_CONTAINER)) {
		container.classList.add(CSS_CLASSES.CANVAS_CONTAINER);
	}
}

/**
 * Ensures the container has proper dimensions set
 */
function ensureContainerDimensions(container: HTMLElement): void {
	const containerRect = container.getBoundingClientRect();
	const computedStyle = getComputedStyle(container);

	// Only set dimensions if they're truly not set (avoid overriding existing styles)
	if (containerRect.height === 0 && computedStyle.height === "auto") {
		console.warn("Container height is 0, setting to 100vh");
		container.style.height = "100vh";
	}
	if (containerRect.width === 0 && computedStyle.width === "auto") {
		console.warn("Container width is 0, setting to 100vw");
		container.style.width = "100vw";
	}
}
