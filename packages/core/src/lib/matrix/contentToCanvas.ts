import type { Point } from "@/types";

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
