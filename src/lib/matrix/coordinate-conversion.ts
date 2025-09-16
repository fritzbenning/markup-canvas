import type { Point } from "../../types/index.js";

// Converts canvas coordinates to content coordinates
export function canvasToContent(canvasX: number, canvasY: number, matrix: DOMMatrix): Point {
  // Validate inputs
  if (typeof canvasX !== "number" || !Number.isFinite(canvasX)) canvasX = 0;
  if (typeof canvasY !== "number" || !Number.isFinite(canvasY)) canvasY = 0;

  if (!matrix || typeof matrix.inverse !== "function") {
    return { x: canvasX, y: canvasY };
  }

  try {
    // Use inverse matrix to convert from canvas to content space
    const inverseMatrix = matrix.inverse();
    const point = new DOMPoint(canvasX, canvasY);
    const transformed = point.matrixTransform(inverseMatrix);

    return {
      x: transformed.x,
      y: transformed.y,
    };
  } catch (error) {
    console.warn("Matrix inversion failed:", error);
    return { x: canvasX, y: canvasY };
  }
}

// Converts content coordinates to canvas coordinates
export function contentToCanvas(contentX: number, contentY: number, matrix: DOMMatrix): Point {
  // Validate inputs
  if (typeof contentX !== "number" || !Number.isFinite(contentX)) contentX = 0;
  if (typeof contentY !== "number" || !Number.isFinite(contentY)) contentY = 0;

  if (!matrix || typeof matrix.transformPoint !== "function") {
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
    console.warn("Matrix transformation failed:", error);
    return { x: contentX, y: contentY };
  }
}
