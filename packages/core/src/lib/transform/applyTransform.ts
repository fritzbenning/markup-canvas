import { createMatrixString } from "@/lib/matrix/createMatrixString";

export function applyTransform(element: HTMLElement, matrix: DOMMatrix): boolean {
  if (!element?.style || !matrix) {
    return false;
  }

  try {
    element.style.transform = createMatrixString(matrix);
    return true;
  } catch (error) {
    console.warn("Transform application failed:", error);
    return false;
  }
}
