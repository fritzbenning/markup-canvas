import { canvasToContent, createMatrix } from "@/lib/matrix";

export function calculateVisibleArea(
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
