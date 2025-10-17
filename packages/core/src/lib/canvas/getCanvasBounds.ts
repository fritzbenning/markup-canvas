import { calculateVisibleArea } from "@/lib/canvas/calcVisibleArea.js";
import { getEmptyBounds } from "@/lib/canvas/getEmptyBounds.js";
import { withRulerSize } from "@/lib/helpers/index.js";
import type { BaseCanvas, CanvasBounds } from "@/types/index.js";
import { DEFAULT_CONFIG } from "../config/constants";

export function getCanvasBounds(canvas: BaseCanvas): CanvasBounds {
  try {
    const container = canvas.container;
    const config = canvas.config;
    const transform = canvas.transform || {
      scale: 1.0,
      translateX: 0,
      translateY: 0,
    };

    // Get canvas dimensions
    const containerRect = container.getBoundingClientRect();
    const totalWidth = containerRect.width || container.clientWidth || 0;
    const totalHeight = containerRect.height || container.clientHeight || 0;

    // Calculate canvas dimensions accounting for rulers
    const canvasWidth = withRulerSize({ container }, config.rulerSize, (rulerSize) => Math.max(0, totalWidth - rulerSize));
    const canvasHeight = withRulerSize({ container }, config.rulerSize, (rulerSize) => Math.max(0, totalHeight - rulerSize));

    // Get content dimensions
    const contentWidth = config.width || DEFAULT_CONFIG.width;
    const contentHeight = config.height || DEFAULT_CONFIG.height;

    // Calculate visible area in content coordinates
    const visibleArea = calculateVisibleArea(canvasWidth, canvasHeight, contentWidth, contentHeight, transform);

    return {
      // Canvas dimensions
      width: canvasWidth,
      height: canvasHeight,

      // Content dimensions
      contentWidth,
      contentHeight,

      // Current transform
      scale: transform.scale,
      translateX: transform.translateX,
      translateY: transform.translateY,

      // Visible area in content coordinates
      visibleArea,

      // Calculated properties
      scaledContentWidth: contentWidth * transform.scale,
      scaledContentHeight: contentHeight * transform.scale,

      // Bounds checking
      canPanLeft: transform.translateX < 0,
      canPanRight: transform.translateX + contentWidth * transform.scale > canvasWidth,
      canPanUp: transform.translateY < 0,
      canPanDown: transform.translateY + contentHeight * transform.scale > canvasHeight,

      // Zoom bounds
      canZoomIn: transform.scale < 3.5,
      canZoomOut: transform.scale > 0.1,
    };
  } catch (error) {
    console.error("Failed to calculate canvas bounds:", error);
    return getEmptyBounds();
  }
}
