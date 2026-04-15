import { getViewportCenter, withClampedZoom } from "@/lib/helpers";
import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { MarkupCanvasConfig } from "@/types/index";
import { getNextDiscreteZoomScale } from "./getNextDiscreteZoomScale";

/**
 * Zooms out about the viewport center to the previous discrete zoom stop (see `constants.ts`).
 *
 * @param canvas - Markup canvas instance.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @param zoomToPoint - Zoom implementation (viewport-center pivot).
 * @returns Whether the zoom operation reported success.
 */
export function zoomOut(
  canvas: MarkupCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean,
): boolean {
  return withTransition(transformLayer, config, () => {
    return withClampedZoom(config, (clamp) => {
      const newScale = clamp(getNextDiscreteZoomScale(canvas.transform.scale, "out", config));
      const center = getViewportCenter(canvas);

      return zoomToPoint(center.x, center.y, newScale);
    });
  });
}
