import type { MarkupCanvasConfig } from "@/types";

/**
 * Positions the transform layer below/after the ruler inset and sets its pixel size to the configured content dimensions.
 *
 * @param transformLayer - Element whose CSS transform matrix is updated by the canvas.
 * @param config - Resolved configuration (content width/height and ruler size).
 */
export function setupTransformLayer(transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): void {
  transformLayer.style.position = "absolute";

  const rulerOffset = config.rulerSize;

  transformLayer.style.top = `${rulerOffset}px`;
  transformLayer.style.left = `${rulerOffset}px`;
  transformLayer.style.width = `${config.width}px`;
  transformLayer.style.height = `${config.height}px`;
  transformLayer.style.transformOrigin = "0 0";
}
