import { getViewportCenter } from "@/lib/events/utils/getViewportCenter.js";
import { withClampedZoom } from "@/lib/helpers/index.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

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
