import type { EventCanvas as Canvas, KeyboardNavigationOptions, Transform } from "../../types/index.js";
import { clampZoom } from "../matrix/zoom-clamping.js";
import { getAdaptiveZoomSpeed } from "./adaptive-speed.js";
import { DEFAULT_KEYBOARD_CONFIG } from "./constants.js";

// Sets up keyboard navigation for a canvas
export function setupKeyboardNavigation(canvas: Canvas, options: KeyboardNavigationOptions = {}): () => void {
  const config: Required<KeyboardNavigationOptions> = {
    ...DEFAULT_KEYBOARD_CONFIG,
    ...options,
  };

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
        if (canvas.resetView) {
          canvas.resetView(0); // No transition for keyboard reset
        }
        handled = true;
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

  return () => {
    canvas.container.removeEventListener("keydown", handleKeyDown);
  };
}
