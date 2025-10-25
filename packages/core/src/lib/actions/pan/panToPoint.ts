import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function panToPoint(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  x: number,
  y: number,
  updateTransform: (newTransform: Partial<Transform>) => boolean,
  transformLayer: HTMLElement
): boolean {
  return withTransition(transformLayer, config, () => {
    const bounds = getCanvasBounds(canvas, config);
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Calculate new translation to center the point
    const newTranslateX = centerX - x * canvas.transform.scale;
    const newTranslateY = centerY - y * canvas.transform.scale;

    return updateTransform({
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  });
}
