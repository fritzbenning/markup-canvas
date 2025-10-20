import { withFeatureEnabled } from "@/lib/helpers/index.js";
import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform } from "@/lib/transform/index.js";
import type { BaseCanvas, Transform } from "@/types/index.js";

export function updateTransform(baseCanvas: BaseCanvas, newTransform: Partial<Transform>): boolean {
  baseCanvas.transform = { ...baseCanvas.transform, ...newTransform };
  const matrix = createMatrix(baseCanvas.transform.scale, baseCanvas.transform.translateX, baseCanvas.transform.translateY);
  const result = applyTransform(baseCanvas.transformLayer, matrix);

  withFeatureEnabled(baseCanvas.config, "onTransformUpdate", () => {
    baseCanvas.config.onTransformUpdate!(baseCanvas.transform);
  });

  return result;
}
