import { DEFAULT_ZOOM, ZOOM_CHANGE_THRESHOLD } from "@/lib/constants";
import { clampZoom } from "@/lib/matrix/clampZoom";
import type { MarkupCanvasConfig, Transform } from "@/types/index";

/**
 * Computes a new pan/zoom transform so the content point under the cursor stays fixed while zooming.
 *
 * When `currentTransform` is omitted, starts from scale {@link DEFAULT_ZOOM} and translation offset for rulers when enabled.
 * If clamped zoom equals the current scale within {@link ZOOM_CHANGE_THRESHOLD}, returns the previous transform unchanged.
 *
 * @param mouseX - Cursor X in the same space as `translateX` (layer/viewport pixels).
 * @param mouseY - Cursor Y in the same space as `translateY`.
 * @param currentTransform - Active transform, or `undefined` to use defaults.
 * @param zoomFactor - Multiplier applied to the current scale before clamping (e.g. `1.1` to zoom in).
 * @param config - Full canvas config; used for zoom bounds and optional ruler inset.
 * @returns The next `scale` and `translateX`/`translateY` for the transform layer.
 */
export function getZoomToMouseTransform(
  mouseX: number,
  mouseY: number,
  currentTransform: Transform,
  zoomFactor: number,
  config: Required<MarkupCanvasConfig>,
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
