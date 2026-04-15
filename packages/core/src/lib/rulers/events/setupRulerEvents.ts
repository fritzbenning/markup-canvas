import { withRAFThrottle } from "@/lib/helpers";
import type { RulerCanvas as Canvas, Transform } from "@/types/index";

export function setupRulerEvents(canvas: Canvas, updateCallback: () => void): () => void {
  const throttledUpdateCallback = withRAFThrottle(updateCallback);
  const resizeHandler = withRAFThrottle(updateCallback);
  window.addEventListener("resize", resizeHandler);

  if (canvas.event) {
    const onTransform = (): void => {
      throttledUpdateCallback();
    };
    canvas.event.on("transform", onTransform);

    return () => {
      canvas.event!.off("transform", onTransform);
      window.removeEventListener("resize", resizeHandler);
      throttledUpdateCallback.cleanup();
      resizeHandler.cleanup();
    };
  }

  // Fallback for test doubles that don't provide an event emitter.
  const originalUpdateTransform = canvas.updateTransform;
  canvas.updateTransform = function (newTransform: Partial<Transform>): boolean {
    const result = originalUpdateTransform.call(this, newTransform);
    throttledUpdateCallback();
    return result;
  };

  return () => {
    canvas.updateTransform = originalUpdateTransform;
    window.removeEventListener("resize", resizeHandler);
    throttledUpdateCallback.cleanup();
    resizeHandler.cleanup();
  };
}
