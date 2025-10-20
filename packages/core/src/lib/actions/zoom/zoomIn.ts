import { getViewportCenter } from "@/lib/events/utils/getViewportCenter.js";
import { withClampedZoom } from "@/lib/helpers/index.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { BaseCanvas, MarkupCanvasConfig } from "@/types/index.js";

export function zoomIn(
  canvas: MarkupCanvas,
  baseCanvas: BaseCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  zoomToPoint: (x: number, y: number, targetScale: number) => boolean,
  factor: number = 0.5
): boolean {
  return withTransition(transformLayer, config, () => {
    return withClampedZoom(config, (clamp) => {
      const newScale = clamp(baseCanvas.transform.scale * (1 + factor));
      const center = getViewportCenter(canvas);
      return zoomToPoint(center.x, center.y, newScale);
    });
  });
}
