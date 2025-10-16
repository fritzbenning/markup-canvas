import { moveExistingContent } from "@/lib/canvas/moveExistingContent.js";
import { setupContentLayer } from "@/lib/canvas/setupContentLayer.js";
import { setupTransformLayer } from "@/lib/canvas/setupTransformLayer.js";
import { CONTENT_LAYER_CLASS, TRANSFORM_LAYER_CLASS } from "@/lib/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export interface CanvasLayers {
  transformLayer: HTMLElement;
  contentLayer: HTMLElement;
}

export function createCanvasLayers(container: HTMLElement, config: Required<MarkupCanvasConfig>): CanvasLayers {
  const existingContent = Array.from(container.children);

  // Create or find transform layer
  let transformLayer = container.querySelector(`.${TRANSFORM_LAYER_CLASS}`) as HTMLElement;
  if (!transformLayer) {
    transformLayer = document.createElement("div");
    transformLayer.className = TRANSFORM_LAYER_CLASS;
    container.appendChild(transformLayer);
  }

  setupTransformLayer(transformLayer, config);

  // Create or find content layer
  let contentLayer = transformLayer.querySelector(`.${CONTENT_LAYER_CLASS}`) as HTMLElement;
  if (!contentLayer) {
    contentLayer = document.createElement("div");
    contentLayer.className = CONTENT_LAYER_CLASS;
    transformLayer.appendChild(contentLayer);

    moveExistingContent(existingContent, contentLayer, transformLayer);
  }

  // Set content layer properties
  setupContentLayer(contentLayer);

  return { transformLayer, contentLayer };
}
