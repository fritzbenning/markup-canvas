import { withFeatureEnabled } from "@/lib/helpers/index.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform } from "@/lib/transform/index.js";
import type { BaseCanvas, MarkupCanvasConfig, Transform } from "@/types/index.js";

export function updateTransform(baseCanvas: BaseCanvas, config: Required<MarkupCanvasConfig>, newTransform: Partial<Transform>): boolean {
  baseCanvas.transform = { ...baseCanvas.transform, ...newTransform };
  const matrix = createMatrix(baseCanvas.transform.scale, baseCanvas.transform.translateX, baseCanvas.transform.translateY);
  const result = applyTransform(baseCanvas.transformLayer, matrix);

  withFeatureEnabled(config, "onTransformUpdate", () => {
    config.onTransformUpdate!(baseCanvas.transform);
  });

  return result;
}
