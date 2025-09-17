import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM } from "../constants.js";

export function clampZoom(scale: number): number {
  if (typeof scale !== "number" || !Number.isFinite(scale)) {
    return DEFAULT_ZOOM;
  }

  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
}
