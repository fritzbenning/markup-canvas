import { getZoomToMouseTransform } from "@/lib/matrix/getZoomToMouseTransform";
import { updateTransform } from "@/lib/transform/updateTransform";
import { withTransition } from "@/lib/transition/index";
import type { Canvas, MarkupCanvasConfig } from "@/types/index";

/**
 * Zooms toward the requested absolute scale while keeping the content-space point `(x, y)` fixed under the cursor.
 *
 * @param canvas - Canvas state and layers.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @param x - Content-space X pivot.
 * @param y - Content-space Y pivot.
 * @param targetScale - Desired absolute scale after the operation.
 * @returns Whether {@link updateTransform} succeeded.
 */
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
