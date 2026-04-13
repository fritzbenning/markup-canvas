import { getViewportCenter, withClampedZoom } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Animates the viewport to scale `1` (clamped to config limits), zooming about the current viewport center.
 *
 * @param canvas - Markup canvas instance (provides bounds via `getBounds`).
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @param zoomToPoint - Zoom implementation, typically bound to the canvas (content-space pivot + target scale).
 * @returns Whether the zoom operation reported success.
 */
export function resetViewToCenter(
  canvas: MarkupCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean
): boolean {
  return withTransition(transformLayer, config, () => {
    return withClampedZoom(config, (clamp) => {
      const newScale = clamp(1.0);

      const center = getViewportCenter(canvas);
      return zoomToPoint(center.x, center.y, newScale);
    });
  });
}
