import { createTrackpadPanHandler } from "@/lib/events/trackpad/createTrackpadPanHandler";
import { detectTrackpadGesture } from "@/lib/events/trackpad/detectTrackpadGesture";
import { handleWheel } from "@/lib/events/wheel/handlers/handleWheel";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Registers a single `wheel` listener on the canvas container that routes trackpad two-axis scroll to pan and everything else to {@link handleWheel}.
 *
 * Trackpad scroll is detected via {@link detectTrackpadGesture} (`isTrackpadScroll`); pinch-zoom and mouse wheel zoom are handled inside {@link handleWheel}. The listener uses `{ passive: false }` so handlers can call `preventDefault`.
 *
 * @param canvas - Target canvas (`canvas.container` receives the listener).
 * @param config - Resolved config passed through to {@link handleWheel}.
 * @returns Disposer that removes the `wheel` listener.
 */
export function setupWheelEvents(canvas: MarkupCanvas, config: Required<MarkupCanvasConfig>): () => void {
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
