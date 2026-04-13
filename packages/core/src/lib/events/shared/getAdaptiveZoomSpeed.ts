import { ADAPTIVE_ZOOM_FACTOR, REFERENCE_DISPLAY_AREA } from "@/lib/events/constants";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";

/**
 * Scales a zoom step (wheel, keyboard, trackpad) by canvas size so large viewports don’t feel sluggish and small ones don’t jump too fast.
 *
 * Uses `getBounds()` area vs {@link REFERENCE_DISPLAY_AREA} raised to {@link ADAPTIVE_ZOOM_FACTOR}. If `getBounds` is missing or throws, returns `baseSpeed` unchanged.
 *
 * @param canvas - Canvas providing `getBounds()` (typically content bounds in CSS pixels).
 * @param baseSpeed - Nominal step before area scaling (e.g. config zoom step).
 * @returns `baseSpeed` multiplied by the adaptive factor, or `baseSpeed` when bounds are unavailable or invalid.
 */
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
