// Main function for creating a complete markup canvas with all event handlers
import { createCanvas } from "./canvas/index.js";
import {
  setupKeyboardNavigation,
  setupMouseDragWithControls,
  setupTouchEvents,
  setupWheelZoom,
} from "./events/index.js";
import { clampZoom } from "./matrix/zoom-clamping.js";
import { createRulers } from "./rulers/index.js";
import { enableSmoothTransitions, disableSmoothTransitions } from "./transform/index.js";

// Import types
import type { Canvas, Transform, MarkupCanvasOptions } from "../types/index.js";

// Initialize a complete markup canvas with all event handlers
export function createMarkupCanvas(container: HTMLElement, options: MarkupCanvasOptions = {}): Canvas | null {
  if (!container) {
    console.error("Container element is required");
    return null;
  }

  // Create canvas
  const canvas = createCanvas(container, options);
  if (!canvas) {
    console.error("Failed to create canvas");
    return null;
  }

  // Set up event handlers
  const cleanupFunctions: (() => void)[] = [];

  try {
    // Wheel zoom
    const wheelCleanup = setupWheelZoom(canvas, {
      smoothTransition: options.smoothTransition !== undefined ? options.smoothTransition : true,
      zoomSpeed: options.zoomSpeed !== undefined ? options.zoomSpeed : 0.4,
      fineZoomSpeed: options.fineZoomSpeed !== undefined ? options.fineZoomSpeed : 0.2,
    });
    cleanupFunctions.push(wheelCleanup);

    // Mouse drag with control functions
    const dragSetup = setupMouseDragWithControls(canvas, {
      enableLeftDrag: options.enableLeftDrag !== undefined ? options.enableLeftDrag : true,
      enableMiddleDrag: options.enableMiddleDrag !== undefined ? options.enableMiddleDrag : true,
      requireSpaceForMouseDrag: options.requireSpaceForMouseDrag || false,
      enableClickToZoom: options.enableClickToZoom !== undefined ? options.enableClickToZoom : true,
      clickZoomLevel: options.clickZoomLevel !== undefined ? options.clickZoomLevel : 1.0,
      clickZoomDuration: options.clickZoomDuration !== undefined ? options.clickZoomDuration : 300,
      requireOptionForClickZoom:
        options.requireOptionForClickZoom !== undefined ? options.requireOptionForClickZoom : false,
    });
    cleanupFunctions.push(dragSetup.cleanup);

    // Keyboard navigation (optional)
    if (options.enableKeyboardControls !== false) {
      const keyboardCleanup = setupKeyboardNavigation(canvas, {
        panStep: 50,
        fastPanMultiplier: 3,
      });
      cleanupFunctions.push(keyboardCleanup);
    }

    // Touch events
    const touchCleanup = setupTouchEvents(canvas, {
      enableSingleTouchPan: true,
      enableMultiTouch: true,
    });
    cleanupFunctions.push(touchCleanup);

    // Set up rulers and grid (if enabled)
    let rulers: ReturnType<typeof createRulers> | null = null;
    if (options.enableRulers !== false) {
      // Default to true
      rulers = createRulers(canvas, {
        showGrid: options.showGrid !== false, // Default to true
        gridColor: options.gridColor || "rgba(0, 123, 255, 0.1)",
      });
      cleanupFunctions.push(() => {
        if (rulers) {
          rulers.destroy();
        }
      });
    }

    // Create extended canvas with additional methods
    const _canvas = canvas as Canvas;

    // Add exposed control functions for custom keyboard implementation
    _canvas.panLeft = (distance: number = 50) => {
      const newTransform: Partial<Transform> = {
        translateX: canvas.transform.translateX + distance,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.panRight = (distance: number = 50) => {
      const newTransform: Partial<Transform> = {
        translateX: canvas.transform.translateX - distance,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.panUp = (distance: number = 50) => {
      const newTransform: Partial<Transform> = {
        translateY: canvas.transform.translateY + distance,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.panDown = (distance: number = 50) => {
      const newTransform: Partial<Transform> = {
        translateY: canvas.transform.translateY - distance,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.zoomIn = (factor: number = 0.1) => {
      const newScale = clampZoom(canvas.transform.scale * (1 + factor));
      const newTransform: Partial<Transform> = {
        scale: newScale,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.zoomOut = (factor: number = 0.1) => {
      const newScale = clampZoom(canvas.transform.scale * (1 - factor));
      const newTransform: Partial<Transform> = {
        scale: newScale,
      };
      return canvas.updateTransform(newTransform);
    };

    _canvas.resetZoom = (duration: number = 0) => {
      if (canvas.resetView) {
        return canvas.resetView(duration);
      }
      return false;
    };

    // Mouse drag control functions
    _canvas.enableMouseDrag = () => {
      return dragSetup.enable();
    };

    _canvas.disableMouseDrag = () => {
      return dragSetup.disable();
    };

    _canvas.isMouseDragEnabled = () => {
      return dragSetup.isEnabled();
    };

    // Grid control functions
    _canvas.toggleGrid = () => {
      if (rulers?.toggleGrid) {
        rulers.toggleGrid();
        return true;
      }
      return false;
    };

    _canvas.showGrid = () => {
      if (rulers?.gridOverlay) {
        rulers.gridOverlay.style.display = "block";
        return true;
      }
      return false;
    };

    _canvas.hideGrid = () => {
      if (rulers?.gridOverlay) {
        rulers.gridOverlay.style.display = "none";
        return true;
      }
      return false;
    };

    _canvas.isGridVisible = () => {
      if (rulers?.gridOverlay) {
        return rulers.gridOverlay.style.display !== "none";
      }
      return false;
    };

    // Ruler control functions
    _canvas.toggleRulers = () => {
      if (rulers) {
        const areVisible = _canvas.areRulersVisible?.() ?? false;
        if (areVisible) {
          rulers.hide();
        } else {
          rulers.show();
        }
        return true;
      }
      return false;
    };

    _canvas.showRulers = () => {
      if (rulers) {
        rulers.show();
        return true;
      }
      return false;
    };

    _canvas.hideRulers = () => {
      if (rulers) {
        rulers.hide();
        return true;
      }
      return false;
    };

    _canvas.areRulersVisible = () => {
      if (rulers?.horizontalRuler) {
        return rulers.horizontalRuler.style.display !== "none";
      }
      return false;
    };

    // Additional utility functions
    _canvas.centerContent = (duration: number = 300) => {
      const bounds = canvas.getBounds();
      const centerX = (bounds.width - bounds.contentWidth * canvas.transform.scale) / 2;
      const centerY = (bounds.height - bounds.contentHeight * canvas.transform.scale) / 2;

      if (duration > 0) {
        enableSmoothTransitions(canvas.transformLayer, duration / 1000);
      }

      const result = canvas.updateTransform({
        translateX: centerX,
        translateY: centerY,
      });

      if (duration > 0) {
        setTimeout(() => {
          if (canvas.transformLayer) {
            disableSmoothTransitions(canvas.transformLayer);
          }
        }, duration + 50);
      }

      return result;
    };

    _canvas.fitToScreen = (duration: number = 300) => {
      return canvas.zoomToFitContent(duration);
    };

    _canvas.getVisibleArea = () => {
      const bounds = canvas.getBounds();
      return bounds.visibleArea;
    };

    _canvas.isPointVisible = (x: number, y: number) => {
      const visibleArea = _canvas.getVisibleArea();
      return (
        x >= visibleArea.x &&
        x <= visibleArea.x + visibleArea.width &&
        y >= visibleArea.y &&
        y <= visibleArea.y + visibleArea.height
      );
    };

    _canvas.scrollToPoint = (x: number, y: number, duration: number = 300) => {
      const bounds = canvas.getBounds();
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Calculate new translation to center the point
      const newTranslateX = centerX - x * canvas.transform.scale;
      const newTranslateY = centerY - y * canvas.transform.scale;

      if (duration > 0) {
        enableSmoothTransitions(canvas.transformLayer, duration / 1000);
      }

      const result = canvas.updateTransform({
        translateX: newTranslateX,
        translateY: newTranslateY,
      });

      if (duration > 0) {
        setTimeout(() => {
          if (canvas.transformLayer) {
            disableSmoothTransitions(canvas.transformLayer);
          }
        }, duration + 50);
      }

      return result;
    };

    // Add cleanup method to canvas
    _canvas.cleanup = () => {
      cleanupFunctions.forEach((cleanup) => {
        cleanup();
      });
    };

    console.log("Zoomable container initialized successfully");
    return _canvas;
  } catch (error) {
    console.error("Failed to set up event handlers:", error);

    // Clean up any handlers that were successfully created
    cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (cleanupError) {
        console.warn("Error during cleanup:", cleanupError);
      }
    });

    return null;
  }
}
