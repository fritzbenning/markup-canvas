import type { EventCanvas as Canvas, TouchEventsOptions, TouchState, Transform } from "../../types/index.js";
import { RULER_SIZE } from "../constants.js";
import { getZoomToMouseTransform } from "../matrix/zoom-to-mouse.js";
import { disableSmoothTransitions } from "../transform/index.js";
import { rafThrottle } from "../utils/raf-scheduler.js";
import { DEFAULT_TOUCH_CONFIG } from "./constants.js";
import { limitZoomFactor } from "./zoom-factor-limiter.js";

// Calculates distance between two touch points
function getTouchDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculates center point between two touches
function getTouchCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

// Sets up basic touch events for mobile support
export function setupTouchEvents(canvas: Canvas, options: TouchEventsOptions = {}): () => void {
  const config: Required<TouchEventsOptions> = {
    ...DEFAULT_TOUCH_CONFIG,
    ...options,
  };

  const touchState: TouchState = {
    touches: [],
    lastDistance: 0,
    lastCenter: { x: 0, y: 0 },
  };

  function handleTouchStart(event: TouchEvent): void {
    event.preventDefault();

    touchState.touches = Array.from(event.touches);

    if (touchState.touches.length === 2 && config.enableMultiTouch) {
      touchState.lastDistance = getTouchDistance(touchState.touches[0], touchState.touches[1]);
      touchState.lastCenter = getTouchCenter(touchState.touches[0], touchState.touches[1]);
    }

    disableSmoothTransitions(canvas.transformLayer);
  }

  // RAF-throttled touch move handler for smooth performance
  const handleTouchMoveThrottled = rafThrottle((currentTouches: Touch[]) => {
    if (currentTouches.length === 1 && config.enableSingleTouchPan) {
      // Single touch pan
      if (touchState.touches.length === 1) {
        const deltaX = currentTouches[0].clientX - touchState.touches[0].clientX;
        const deltaY = currentTouches[0].clientY - touchState.touches[0].clientY;

        const newTransform: Partial<Transform> = {
          translateX: canvas.transform.translateX + deltaX,
          translateY: canvas.transform.translateY + deltaY,
        };

        canvas.updateTransform(newTransform);
      }
    } else if (currentTouches.length === 2 && config.enableMultiTouch) {
      // Two finger pinch zoom
      const currentDistance = getTouchDistance(currentTouches[0], currentTouches[1]);
      const currentCenter = getTouchCenter(currentTouches[0], currentTouches[1]);

      if (touchState.lastDistance > 0) {
        const rawZoomFactor = currentDistance / touchState.lastDistance;

        // Apply zoom factor limiting for touch pinch gestures
        const limitedZoomFactor = limitZoomFactor(rawZoomFactor);

        if (limitedZoomFactor !== null) {
          // Get center relative to canvas content area (accounting for rulers)
          const rect = canvas.container.getBoundingClientRect();
          let centerX = currentCenter.x - rect.left;
          let centerY = currentCenter.y - rect.top;

          // Account for ruler offset if rulers are present
          const hasRulers = canvas.container.querySelector(".canvas-ruler") !== null;
          if (hasRulers) {
            centerX -= RULER_SIZE;
            centerY -= RULER_SIZE;
          }

          const newTransform = getZoomToMouseTransform(centerX, centerY, canvas.transform, limitedZoomFactor);

          canvas.updateTransform(newTransform);
        }
      }

      touchState.lastDistance = currentDistance;
      touchState.lastCenter = currentCenter;
    }

    touchState.touches = currentTouches;
  });

  function handleTouchMove(event: TouchEvent): void {
    event.preventDefault();

    const currentTouches = Array.from(event.touches);
    handleTouchMoveThrottled(currentTouches);
  }

  function handleTouchEnd(event: TouchEvent): void {
    touchState.touches = Array.from(event.touches);

    if (touchState.touches.length < 2) {
      touchState.lastDistance = 0;
    }
  }

  canvas.container.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  canvas.container.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  canvas.container.addEventListener("touchend", handleTouchEnd, {
    passive: false,
  });

  return () => {
    canvas.container.removeEventListener("touchstart", handleTouchStart);
    canvas.container.removeEventListener("touchmove", handleTouchMove);
    canvas.container.removeEventListener("touchend", handleTouchEnd);
  };
}
