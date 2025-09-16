import type { RulerCanvas as Canvas, RulerOptions, RulerSystem } from "../../types/index.js";
import { DEFAULT_RULER_CONFIG, RULER_SIZE } from "./constants.js";
import { createRulerElements, type RulerElements } from "./ruler-elements.js";
import { updateRulers } from "./ruler-updates.js";
import { setupEventListeners } from "./event-listeners.js";

// Creates dynamic rulers for a zoomable canvas
export function createRulers(canvas: Canvas, options: RulerOptions = {}): RulerSystem | null {
  if (!canvas?.container) {
    console.error("Invalid canvas provided to createRulers");
    return null;
  }

  const config: Required<RulerOptions> = {
    ...DEFAULT_RULER_CONFIG,
    ...options,
  };

  let elements: RulerElements;
  let cleanupEvents: (() => void) | null = null;
  let isDestroyed = false;

  // Update function that checks if destroyed
  const safeUpdate = (): void => {
    if (isDestroyed || !elements.horizontalRuler || !elements.verticalRuler) return;
    updateRulers(canvas, elements.horizontalRuler, elements.verticalRuler, elements.gridOverlay, config);
  };

  // Initialize rulers
  try {
    elements = createRulerElements(canvas.container, config);
    cleanupEvents = setupEventListeners(canvas, safeUpdate);

    // Position transform layer to account for rulers
    if (canvas.transformLayer) {
      canvas.transformLayer.style.top = `${RULER_SIZE}px`;
      canvas.transformLayer.style.left = `${RULER_SIZE}px`;
    }

    safeUpdate();

    // Return ruler system object
    return {
      horizontalRuler: elements.horizontalRuler,
      verticalRuler: elements.verticalRuler,
      cornerBox: elements.cornerBox,
      gridOverlay: elements.gridOverlay,

      // Update rulers manually
      update: safeUpdate,

      // Show/hide rulers
      show: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "block";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "block";
        if (elements.cornerBox) elements.cornerBox.style.display = "flex";
        if (elements.gridOverlay) elements.gridOverlay.style.display = "block";

        // Adjust transform layer positioning
        if (canvas.transformLayer) {
          canvas.transformLayer.style.top = `${RULER_SIZE}px`;
          canvas.transformLayer.style.left = `${RULER_SIZE}px`;
        }
      },

      hide: () => {
        if (elements.horizontalRuler) elements.horizontalRuler.style.display = "none";
        if (elements.verticalRuler) elements.verticalRuler.style.display = "none";
        if (elements.cornerBox) elements.cornerBox.style.display = "none";
        if (elements.gridOverlay) elements.gridOverlay.style.display = "none";

        // Reset transform layer positioning
        if (canvas.transformLayer) {
          canvas.transformLayer.style.top = "0px";
          canvas.transformLayer.style.left = "0px";
        }
      },

      // Toggle grid
      toggleGrid: () => {
        if (elements.gridOverlay) {
          const isVisible = elements.gridOverlay.style.display !== "none";
          elements.gridOverlay.style.display = isVisible ? "none" : "block";
        }
      },

      // Cleanup
      destroy: () => {
        isDestroyed = true;
        if (cleanupEvents) {
          cleanupEvents();
        }

        if (elements.horizontalRuler?.parentNode) {
          elements.horizontalRuler.parentNode.removeChild(elements.horizontalRuler);
        }
        if (elements.verticalRuler?.parentNode) {
          elements.verticalRuler.parentNode.removeChild(elements.verticalRuler);
        }
        if (elements.cornerBox?.parentNode) {
          elements.cornerBox.parentNode.removeChild(elements.cornerBox);
        }
        if (elements.gridOverlay?.parentNode) {
          elements.gridOverlay.parentNode.removeChild(elements.gridOverlay);
        }

        // Restore canvas transform layer positioning
        if (canvas.transformLayer) {
          canvas.transformLayer.style.top = "0";
          canvas.transformLayer.style.left = "0";
        }
      },
    };
  } catch (error) {
    console.error("Failed to create rulers:", error);
    return null;
  }
}

// Re-export types for convenience
export type { RulerOptions, RulerSystem } from "../../types/index.js";
