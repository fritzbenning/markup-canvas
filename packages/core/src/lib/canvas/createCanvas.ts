import { createCanvasLayers } from "@/lib/canvas/createCanvasLayers.js";
import { setupCanvasContainer } from "@/lib/canvas/setupCanvasContainer.js";
import { DEFAULT_ZOOM } from "@/lib/constants.js";
import { withFeatureEnabled } from "@/lib/helpers/index.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform, enableHardwareAcceleration } from "@/lib/transform/index.js";
import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function createCanvas(container: HTMLElement, config: Required<MarkupCanvasConfig>): Canvas | null {
  if (!container?.appendChild) {
    console.error("Invalid container element provided to createCanvas");
    return null;
  }

  try {
    setupCanvasContainer(container, config);

    const { transformLayer, contentLayer } = createCanvasLayers(container, config);

    withFeatureEnabled(config, "enableAcceleration", () => {
      enableHardwareAcceleration(transformLayer);
    });

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
