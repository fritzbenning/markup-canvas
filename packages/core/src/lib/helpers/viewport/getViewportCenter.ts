import type { MarkupCanvas } from "@/lib/MarkupCanvas";

/**
 * Returns the center point of the canvas viewport in **viewport coordinates**
 * (half of `getBounds()` width and height).
 *
 * If `getBounds()` throws, logs a warning and returns `{ x: 0, y: 0 }`.
 */
export function getViewportCenter(canvas: MarkupCanvas): { x: number; y: number } {
  try {
    const bounds = canvas.getBounds();
    return {
      x: bounds.width / 2,
      y: bounds.height / 2,
    };
  } catch (error) {
    console.warn("Failed to calculate viewport center:", error);
    return { x: 0, y: 0 };
  }
}
