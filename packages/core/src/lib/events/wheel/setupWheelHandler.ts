import { createTrackpadPanHandler } from "@/lib/events/trackpad/createTrackpadPanHandler";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture";
import { handleWheel } from "@/lib/events/wheel/handleWheel";
import type { Canvas, MarkupCanvasConfig } from "@/types";

export function setupWheelEvents(canvas: Canvas, config: Required<MarkupCanvasConfig>): () => void {
  const trackpadPanHandler = createTrackpadPanHandler(canvas);

  const wheelHandler = (event: WheelEvent) => {
    const gestureInfo = detectTrackpadGesture(event);

    if (gestureInfo.isTrackpadScroll) {
      return trackpadPanHandler(event);
    }

    return handleWheel(event, canvas, config);
  };

  canvas.container.addEventListener("wheel", wheelHandler, { passive: false });

  return () => {
    canvas.container.removeEventListener("wheel", wheelHandler);
  };
}
