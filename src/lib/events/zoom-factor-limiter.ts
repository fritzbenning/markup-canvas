import { ZOOM_FACTOR_LIMIT } from "../constants.js";

/**
 * Limits zoom factor to prevent too rapid zoom changes per frame
 * @param requestedZoomFactor - Requested zoom factor from input event
 * @param isTouch - Whether this is from a touch gesture (allows more aggressive changes)
 * @returns Limited zoom factor or null if change is too small
 */
export function limitZoomFactor(requestedZoomFactor: number, isTouch: boolean = false): number | null {
  // Skip if change is too small
  const factorChange = Math.abs(requestedZoomFactor - 1.0);
  if (factorChange < ZOOM_FACTOR_LIMIT.MIN_ZOOM_FACTOR_CHANGE) {
    return null;
  }

  // Use much more permissive limits for touch gestures to maintain smoothness
  const maxFactor = isTouch
    ? ZOOM_FACTOR_LIMIT.MAX_ZOOM_FACTOR_PER_FRAME * 2.0
    : ZOOM_FACTOR_LIMIT.MAX_ZOOM_FACTOR_PER_FRAME;
  const minFactor = isTouch
    ? ZOOM_FACTOR_LIMIT.MIN_ZOOM_FACTOR_PER_FRAME * 0.5
    : ZOOM_FACTOR_LIMIT.MIN_ZOOM_FACTOR_PER_FRAME;

  // Clamp zoom factor to our maximum allowed range per frame
  const limitedZoomFactor = Math.max(minFactor, Math.min(requestedZoomFactor, maxFactor));

  return limitedZoomFactor;
}
