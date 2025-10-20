import { createMatrix } from "@/lib/matrix/createMatrix.js";
import { applyTransform } from "@/lib/transform/index.js";
import type { Canvas, Transform } from "@/types/index.js";

export function updateTransform(canvas: Canvas, newTransform: Partial<Transform>): boolean {
  canvas.transform = { ...canvas.transform, ...newTransform };
  const matrix = createMatrix(canvas.transform.scale, canvas.transform.translateX, canvas.transform.translateY);
  return applyTransform(canvas.transformLayer, matrix);
}
