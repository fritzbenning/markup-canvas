import { canvasToContent, createMatrix } from "@/lib/matrix";

/**
 * Returns the axis-aligned rectangle of content space that is visible inside the canvas viewport for the given transform.
 *
 * @param canvasWidth - Viewport width in CSS pixels (after ruler deduction in callers).
 * @param canvasHeight - Viewport height in CSS pixels.
 * @param contentWidth - Logical content width.
 * @param contentHeight - Logical content height.
 * @param transform - Current scale and translation applied to the content layer.
 * @returns Visible content-space rectangle `{ x, y, width, height }`, clamped to the content bounds.
 */
export function getVisibleBounds(
  canvasWidth: number,
  canvasHeight: number,
  contentWidth: number,
  contentHeight: number,
  transform: { scale: number; translateX: number; translateY: number }
) {
  const topLeft = canvasToContent(0, 0, createMatrix(transform.scale, transform.translateX, transform.translateY));

  const bottomRight = canvasToContent(canvasWidth, canvasHeight, createMatrix(transform.scale, transform.translateX, transform.translateY));

  return {
    x: Math.max(0, Math.min(contentWidth, topLeft.x)),
    y: Math.max(0, Math.min(contentHeight, topLeft.y)),
    width: Math.max(0, Math.min(contentWidth - topLeft.x, bottomRight.x - topLeft.x)),
    height: Math.max(0, Math.min(contentHeight - topLeft.y, bottomRight.y - topLeft.y)),
  };
}
