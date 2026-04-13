import { getCanvasBounds } from "@/lib/canvas";
import { withTransition } from "@/lib/transition/withTransition";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";

/**
 * Pans the view so scaled content is centered within the visible canvas area.
 *
 * Runs inside {@link withTransition} when transitions are enabled.
 *
 * @param canvas - Canvas state and DOM layers.
 * @param config - Resolved configuration (content size, rulers, etc.).
 * @param updateTransform - Applies a partial transform; return value is propagated.
 * @param transformLayer - Layer element used for transition styling.
 * @returns Whether the transform update succeeded.
 */
export function centerContent(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean,
  transformLayer: HTMLElement
): boolean {
  return withTransition(transformLayer, config, () => {
    const bounds = getCanvasBounds(canvas, config);
    const centerX = (bounds.width - bounds.contentWidth * canvas.transform.scale) / 2;
    const centerY = (bounds.height - bounds.contentHeight * canvas.transform.scale) / 2;

    return updateTransform({
      translateX: centerX,
      translateY: centerY,
    });
  });
}
