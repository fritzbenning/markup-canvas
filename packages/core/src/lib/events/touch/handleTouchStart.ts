import { getTouchCenter } from "@/lib/events/touch/getTouchCenter.js";
import { getTouchDistance } from "@/lib/events/touch/getTouchDistance.js";
import type { TouchState } from "@/types/index.js";

export function handleTouchStart(event: TouchEvent, touchState: TouchState): void {
  event.preventDefault();

  touchState.touches = Array.from(event.touches);

  if (touchState.touches.length === 2) {
    touchState.lastDistance = getTouchDistance(touchState.touches[0], touchState.touches[1]);
    touchState.lastCenter = getTouchCenter(touchState.touches[0], touchState.touches[1]);
  }
}
