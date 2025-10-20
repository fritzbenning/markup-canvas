import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function scrollToPoint(
  baseCanvas: BaseCanvas,
  _config: Required<MarkupCanvasConfig>,
  x: number,
  y: number,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const bounds = baseCanvas.getBounds();
  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;

  // Calculate new translation to center the point
  const newTranslateX = centerX - x * baseCanvas.transform.scale;
  const newTranslateY = centerY - y * baseCanvas.transform.scale;

  return updateTransform({
    translateX: newTranslateX,
    translateY: newTranslateY,
  });
}
