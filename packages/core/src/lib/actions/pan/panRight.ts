import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function panRight(
  baseCanvas: BaseCanvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const panDistance = config.keyboardPanStep;
  const newTransform: Partial<Transform> = {
    translateX: baseCanvas.transform.translateX - panDistance,
  };
  return updateTransform(newTransform);
}
