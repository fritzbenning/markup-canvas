import type { TouchState } from "@/types/index.js";

export function handleTouchEnd(event: TouchEvent, touchState: TouchState): void {
  touchState.touches = Array.from(event.touches);

  if (touchState.touches.length < 2) {
    touchState.lastDistance = 0;
  }
}
