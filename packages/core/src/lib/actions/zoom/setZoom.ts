import { getViewportCenter, withClampedZoom } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Sets absolute zoom level about the viewport center, clamped to {@link MarkupCanvasConfig.minZoom} / {@link MarkupCanvasConfig.maxZoom}.
 *
 * @param canvas - Markup canvas instance.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @param zoomToPoint - Zoom implementation (viewport-center pivot).
 * @param zoomLevel - Desired scale factor.
 * @returns Whether the zoom operation reported success.
 */
export function setZoom(
  canvas: MarkupCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean,
  zoomLevel: number,
): boolean {
  return withTransition(transformLayer, config, () => {
    return withClampedZoom(config, (clamp) => {
      const newScale = clamp(zoomLevel);

      const center = getViewportCenter(canvas);
      return zoomToPoint(center.x, center.y, newScale);
    });
  });
}
