import { getAdaptiveZoomSpeed } from "@/lib/events/utils/getAdaptiveZoomSpeed.js";
import { withRulerOffsets } from "@/lib/helpers/index.js";
import { clampZoom } from "@/lib/matrix/clampZoom.js";
import { getZoomToMouseTransform } from "@/lib/matrix/getZoomToMouseTransform.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function setupKeyboardEvents(canvas: Canvas, config: Required<MarkupCanvasConfig>): () => void {
  // Track mouse position
  let lastMouseX = 0;
  let lastMouseY = 0;

  function handleMouseMove(event: MouseEvent): void {
    const rect = canvas.container.getBoundingClientRect();
    const rawMouseX = event.clientX - rect.left;
    const rawMouseY = event.clientY - rect.top;

    withRulerOffsets(canvas, rawMouseX, rawMouseY, (adjustedX, adjustedY) => {
      lastMouseX = adjustedX;
      lastMouseY = adjustedY;
    });
  }

  function handleKeyDown(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;

    if (config.limitKeyboardEventsToCanvas && document.activeElement !== canvas.container) return;

    const isFastPan = event.shiftKey;
    const panDistance = config.keyboardPanStep * (isFastPan ? config.keyboardFastMultiplier : 1);

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
            ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep)
            : config.keyboardZoomStep;
          newTransform.scale = clampZoom(canvas.transform.scale * (1 + adaptiveZoomStep), config);
          handled = true;
        }
        break;
      case "-":
        {
          const adaptiveZoomStep = config.enableAdaptiveSpeed
            ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep)
            : config.keyboardZoomStep;
          newTransform.scale = clampZoom(canvas.transform.scale * (1 - adaptiveZoomStep), config);
          handled = true;
        }
        break;
      case "0":
        if (event.metaKey || event.ctrlKey) {
          const targetScale = 1.0;
          const zoomFactor = targetScale / canvas.transform.scale;

          const zoomTransform = getZoomToMouseTransform(lastMouseX, lastMouseY, canvas.transform, zoomFactor, config);

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
        if (!event.metaKey && !event.ctrlKey && !event.altKey && canvas.toggleRulers) {
          canvas.toggleRulers();
          handled = true;
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      if (Object.keys(newTransform).length > 0) {
        canvas.updateTransform(newTransform);
      }
    }
  }

  const keyboardTarget = config.limitKeyboardEventsToCanvas ? canvas.container : document;

  keyboardTarget.addEventListener("keydown", handleKeyDown);
  canvas.container.addEventListener("mousemove", handleMouseMove);

  return () => {
    keyboardTarget.removeEventListener("keydown", handleKeyDown);
    canvas.container.removeEventListener("mousemove", handleMouseMove);
  };
}
