import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import { getVisibleArea } from "./getVisibleArea";

/**
 * Returns whether the point `(x, y)` lies inside the current visible area
 * (inclusive of the right and bottom edges).
 */
export function isPointVisible(canvas: MarkupCanvas, x: number, y: number): boolean {
  const visibleArea = getVisibleArea(canvas);
  return (
    x >= visibleArea.x &&
    x <= visibleArea.x + visibleArea.width &&
    y >= visibleArea.y &&
    y <= visibleArea.y + visibleArea.height
  );
}
