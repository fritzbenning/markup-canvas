import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function panDown(
  baseCanvas: BaseCanvas,
  config: Required<MarkupCanvasConfig>,
  updateTransform: (newTransform: Partial<Transform>) => boolean
): boolean {
  const panDistance = config.keyboardPanStep;
  const newTransform: Partial<Transform> = {
    translateY: baseCanvas.transform.translateY - panDistance,
  };
  return updateTransform(newTransform);
}
