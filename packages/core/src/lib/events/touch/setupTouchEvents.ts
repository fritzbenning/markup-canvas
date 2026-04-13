import { handleTouchEnd } from "@/lib/events/touch/handlers/handleTouchEnd";
import { handleTouchMove } from "@/lib/events/touch/handlers/handleTouchMove";
import { handleTouchStart } from "@/lib/events/touch/handlers/handleTouchStart";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { TouchState } from "@/types/index";

/**
 * Attaches `touchstart` / `touchmove` / `touchend` listeners on the canvas container for one-finger pan and two-finger pinch zoom.
 *
 * Listeners are registered with `{ passive: false }` so handlers can call `preventDefault` for consistent gesture handling.
 *
 * @param canvas - Target canvas (listeners on `canvas.container`).
 * @returns Disposer that removes all three listeners.
 */
export function setupTouchEvents(canvas: MarkupCanvas): () => void {
  const touchState: TouchState = {
    touches: [],
    lastDistance: 0,
    lastCenter: { x: 0, y: 0 },
  };

  const touchStartHandler = (event: TouchEvent) => {
    handleTouchStart(event, touchState);
  };

  const touchMoveHandler = (event: TouchEvent) => {
    handleTouchMove(event, canvas, touchState);
  };

  const touchEndHandler = (event: TouchEvent) => {
    handleTouchEnd(event, touchState);
  };

  canvas.container.addEventListener("touchstart", touchStartHandler, {
    passive: false,
  });
  canvas.container.addEventListener("touchmove", touchMoveHandler, {
    passive: false,
  });
  canvas.container.addEventListener("touchend", touchEndHandler, {
    passive: false,
  });

  return () => {
    canvas.container.removeEventListener("touchstart", touchStartHandler);
    canvas.container.removeEventListener("touchmove", touchMoveHandler);
    canvas.container.removeEventListener("touchend", touchEndHandler);
  };
}
