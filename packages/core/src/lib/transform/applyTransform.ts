import { createMatrixString } from "@/lib/matrix/createMatrixString";

/**
 * Sets `element.style.transform` from a 2D {@link DOMMatrix}.
 *
 * @param element - Element whose CSS `transform` is updated.
 * @param matrix - Matrix serialized with {@link createMatrixString}.
 * @returns Whether the transform was applied (`false` if `element` is missing).
 */
export function applyTransform(element: HTMLElement, matrix: DOMMatrix): boolean {
  if (!element) {
    return false;
  }

  element.style.transform = createMatrixString(matrix);
  return true;
}
