import { DEFAULT_ZOOM, ZOOM_CHANGE_THRESHOLD } from "@/lib/constants.js";
import { clampZoom } from "@/lib/matrix/clampZoom.js";
import type { MarkupCanvasConfig, Transform } from "@/types/index.js";

export function getZoomToMouseTransform(
  mouseX: number,
  mouseY: number,
  currentTransform: Transform,
  zoomFactor: number,
  config: Required<MarkupCanvasConfig>
): Transform {
  const rulerOffset = config.enableRulers ? -config.rulerSize : 0;

  const transform = currentTransform || {
    scale: DEFAULT_ZOOM,
    translateX: rulerOffset,
    translateY: rulerOffset,
  };

  const { scale, translateX, translateY } = transform;

  // Calculate new scale with clamping
  const newScale = clampZoom(scale * zoomFactor, config);

  // Early return if zoom didn't change (hit bounds)
  if (Math.abs(newScale - scale) < ZOOM_CHANGE_THRESHOLD) {
    return { scale, translateX, translateY };
  }

  // Convert mouse position to content space
  // Formula: contentPos = (mousePos - translate) / scale
  const contentX = (mouseX - translateX) / scale;
  const contentY = (mouseY - translateY) / scale;

  // Calculate new translation
  // Formula: newTranslate = mousePos - (contentPos * newScale)
  const newTranslateX = mouseX - contentX * newScale;
  const newTranslateY = mouseY - contentY * newScale;

  return {
    scale: newScale,
    translateX: newTranslateX,
    translateY: newTranslateY,
  };
}
