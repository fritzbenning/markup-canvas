import { CLICK_THRESHOLDS } from "@/lib/events/constants.js";
import { withRulerOffset } from "@/lib/helpers/index.js";
import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { withTransition } from "@/lib/transition/withTransition.js";
import type { MarkupCanvasConfig, Transform } from "@/types/index.js";

export function handleClickToZoom(
  event: MouseEvent,
  canvas: MarkupCanvas,
  config: Required<MarkupCanvasConfig>,
  mouseDownTime: number,
  hasDragged: boolean,
  isDragging: boolean
): void {
  const clickDuration = Date.now() - mouseDownTime;

  // Check if Option/Alt key is required and pressed
  const optionKeyPressed = event.altKey;
  const shouldZoom = config.requireOptionForClickZoom ? optionKeyPressed : true;

  if (clickDuration < CLICK_THRESHOLDS.MAX_DURATION && !hasDragged && !isDragging && shouldZoom) {
    event.preventDefault();

    const rect = canvas.container.getBoundingClientRect();
    const rawClickX = event.clientX - rect.left;
    const rawClickY = event.clientY - rect.top;

    const { clickX, clickY } = withRulerOffset(canvas, rawClickX, rawClickY, config.rulerSize, (adjustedX, adjustedY) => ({
      clickX: adjustedX,
      clickY: adjustedY,
    }));

    // Convert canvas coordinates to content coordinates at current scale
    const contentCoords = canvas.canvasToContent(clickX, clickY);

    // Calculate the center of the canvas
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;

    const newScale = config.clickZoomLevel;

    const newTranslateX = canvasCenterX - contentCoords.x * newScale;
    const newTranslateY = canvasCenterY - contentCoords.y * newScale;

    const newTransform: Partial<Transform> = {
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    };

    withTransition(canvas.transformLayer, canvas.config, () => {
      canvas.updateTransform(newTransform);
    });
  }
}
