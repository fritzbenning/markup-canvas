import { withRulerSize } from "@/lib/helpers";
import { updateTransform } from "@/lib/transform/updateTransform";
import { withTransition } from "@/lib/transition/index";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";

/**
 * Resets the view to scale `1` with translation offset for the ruler chrome when rulers are present.
 *
 * @param canvas - Canvas state and layers.
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration (ruler size, transitions).
 * @returns Whether {@link updateTransform} succeeded.
 */
export function resetView(canvas: Canvas, transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): boolean {
  return withTransition(transformLayer, config, () => {
    return withRulerSize(canvas, config.rulerSize, (rulerSize) => {
      const resetTransformData: Transform = {
        scale: 1.0,
        translateX: rulerSize * -1,
        translateY: rulerSize * -1,
      };

      return updateTransform(canvas, resetTransformData);
    });
  });
}
