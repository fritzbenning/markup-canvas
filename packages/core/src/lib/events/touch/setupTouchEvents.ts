import { handleTouchEnd } from "@/lib/events/touch/handleTouchEnd.js";
import { handleTouchMove } from "@/lib/events/touch/handleTouchMove.js";
import { handleTouchStart } from "@/lib/events/touch/handleTouchStart.js";
import type { Canvas, TouchState } from "@/types/index.js";

export function setupTouchEvents(canvas: Canvas): () => void {
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
