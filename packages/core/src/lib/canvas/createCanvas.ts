import { resetTransform, updateTransform } from "@/lib/actions/transform/index.js";
import { resetView, zoomToPoint } from "@/lib/actions/zoom/index.js";
import { createCanvasLayers } from "@/lib/canvas/createCanvasLayers.js";
import { fitToScreen } from "@/lib/canvas/fitToScreen.js";
import { getCanvasBounds } from "@/lib/canvas/getCanvasBounds.js";
import { setupCanvasContainer } from "@/lib/canvas/setupCanvasContainer.js";
import { DEFAULT_ZOOM } from "@/lib/constants.js";
import { canvasToContent } from "@/lib/matrix/canvasToContent.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform, enableHardwareAcceleration } from "@/lib/transform/index.js";
import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

// Creates and initializes a canvas with the required DOM structure
export function createCanvas(container: HTMLElement, config: Required<MarkupCanvasConfig>): BaseCanvas | null {
  if (!container?.appendChild) {
    console.error("Invalid container element provided to createCanvas");
    return null;
  }

  try {
    setupCanvasContainer(container, config);

    const { transformLayer, contentLayer } = createCanvasLayers(container, config);

    // Enable hardware acceleration if requested
    if (config.enableAcceleration) {
      enableHardwareAcceleration(transformLayer);
    }

    const rulerOffset = config.enableRulers ? -config.rulerSize : 0;

    const initialTransform: Transform = {
      scale: DEFAULT_ZOOM,
      translateX: rulerOffset,
      translateY: rulerOffset,
    };

    // Apply initial transform
    const initialMatrix = createMatrix(initialTransform.scale, initialTransform.translateX, initialTransform.translateY);

    applyTransform(transformLayer, initialMatrix);

    const canvas: BaseCanvas = {
      // DOM references
      container,
      transformLayer,
      contentLayer,

      // Configuration
      config: config,

      // Current state
      transform: initialTransform,

      // Utility methods
      getBounds: () => getCanvasBounds(canvas),
      canvasToContent: (x: number, y: number) => {
        const matrix = createMatrix(canvas.transform.scale, canvas.transform.translateX, canvas.transform.translateY);
        return canvasToContent(x, y, matrix);
      },

      // Transform methods
      updateTransform: (newTransform: Partial<Transform>) => updateTransform(canvas, newTransform),
      reset: () => resetTransform(canvas),

      // View and zoom methods
      zoomToPoint: (x: number, y: number, targetScale: number) => zoomToPoint(canvas, transformLayer, config, x, y, targetScale),
      resetView: () => resetView(canvas, transformLayer, config),
      fitToScreen: () => fitToScreen(canvas, transformLayer, config),
    };

    return canvas;
  } catch (error) {
    console.error("Failed to create canvas:", error);
    return null;
  }
}
