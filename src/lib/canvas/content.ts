/**
 * Content Management
 * Functions for adding and managing content in the canvas
 */

import type { BaseCanvas, AddContentOptions } from "../../types/index.js";
import { getCanvasBounds } from "./bounds.js";

/**
 * Adds an HTML element to the canvas's content layer
 */
export function addContentToCanvas(
  canvas: BaseCanvas,
  element: HTMLElement,
  options: AddContentOptions = {},
): boolean {
  // Validate inputs
  if (!canvas?.contentLayer) {
    console.error("Invalid canvas provided to addContentToCanvas");
    return false;
  }

  if (!element?.style) {
    console.error("Invalid element provided to addContentToCanvas");
    return false;
  }

  // Set default options
  const config: Required<AddContentOptions> = {
    absolute: true,
    x: 0,
    y: 0,
    ...options,
  };

  try {
    // Set positioning if coordinates provided
    if (config.absolute) {
      setupElementPositioning(element, config);
    }

    // Ensure element can receive pointer events
    if (!element.style.pointerEvents || element.style.pointerEvents === "none") {
      element.style.pointerEvents = "auto";
    }

    // Add element to content layer
    canvas.contentLayer.appendChild(element);

    // Validate bounds if position was specified
    validateElementBounds(canvas, config);

    return true;
  } catch (error) {
    console.error("Failed to add element to canvas:", error);
    return false;
  }
}

/**
 * Sets up positioning for an element
 */
function setupElementPositioning(element: HTMLElement, config: Required<AddContentOptions>): void {
  element.style.position = "absolute";

  if (typeof config.x === "number" && Number.isFinite(config.x)) {
    element.style.left = `${config.x}px`;
  }

  if (typeof config.y === "number" && Number.isFinite(config.y)) {
    element.style.top = `${config.y}px`;
  }
}

/**
 * Validates that element is positioned within content bounds
 */
function validateElementBounds(canvas: BaseCanvas, config: Required<AddContentOptions>): void {
  if (typeof config.x === "number" || typeof config.y === "number") {
    const bounds = getCanvasBounds(canvas);
    const x = config.x || 0;
    const y = config.y || 0;

    if (x < 0 || x > bounds.contentWidth || y < 0 || y > bounds.contentHeight) {
      console.warn(`Element positioned outside content bounds: (${x}, ${y})`);
    }
  }
}
