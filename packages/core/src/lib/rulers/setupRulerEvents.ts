import { withRAFThrottle } from "@/lib/helpers/index.js";
import type { RulerCanvas as Canvas, Transform } from "@/types/index.js";

export function setupRulerEvents(canvas: Canvas, updateCallback: () => void): () => void {
  const throttledUpdateCallback = withRAFThrottle(updateCallback);

  const originalUpdateTransform = canvas.updateTransform;
  canvas.updateTransform = function (newTransform: Partial<Transform>): boolean {
    const result = originalUpdateTransform.call(this, newTransform);
    throttledUpdateCallback();
    return result;
  };

  const resizeHandler = withRAFThrottle(updateCallback);
  window.addEventListener("resize", resizeHandler);

  return () => {
    window.removeEventListener("resize", resizeHandler);
    canvas.updateTransform = originalUpdateTransform;
    throttledUpdateCallback.cleanup();
    resizeHandler.cleanup();
  };
}
