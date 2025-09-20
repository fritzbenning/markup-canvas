import type { EventCanvas as Canvas, TouchEventsOptions, TouchState, Transform } from "../../types/index.js";
import { RULER_SIZE } from "../constants.js";
import { disableSmoothTransitions } from "../transform/index.js";
import { rafThrottle } from "../utils/raf-scheduler.js";
import { DEFAULT_TOUCH_CONFIG } from "./constants.js";
import { ContinuousZoomUpdater } from "./continuous-zoom-updater.js";
import { GestureSmoother } from "./gesture-smoothing.js";
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

  // Create gesture smoother for better pinch-to-zoom experience
  const gestureSmoother = new GestureSmoother();

  // Create continuous zoom updater for smooth long gestures
  const continuousZoomUpdater = new ContinuousZoomUpdater(canvas);

  function handleTouchStart(event: TouchEvent): void {
    event.preventDefault();

    touchState.touches = Array.from(event.touches);

    if (touchState.touches.length === 2 && config.enableMultiTouch) {
      touchState.lastDistance = getTouchDistance(touchState.touches[0], touchState.touches[1]);
      touchState.lastCenter = getTouchCenter(touchState.touches[0], touchState.touches[1]);

      // Reset gesture smoother on new pinch gesture
      gestureSmoother.reset(canvas.transform.scale);
    }

    disableSmoothTransitions(canvas.transformLayer);
  }

  // Enhanced RAF-throttled touch move handler for smooth gesture performance
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

        // Apply gesture smoothing for better experience
        const smoothedZoomFactor = gestureSmoother.smoothZoomFactor(rawZoomFactor, canvas.transform.scale);

        // Apply zoom factor limiting for touch pinch gestures (with touch flag)
        const limitedZoomFactor = limitZoomFactor(smoothedZoomFactor, true);

        if (limitedZoomFactor !== null) {
          // Calculate target zoom level
          const targetZoom = canvas.transform.scale * limitedZoomFactor;

          // Use continuous zoom updater for smooth transitions
          continuousZoomUpdater.updateTargetZoom(targetZoom, centerX, centerY);
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
      // Stop continuous zoom updates when gesture ends
      continuousZoomUpdater.stopContinuousZoom();
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

  // Expose gesture smoother and continuous zoom updater for debugging
  (canvas as any)._gestureSmoother = gestureSmoother;
  (canvas as any)._continuousZoomUpdater = continuousZoomUpdater;

  return () => {
    canvas.container.removeEventListener("touchstart", handleTouchStart);
    canvas.container.removeEventListener("touchmove", handleTouchMove);
    canvas.container.removeEventListener("touchend", handleTouchEnd);
  };
}
