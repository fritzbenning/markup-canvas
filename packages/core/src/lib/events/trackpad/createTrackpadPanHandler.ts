import { withRAFThrottle } from "@/lib/helpers/index.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { disableTransition } from "@/lib/transition";
import type { Transform } from "@/types";

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
