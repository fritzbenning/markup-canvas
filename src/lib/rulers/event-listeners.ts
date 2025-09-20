import type { RulerCanvas as Canvas, Transform } from "../../types/index.js";
import { rafThrottle } from "../utils/raf-scheduler.js";

// Set up event listeners for ruler updates
export function setupEventListeners(canvas: Canvas, updateCallback: () => void): () => void {
  // RAF-throttled update callback for smooth performance
  const throttledUpdateCallback = rafThrottle(updateCallback);

  // Listen for canvas transform updates
  const originalUpdateTransform = canvas.updateTransform;
  canvas.updateTransform = function (newTransform: Partial<Transform>): boolean {
    const result = originalUpdateTransform.call(this, newTransform);
    throttledUpdateCallback();
    return result;
  };

  // RAF-throttled resize handler
  const resizeHandler = rafThrottle(updateCallback);
  window.addEventListener("resize", resizeHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener("resize", resizeHandler);
    canvas.updateTransform = originalUpdateTransform;
  };
}
