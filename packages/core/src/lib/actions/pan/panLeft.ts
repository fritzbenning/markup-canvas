import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function panLeft(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const panDistance = config.keyboardPanStep;
  const newTransform: Partial<Transform> = {
    translateX: canvas.transform.translateX + panDistance,
  };
  return updateTransform(newTransform);
}
