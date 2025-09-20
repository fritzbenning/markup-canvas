import type { EventCanvas as Canvas } from "../../types/index.js";
import { ADAPTIVE_ZOOM_FACTOR, REFERENCE_DISPLAY_AREA } from "./constants.js";

// Gets display-size adaptive zoom speed based on canvas dimensions
export function getAdaptiveZoomSpeed(canvas: Canvas, baseSpeed: number): number {
  if (!canvas?.getBounds) {
    return baseSpeed;
  }

  try {
    const bounds = canvas.getBounds();
    const displayArea = bounds.width * bounds.height;

    const rawScaleFactor = (displayArea / REFERENCE_DISPLAY_AREA) ** ADAPTIVE_ZOOM_FACTOR;
    const adaptiveSpeed = baseSpeed * rawScaleFactor;

    // Debug logging to understand display differences
    console.log(`Adaptive Speed Debug:`, {
      displaySize: `${bounds.width}×${bounds.height}`,
      displayArea,
      referenceArea: REFERENCE_DISPLAY_AREA,
      scaleFactor: rawScaleFactor,
      baseSpeed,
      adaptiveSpeed,
      speedIncrease: `${((adaptiveSpeed / baseSpeed - 1) * 100).toFixed(1)}%`,
    });

    return adaptiveSpeed;
  } catch (error) {
    console.warn("Failed to calculate adaptive zoom speed, using base speed:", error);
    return baseSpeed;
  }
}
