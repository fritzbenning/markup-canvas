import type { Canvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function panDown(
  canvas: Canvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const panDistance = config.keyboardPanStep;
  const newTransform: Partial<Transform> = {
    translateY: canvas.transform.translateY - panDistance,
  };
  return updateTransform(newTransform);
}
