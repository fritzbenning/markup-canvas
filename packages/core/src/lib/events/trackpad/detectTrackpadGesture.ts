import type { GestureInfo } from "@/types/index.js";

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
