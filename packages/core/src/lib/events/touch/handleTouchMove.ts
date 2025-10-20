import { getTouchCenter } from "@/lib/events/touch/getTouchCenter.js";
import { getTouchDistance } from "@/lib/events/touch/getTouchDistance.js";
import { withRAFThrottle, withRulerOffsetObject } from "@/lib/helpers/index.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { applyZoomToCanvas } from "@/lib/transform/applyZoomToCanvas.js";
import type { TouchState, Transform } from "@/types/index.js";

export function handleTouchMove(event: TouchEvent, canvas: MarkupCanvas, touchState: TouchState): void {
  event.preventDefault();

  const currentTouches = Array.from(event.touches);

  // Enhanced RAF-throttled touch move handler for smooth gesture performance
  const handleTouchMoveThrottled = withRAFThrottle((...args: unknown[]) => {
    const touches = args[0] as Touch[];
    if (touches.length === 1) {
      // Single touch pan
      if (touchState.touches.length === 1) {
        const deltaX = touches[0].clientX - touchState.touches[0].clientX;
        const deltaY = touches[0].clientY - touchState.touches[0].clientY;

        const newTransform: Partial<Transform> = {
          translateX: canvas.transform.translateX + deltaX,
          translateY: canvas.transform.translateY + deltaY,
        };

        canvas.updateTransform(newTransform);
      }
    } else if (touches.length === 2) {
      // Two finger pinch zoom
      const currentDistance = getTouchDistance(touches[0], touches[1]);
      const currentCenter = getTouchCenter(touches[0], touches[1]);

      if (touchState.lastDistance > 0) {
        const rawZoomFactor = currentDistance / touchState.lastDistance;

        // Get center relative to canvas content area (accounting for rulers)
        const rect = canvas.container.getBoundingClientRect();
        let centerX = currentCenter.x - rect.left;
        let centerY = currentCenter.y - rect.top;

        // Account for ruler offset if rulers are present
        const adjustedCenter = withRulerOffsetObject(canvas, canvas.config.rulerSize, { x: centerX, y: centerY }, (adjusted) => adjusted);
        centerX = adjustedCenter.x;
        centerY = adjustedCenter.y;

        // Touch zoom uses global transition settings
        applyZoomToCanvas(canvas, rawZoomFactor, centerX, centerY);
      }

      touchState.lastDistance = currentDistance;
      touchState.lastCenter = currentCenter;
    }

    touchState.touches = touches;
  });

  handleTouchMoveThrottled(currentTouches);
}
