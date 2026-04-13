import type { Point } from "@/types";

/**
 * Maps a point from content space into the coordinate system of the transformed layer (viewport/canvas pixels).
 *
 * On failure or a matrix without {@link DOMMatrix#transformPoint}, returns the input coordinates unchanged.
 *
 * @param contentX - Horizontal position in content space.
 * @param contentY - Vertical position in content space.
 * @param matrix - Transform matrix applied to the layer (typically pan and uniform zoom).
 * @returns The point after applying `matrix`.
 */
export function contentToCanvas(contentX: number, contentY: number, matrix: DOMMatrix): Point {
  if (!matrix?.transformPoint) {
    return { x: contentX, y: contentY };
  }

  try {
    const point = new DOMPoint(contentX, contentY);
    const transformed = point.matrixTransform(matrix);

    return {
      x: transformed.x,
      y: transformed.y,
    };
  } catch (error) {
    console.warn("Content to canvas conversion failed:", error);

    return { x: contentX, y: contentY };
  }
}
