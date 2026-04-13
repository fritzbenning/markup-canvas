import { withRAFThrottle } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { disableTransition } from "@/lib/transition";
import type { Transform } from "@/types";

/**
 * Returns a RAF-throttled handler that pans the canvas from trackpad scroll deltas (`deltaX` / `deltaY`).
 *
 * Translation is updated by subtracting deltas from the current pan (scroll right moves content left). Transitions are disabled on the transform layer before applying the transform. The returned function matches {@link withRAFThrottle} (includes a `cleanup` method).
 *
 * @param canvas - Target canvas; requires `transform`, `updateTransform`, `transformLayer`, and `config`.
 */
export const createTrackpadPanHandler = (canvas: MarkupCanvas) =>
  withRAFThrottle((...args: unknown[]) => {
    const event = args[0] as WheelEvent;
    if (!event || !canvas?.updateTransform) {
      return false;
    }

    try {
      const currentTransform = canvas.transform;

      // Calculate pan delta based on trackpad scroll
      const panSensitivity = 1.0;
      const deltaX = event.deltaX * panSensitivity;
      const deltaY = event.deltaY * panSensitivity;

      // Apply pan by adjusting translation
      const newTransform: Partial<Transform> = {
        scale: currentTransform.scale,
        translateX: currentTransform.translateX - deltaX,
        translateY: currentTransform.translateY - deltaY,
      };

      disableTransition(canvas.transformLayer, canvas.config);

      // Apply the new transform
      return canvas.updateTransform(newTransform);
    } catch (error) {
      console.error("Error handling trackpad pan:", error);
      return false;
    }
  });
