import type { Point } from "@/types";

export function canvasToContent(canvasX: number, canvasY: number, matrix: DOMMatrix): Point {
  if (!matrix?.inverse) {
    return { x: canvasX, y: canvasY };
  }

  try {
    const inverseMatrix = matrix.inverse();
    const point = new DOMPoint(canvasX, canvasY);
    const transformed = point.matrixTransform(inverseMatrix);
    return {
      x: transformed.x,
      y: transformed.y,
    };
  } catch (error) {
    console.warn("Canvas to content conversion failed:", error);
    return { x: canvasX, y: canvasY };
  }
}
