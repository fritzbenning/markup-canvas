import { sendKeyboardEventToParent } from "@/lib/events/keyboard/sendKeyboardEventToParent.js";
import { getAdaptiveZoomSpeed } from "@/lib/events/utils/getAdaptiveZoomSpeed.js";
import { withFeatureEnabled } from "@/lib/helpers/withFeatureEnabled.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import type { MarkupCanvasConfig, Transform } from "@/types/index.js";
import { isCanvasShortcut } from "./isCanvasShortcut";

export function setupKeyboardEvents(
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  options?: { textEditModeEnabled?: boolean }
): () => void {
  const textEditModeEnabled = options?.textEditModeEnabled ?? false;

  function handleKeyDown(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;

    if (config.bindKeyboardEventsTo === "canvas" && document.activeElement !== canvas.container) return;

    withFeatureEnabled(config, "sendKeyboardEventsToParent", () => {
      // In text edit mode, only send canvas shortcuts to parent
      if (textEditModeEnabled && !isCanvasShortcut(event)) {
        return;
      }

      sendKeyboardEventToParent(event, config);
      event.preventDefault();
    });

    if (config.sendKeyboardEventsToParent) {
      return;
    }

    let handled = false;
    const newTransform: Partial<Transform> = {};

    switch (event.key) {
      case "ArrowLeft":
        if (textEditModeEnabled) {
          return;
        }
        newTransform.translateX = canvas.transform.translateX + config.keyboardPanStep;
        handled = true;
        break;
      case "ArrowRight":
        if (textEditModeEnabled) {
          return;
        }
        newTransform.translateX = canvas.transform.translateX - config.keyboardPanStep;
        handled = true;
        break;
      case "ArrowUp":
        if (textEditModeEnabled) {
          return;
        }
        newTransform.translateY = canvas.transform.translateY + config.keyboardPanStep;
        handled = true;
        break;
      case "ArrowDown":
        if (textEditModeEnabled) {
          return;
        }
        newTransform.translateY = canvas.transform.translateY - config.keyboardPanStep;
        handled = true;
        break;
      case "=":
      case "+":
        if (textEditModeEnabled) {
          return;
        }
        {
          const adaptiveZoomStep = config.enableAdaptiveSpeed
            ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep)
            : config.keyboardZoomStep;
          canvas.zoomIn(adaptiveZoomStep);
          handled = true;
        }
        break;
      case "-":
        if (textEditModeEnabled) {
          return;
        }
        {
          const adaptiveZoomStep = config.enableAdaptiveSpeed
            ? getAdaptiveZoomSpeed(canvas, config.keyboardZoomStep)
            : config.keyboardZoomStep;
          canvas.zoomOut(adaptiveZoomStep);
          handled = true;
        }
        break;
      case "0":
        // Canvas shortcuts should work even in text edit mode
        if (event.ctrlKey) {
          if (canvas.resetView) {
            canvas.resetView();
          }
          handled = true;
        } else if (event.metaKey) {
          if (canvas.resetViewToCenter) {
            canvas.resetViewToCenter();
          }
          handled = true;
        }
        break;
      case "g":
      case "G":
        // Canvas shortcuts should work even in text edit mode
        if (event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey && canvas.toggleGrid) {
          canvas.toggleGrid();
          handled = true;
        }
        break;
      case "r":
      case "R":
        // Canvas shortcuts should work even in text edit mode
        if (event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey && canvas.toggleRulers) {
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

  const keyboardTarget = config.bindKeyboardEventsTo === "canvas" ? canvas.container : document;

  keyboardTarget.addEventListener("keydown", handleKeyDown);

  return () => {
    keyboardTarget.removeEventListener("keydown", handleKeyDown);
  };
}
