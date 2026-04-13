import type { Point } from "@/types";

/**
 * Maps a point from the transformed layer’s coordinate system (viewport/canvas pixels) back into content space.
 *
 * Uses the matrix inverse. On failure or a matrix without {@link DOMMatrix#inverse}, returns the input coordinates unchanged.
 *
 * @param canvasX - Horizontal position in layer/viewport space.
 * @param canvasY - Vertical position in layer/viewport space.
 * @param matrix - Transform matrix applied to the layer (same matrix as {@link contentToCanvas}).
 * @returns The corresponding point in content space.
 */
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
