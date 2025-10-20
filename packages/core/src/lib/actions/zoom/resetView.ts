import { updateTransform } from "@/lib/actions/transform/updateTransform.js";
import { withRulerSize } from "@/lib/helpers/index.js";
import { withTransition } from "@/lib/transition/index.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

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
