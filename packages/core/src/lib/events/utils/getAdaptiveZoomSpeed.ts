import { ADAPTIVE_ZOOM_FACTOR, REFERENCE_DISPLAY_AREA } from "@/lib/events/constants.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";

export function getAdaptiveZoomSpeed(canvas: MarkupCanvas, baseSpeed: number): number {
  if (!canvas?.getBounds) {
    return baseSpeed;
  }

  try {
    const bounds = canvas.getBounds();
    const displayArea = bounds.width * bounds.height;

    const rawScaleFactor = (displayArea / REFERENCE_DISPLAY_AREA) ** ADAPTIVE_ZOOM_FACTOR;
    const adaptiveSpeed = baseSpeed * rawScaleFactor;

    return adaptiveSpeed;
  } catch (error) {
    console.warn("Failed to calculate adaptive zoom speed, using base speed:", error);
    return baseSpeed;
  }
}
