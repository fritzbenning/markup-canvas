import type { TouchState } from "@/types/index";

/**
 * Syncs stored touches with `event.touches` and clears the pinch baseline when fewer than two fingers remain.
 *
 * @param event - Typically `touchend`; uses `event.touches` (fingers still on surface).
 * @param touchState - Mutable gesture state; `lastDistance` resets to `0` when a pinch ends.
 */
export function handleTouchEnd(event: TouchEvent, touchState: TouchState): void {
  touchState.touches = Array.from(event.touches);

  if (touchState.touches.length < 2) {
    touchState.lastDistance = 0;
  }
}
