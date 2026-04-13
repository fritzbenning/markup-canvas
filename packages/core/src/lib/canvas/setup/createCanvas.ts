import { DEFAULT_ZOOM } from "@/lib/constants";
import { createMatrix } from "@/lib/matrix/createMatrix";
import { applyTransform } from "@/lib/transform/index";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index";
import { setupCanvasContainer } from "./setupCanvasContainer";
import { setupCanvasLayers } from "./setupCanvasLayers";

/**
 * Builds a {@link Canvas} inside `container`: applies container styling, creates transform and content layers,
 * and sets the initial pan/zoom from `config`.
 *
 * @param container - DOM element that will host the canvas; must support `appendChild`.
 * @param config - Resolved markup canvas configuration (dimensions, rulers, initial view).
 * @returns The new canvas state, or `null` when the container is invalid or setup throws.
 */
export function createCanvas(container: HTMLElement, config: Required<MarkupCanvasConfig>): Canvas | null {
  if (!container?.appendChild) {
    console.error("Invalid container element provided to createCanvas");
    return null;
  }

  try {
    setupCanvasContainer(container, config);

    const { transformLayer, contentLayer } = setupCanvasLayers(container, config);

    const rulerOffset = config.enableRulers ? -config.rulerSize : 0;

    const initialTransform: Transform = {
      scale: config.initialZoom ?? DEFAULT_ZOOM,
      translateX: (config.initialPan?.x ?? 0) + rulerOffset,
      translateY: (config.initialPan?.y ?? 0) + rulerOffset,
    };

    // Apply initial transform
    const initialMatrix = createMatrix(initialTransform.scale, initialTransform.translateX, initialTransform.translateY);

    applyTransform(transformLayer, initialMatrix);

    const canvas: Canvas = {
      // DOM references
      container,
      transformLayer,
      contentLayer,

      // Current state
      transform: initialTransform,
    };

    return canvas;
  } catch (error) {
    console.error("Failed to create canvas:", error);
    return null;
  }
}
