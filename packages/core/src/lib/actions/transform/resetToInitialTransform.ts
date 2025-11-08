import { DEFAULT_ZOOM } from "@/lib/constants.js";
import { withRulerSize } from "@/lib/helpers/index.js";
import { withTransition } from "@/lib/transition/index.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";
import { updateTransform } from "./updateTransform.js";

export function resetToInitialTransform(canvas: Canvas, transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): boolean {
  return withTransition(transformLayer, config, () => {
    return withRulerSize(canvas, config.rulerSize, (rulerSize) => {
      const initialZoom = config.initialZoom ?? DEFAULT_ZOOM;
      const initialPan = config.initialPan ?? { x: 0, y: 0 };
      const rulerOffset = rulerSize * -1;

      const resetTransformData: Transform = {
        scale: initialZoom,
        translateX: initialPan.x + rulerOffset,
        translateY: initialPan.y + rulerOffset,
      };

      return updateTransform(canvas, resetTransformData);
    });
  });
}
