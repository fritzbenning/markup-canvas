import { moveExistingContent } from "../content";
import { setupContentLayer } from "./setupContentLayer";
import { setupTransformLayer } from "./setupTransformLayer";
import { CONTENT_LAYER_CLASS, TRANSFORM_LAYER_CLASS } from "@/lib/constants";
import type { MarkupCanvasConfig } from "@/types/index";

/** DOM pair produced when wiring a canvas: scaled layer and inner content target. */
export interface CanvasLayers {
  transformLayer: HTMLElement;
  contentLayer: HTMLElement;
}

/**
 * Ensures transform and content layers exist under `container`, applies layer setup, and moves any pre-existing
 * children into the content layer when a new content layer is created.
 *
 * @param container - Host element (may already contain a transform layer).
 * @param config - Resolved configuration (content dimensions for the transform layer).
 */
export function setupCanvasLayers(container: HTMLElement, config: Required<MarkupCanvasConfig>): CanvasLayers {
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
