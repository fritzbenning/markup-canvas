import { updateTransform } from "@/lib/actions/transform/updateTransform.js";
import { withRulerSize } from "@/lib/helpers/index.js";
import { withTransition } from "@/lib/transition/index.js";
import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function resetView(baseCanvas: BaseCanvas, transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): boolean {
  return withTransition(transformLayer, config, () => {
    return withRulerSize(baseCanvas, config.rulerSize, (rulerSize) => {
      const resetTransformData: Transform = {
        scale: 1.0,
        translateX: rulerSize * -1,
        translateY: rulerSize * -1,
      };
      return updateTransform(baseCanvas, resetTransformData);
    });
  });
}
