import { CLICK_THRESHOLDS } from "@/lib/events/constants";
import { withRAFThrottle } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig, Transform } from "@/types/index";

/**
 * While the left button is down, marks a gesture as drag when movement exceeds a threshold, then
 * applies throttled pan updates by delta from the last position when a drag is active.
 *
 * @param event - `mousemove` on `document`.
 * @param canvas - Canvas instance; reads `transform` and calls `updateTransform`.
 * @param config - Resolved config (`requireSpaceForMouseDrag`).
 * @param isDragEnabled - Whether drag is enabled.
 * @param isDragging - Whether this pointer is currently dragging (pans when true).
 * @param isSpacePressed - Space held when space is required to drag.
 * @param mouseDownTime - Non-zero while tracking a left-button press for click-vs-drag.
 * @param mouseDownX - Left-button down client X.
 * @param mouseDownY - Left-button down client Y.
 * @param lastMouseX - Previous move client X for delta.
 * @param lastMouseY - Previous move client Y for delta.
 * @param setters - Updates drag and last-position state.
 *
 * @example
 * ```ts
 * handleMouseMove(event, canvas, config, true, true, true, t, x0, y0, lx, ly, setters);
 * ```
 */
export function handleMouseMove(
  event: MouseEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  isDragEnabled: boolean,
  isDragging: boolean,
  isSpacePressed: boolean,
  mouseDownTime: number,
  mouseDownX: number,
  mouseDownY: number,
  lastMouseX: number,
  lastMouseY: number,
  setters: {
    setHasDragged: (value: boolean) => void;
    setIsDragging: (value: boolean) => void;
    setLastMouseX: (value: number) => void;
    setLastMouseY: (value: number) => void;
  }
): void {
  if (mouseDownTime > 0) {
    const deltaX = Math.abs(event.clientX - mouseDownX);
    const deltaY = Math.abs(event.clientY - mouseDownY);
    if (deltaX > CLICK_THRESHOLDS.MAX_MOVEMENT || deltaY > CLICK_THRESHOLDS.MAX_MOVEMENT) {
      setters.setHasDragged(true);

      // Check if drag is allowed based on configuration
      const canDrag = config.requireSpaceForMouseDrag ? isSpacePressed : true;

      if (!isDragging && isDragEnabled && canDrag) {
        setters.setIsDragging(true);
      }
    }
  }

  if (!isDragging || !isDragEnabled) return;

  event.preventDefault();

  const handleMouseMoveThrottled = withRAFThrottle((...args: unknown[]) => {
    const moveEvent = args[0] as MouseEvent;
    if (!isDragging || !isDragEnabled) return;

    const deltaX = moveEvent.clientX - lastMouseX;
    const deltaY = moveEvent.clientY - lastMouseY;

    const newTransform: Partial<Transform> = {
      translateX: canvas.transform.translateX + deltaX,
      translateY: canvas.transform.translateY + deltaY,
    };

    canvas.updateTransform(newTransform);

    setters.setLastMouseX(moveEvent.clientX);
    setters.setLastMouseY(moveEvent.clientY);
  });

  handleMouseMoveThrottled(event);
}
