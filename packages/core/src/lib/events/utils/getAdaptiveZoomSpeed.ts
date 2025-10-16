import { ADAPTIVE_ZOOM_FACTOR, REFERENCE_DISPLAY_AREA } from "@/lib/events/constants.js";
import type { BaseCanvas } from "@/types/index.js";

export function getAdaptiveZoomSpeed(canvas: BaseCanvas, baseSpeed: number): number {
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
