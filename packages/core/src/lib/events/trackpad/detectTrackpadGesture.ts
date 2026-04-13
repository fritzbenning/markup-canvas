import type { GestureInfo } from "@/types/index";

/**
 * Classifies a `wheel` event as trackpad vs mouse wheel and separates scroll vs pinch-zoom intent.
 *
 * Trackpad detection uses a score over pixel mode, small deltas, fractional `deltaY`, and two-axis movement; at least two signals must match. Pinch-zoom intent is inferred from `ctrlKey` (Windows/Linux) or `metaKey` (some setups).
 *
 * @param event - The `wheel` event (`deltaX` / `deltaY`, `deltaMode`, modifier keys).
 * @returns Flags for trackpad, mouse wheel, trackpad scroll, trackpad pinch, and any zoom modifier.
 */
export function detectTrackpadGesture(event: WheelEvent): GestureInfo {
  const isZoomIntent = event.ctrlKey || event.metaKey;

  const isPixelMode = event.deltaMode === 0;
  const hasSmallDelta = Math.abs(event.deltaY) < 50;
  const hasFractionalDelta = event.deltaY % 1 !== 0;
  const hasMultiAxis = Math.abs(event.deltaX) > 0 && Math.abs(event.deltaY) > 0;

  const trackpadCriteria = [isPixelMode, hasSmallDelta, hasFractionalDelta, hasMultiAxis];
  const trackpadMatches = trackpadCriteria.filter(Boolean).length;
  const isTrackpad = trackpadMatches >= 2;

  return {
    isTrackpad,
    isMouseWheel: !isTrackpad,
    isTrackpadScroll: isTrackpad && !isZoomIntent,
    isTrackpadPinch: isTrackpad && isZoomIntent,
    isZoomGesture: isZoomIntent,
  };
}
