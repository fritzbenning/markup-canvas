import type { EventCanvas as Canvas, KeyboardNavigationOptions, Transform } from "../../types/index.js";
import { clampZoom } from "../matrix/zoom-clamping.js";
import { getZoomToMouseTransform } from "../matrix/zoom-to-mouse.js";
import { getAdaptiveZoomSpeed } from "./adaptive-speed.js";
import { DEFAULT_KEYBOARD_CONFIG } from "./constants.js";

// Sets up keyboard navigation for a canvas
export function setupKeyboardNavigation(canvas: Canvas, options: KeyboardNavigationOptions = {}): () => void {
  const config: Required<KeyboardNavigationOptions> = {
    ...DEFAULT_KEYBOARD_CONFIG,
    ...options,
  };

  // Track mouse position for zoom-to-cursor functionality
  let lastMouseX = 0;
  let lastMouseY = 0;

  function handleMouseMove(event: MouseEvent): void {
    const rect = canvas.container.getBoundingClientRect();
    lastMouseX = event.clientX - rect.left;
    lastMouseY = event.clientY - rect.top;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // Only handle if canvas container is focused
    if (document.activeElement !== canvas.container) return;

    const isFastPan = event.shiftKey;
    const panDistance = config.panStep * (isFastPan ? config.fastPanMultiplier : 1);

    let handled = false;
    const newTransform: Partial<Transform> = {};

    switch (event.key) {
      case "ArrowLeft":
        newTransform.translateX = canvas.transform.translateX + panDistance;
        handled = true;
        break;
      case "ArrowRight":
        newTransform.translateX = canvas.transform.translateX - panDistance;
        handled = true;
        break;
      case "ArrowUp":
        newTransform.translateY = canvas.transform.translateY + panDistance;
        handled = true;
        break;
      case "ArrowDown":
        newTransform.translateY = canvas.transform.translateY - panDistance;
        handled = true;
        break;
      case "=":
      case "+":
        {
          const adaptiveZoomStep = config.enableAdaptiveSpeed
            ? getAdaptiveZoomSpeed(canvas, config.zoomStep)
            : config.zoomStep;
          newTransform.scale = clampZoom(canvas.transform.scale * (1 + adaptiveZoomStep));
          handled = true;
        }
        break;
      case "-":
        {
          const adaptiveZoomStep = config.enableAdaptiveSpeed
            ? getAdaptiveZoomSpeed(canvas, config.zoomStep)
            : config.zoomStep;
          newTransform.scale = clampZoom(canvas.transform.scale * (1 - adaptiveZoomStep));
          handled = true;
        }
        break;
      case "0":
        // Reset zoom to 100% and center on mouse cursor on Cmd+0 (Mac) or Ctrl+0 (Windows/Linux)
        if (event.metaKey || event.ctrlKey) {
          // Calculate zoom factor to get to 100% (scale = 1.0)
          const targetScale = 1.0;
          const zoomFactor = targetScale / canvas.transform.scale;

          // Get transform that zooms to mouse position
          const zoomTransform = getZoomToMouseTransform(lastMouseX, lastMouseY, canvas.transform, zoomFactor);

          // Apply the transform
          Object.assign(newTransform, zoomTransform);
          handled = true;
        }
        break;
      case "g":
      case "G":
        if (canvas.toggleGrid) {
          canvas.toggleGrid();
        }
        handled = true;
        break;
      case "r":
      case "R":
        if (canvas.toggleRulers) {
          canvas.toggleRulers();
        }
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      if (Object.keys(newTransform).length > 0) {
        canvas.updateTransform(newTransform);
      }
    }
  }

  canvas.container.addEventListener("keydown", handleKeyDown);
  canvas.container.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.container.removeEventListener("keydown", handleKeyDown);
    canvas.container.removeEventListener("mousemove", handleMouseMove);
  };
}
