import { updateTransform } from "@/lib/actions/transform/updateTransform.js";
import { getZoomToMouseTransform } from "@/lib/matrix/getZoomToMouseTransform.js";
import { withTransition } from "@/lib/transition/index.js";
import type { Canvas, MarkupCanvasConfig } from "@/types/index.js";

export function zoomToPoint(
  canvas: Canvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  x: number,
  y: number,
  targetScale: number
): boolean {
  return withTransition(transformLayer, config, () => {
    const newTransform = getZoomToMouseTransform(x, y, canvas.transform, targetScale / canvas.transform.scale, config);
    return updateTransform(canvas, newTransform);
  });
}
