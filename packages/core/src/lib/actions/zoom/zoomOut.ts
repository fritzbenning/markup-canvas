import { getViewportCenter, withClampedZoom } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Zooms out about the viewport center by multiplying the current scale by `(1 - factor)`.
 *
 * @param canvas - Markup canvas instance.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @param zoomToPoint - Zoom implementation (viewport-center pivot).
 * @param factor - Relative zoom delta; defaults to `0.5`.
 * @returns Whether the zoom operation reported success.
 */
export function zoomOut(
  canvas: MarkupCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean,
  factor: number = 0.5,
): boolean {
  return withTransition(transformLayer, config, () => {
    return withClampedZoom(config, (clamp) => {
      const newScale = clamp(canvas.transform.scale * (1 - factor));
      const center = getViewportCenter(canvas);

      return zoomToPoint(center.x, center.y, newScale);
    });
  });
}
