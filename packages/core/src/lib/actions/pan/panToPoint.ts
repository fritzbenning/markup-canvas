import { getCanvasBounds } from "@/lib/canvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";

/**
 * Pans so the given content-space point `(x, y)` sits at the viewport center.
 *
 * Coordinates are in content space; scaling from {@link Canvas.transform} is applied when computing translation.
 *
 * @param canvas - Canvas state and scale.
 * @param config - Resolved configuration.
 * @param x - Content-space X coordinate to center.
 * @param y - Content-space Y coordinate to center.
 * @param updateTransform - Applies the new translation.
 * @param transformLayer - Layer element used for transition styling.
 * @returns Whether the transform update succeeded.
 */
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
