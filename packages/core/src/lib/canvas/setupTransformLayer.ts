import type { MarkupCanvasConfig } from "@/types";

// Sets up the transform layer with proper styles and dimensions
export function setupTransformLayer(transformLayer: HTMLElement, config: Required<MarkupCanvasConfig>): void {
  transformLayer.style.position = "absolute";

  const rulerOffset = config.rulerSize;

  transformLayer.style.top = `${rulerOffset}px`;
  transformLayer.style.left = `${rulerOffset}px`;
  transformLayer.style.width = `${config.width}px`;
  transformLayer.style.height = `${config.height}px`;
  transformLayer.style.transformOrigin = "0 0";
}
