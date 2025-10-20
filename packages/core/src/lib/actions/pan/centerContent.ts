import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function centerContent(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  updateTransformFn: (newTransform: Partial<Transform>) => boolean,
  transformLayer: HTMLElement
): boolean {
  return withTransition(transformLayer, config, () => {
    const bounds = getCanvasBounds(canvas, config);
    const centerX = (bounds.width - bounds.contentWidth * canvas.transform.scale) / 2;
    const centerY = (bounds.height - bounds.contentHeight * canvas.transform.scale) / 2;

    return updateTransformFn({
      translateX: centerX,
      translateY: centerY,
    });
  });
}
