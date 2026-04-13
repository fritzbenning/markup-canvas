import { handleClickToZoom } from "@/lib/events/mouse/handlers/handleClickToZoom";
import { resetClickState } from "@/lib/events/mouse/state/resetClickState";
import { resetDragState } from "@/lib/events/shared/resetDragState";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Completes a pan drag on button release, runs click-to-zoom for short left clicks when enabled,
 * then clears click-tracking state for the left button.
 *
 * @param event - `mouseup` (typically on `document`).
 * @param canvas - Canvas instance.
 * @param config - Resolved config.
 * @param isDragEnabled - Whether drag is enabled.
 * @param isSpacePressed - Space held for space-to-pan mode.
 * @param isDragging - Whether a drag was active.
 * @param dragButton - Button index used for the current drag (`-1` if none).
 * @param mouseDownTime - Timestamp from left-button down (0 if not tracking).
 * @param hasDragged - Whether movement exceeded the click threshold.
 * @param setters - Drag and click-tracking setters.
 *
 * @example
 * ```ts
 * handleMouseUp(event, canvas, config, true, false, true, 0, t, false, setters);
 * ```
 */
export function handleMouseUp(
  event: MouseEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isSpacePressed: boolean,
  isDragging: boolean,
  dragButton: number,
  mouseDownTime: number,
  hasDragged: boolean,
  setters: {
    setIsDragging: (value: boolean) => void;
    setDragButton: (value: number) => void;
    setMouseDownTime: (value: number) => void;
    setHasDragged: (value: boolean) => void;
  }
): void {
  if (isDragging && event.button === dragButton) {
    resetDragState(canvas, config, isDragEnabled, isSpacePressed, {
      setIsDragging: setters.setIsDragging,
      setDragButton: setters.setDragButton,
    });
  }

  if (isDragEnabled && event.button === 0 && config.enableClickToZoom && mouseDownTime > 0) {
    handleClickToZoom(event, canvas, config, mouseDownTime, hasDragged, isDragging);
  }

  if (event.button === 0) {
    resetClickState({
      setMouseDownTime: setters.setMouseDownTime,
      setHasDragged: setters.setHasDragged,
    });
  }
}
