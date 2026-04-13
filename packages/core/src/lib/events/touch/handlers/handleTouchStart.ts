import { getTouchCenter } from "@/lib/events/touch/geometry/getTouchCenter";
import { getTouchDistance } from "@/lib/events/touch/geometry/getTouchDistance";
import type { TouchState } from "@/types/index";

/**
 * Captures the current touch list and, for a two-finger gesture, seeds pinch state (`lastDistance`, `lastCenter`).
 *
 * @param event - `touchstart`; `preventDefault` is called so the listener can use `{ passive: false }`.
 * @param touchState - Mutable gesture state shared with move/end handlers.
 */
export function handleTouchStart(event: TouchEvent, touchState: TouchState): void {
  event.preventDefault();

  touchState.touches = Array.from(event.touches);

  if (touchState.touches.length === 2) {
    touchState.lastDistance = getTouchDistance(touchState.touches[0], touchState.touches[1]);
    touchState.lastCenter = getTouchCenter(touchState.touches[0], touchState.touches[1]);
  }
}
