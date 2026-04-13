import { DEFAULT_ZOOM } from "@/lib/constants";
import { withRulerSize } from "@/lib/helpers";
import { withTransition } from "@/lib/transition/index";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";
import { updateTransform } from "./updateTransform";

/**
 * Sets scale to `1` and translation to `(0, 0)` without ruler offsets.
 *
 * @param canvas - Canvas to reset.
 * @returns Whether {@link updateTransform} succeeded.
 */
export function resetToIdentityTransform(canvas: Canvas): boolean {
  const initalTransform: Transform = {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  };

  return updateTransform(canvas, initalTransform);
}

/**
 * Restores the view to {@link MarkupCanvasConfig.initialZoom}, {@link MarkupCanvasConfig.initialPan}, and ruler chrome offsets when rulers are present.
 *
 * @param canvas - Canvas state and container (used to detect ruler elements).
 * @param transformLayer - Layer element used for transition styling.
 * @param config - Resolved configuration.
 * @returns Whether {@link updateTransform} succeeded.
 */
export function resetTransform(
  canvas: Canvas,
  transformLayer: HTMLElement,
  config: Required<MarkupCanvasConfig>,
): boolean {
  return withTransition(transformLayer, config, () => {
    return withRulerSize(canvas, config.rulerSize, (rulerSize) => {
      const initialZoom = config.initialZoom ?? DEFAULT_ZOOM;
      const initialPan = config.initialPan ?? { x: 0, y: 0 };
      const rulerOffset = rulerSize * -1;

      const initialTransformData: Transform = {
        scale: initialZoom,
        translateX: initialPan.x + rulerOffset,
        translateY: initialPan.y + rulerOffset,
      };

      return updateTransform(canvas, initialTransformData);
    });
  });
}
