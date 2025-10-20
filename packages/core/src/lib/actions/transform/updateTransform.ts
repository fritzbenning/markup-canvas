import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform } from "@/lib/transform/index.js";
import type { BaseCanvas, Transform } from "@/types/index.js";

export function updateTransform(baseCanvas: BaseCanvas, newTransform: Partial<Transform>): boolean {
  baseCanvas.transform = { ...baseCanvas.transform, ...newTransform };
  const matrix = createMatrix(baseCanvas.transform.scale, baseCanvas.transform.translateX, baseCanvas.transform.translateY);
  return applyTransform(baseCanvas.transformLayer, matrix);
}
