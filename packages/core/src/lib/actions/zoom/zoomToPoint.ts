import { updateTransform } from "@/lib/actions/transform/updateTransform.js";
import { getZoomToMouseTransform } from "@/lib/matrix/getZoomToMouseTransform.js";
import { withTransition } from "@/lib/transition/index.js";
import type { BaseCanvas, MarkupCanvasConfig } from "@/types/index.js";

export function zoomToPoint(
  baseCanvas: BaseCanvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
  x: number,
  y: number,
  targetScale: number
): boolean {
  return withTransition(transformLayer, config, () => {
    const newTransform = getZoomToMouseTransform(x, y, baseCanvas.transform, targetScale / baseCanvas.transform.scale, config);
    return updateTransform(baseCanvas, newTransform);
  });
}
