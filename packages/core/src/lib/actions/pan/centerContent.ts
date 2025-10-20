import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function centerContent(
  baseCanvas: BaseCanvas,
  config: Required<MarkupCanvasConfig>,
  updateTransformFn: (newTransform: Partial<Transform>) => boolean,
  transformLayer: HTMLElement
): boolean {
  return withTransition(transformLayer, config, () => {
    const bounds = getCanvasBounds(baseCanvas, config);
    const centerX = (bounds.width - bounds.contentWidth * baseCanvas.transform.scale) / 2;
    const centerY = (bounds.height - bounds.contentHeight * baseCanvas.transform.scale) / 2;

    return updateTransformFn({
      translateX: centerX,
      translateY: centerY,
    });
  });
}
