import { createMatrix } from "@/lib/matrix/createMatrix";
import type { Canvas, Transform } from "@/types/index";
import { applyTransform } from "./applyTransform";

/**
 * Merges `newTransform` into `canvas.transform`, rebuilds the CSS matrix, and applies it to `canvas.transformLayer`.
 *
 * @param canvas - Canvas whose transform and layer are updated.
 * @param newTransform - Partial transform fields to merge.
 * @returns Whether {@link applyTransform} succeeded.
 */
export function updateTransform(canvas: Canvas, newTransform: Partial<Transform>): boolean {
  canvas.transform = { ...canvas.transform, ...newTransform };

  const matrix = createMatrix(canvas.transform.scale, canvas.transform.translateX, canvas.transform.translateY);

  return applyTransform(canvas.transformLayer, matrix);
}
