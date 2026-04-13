import type { MarkupCanvas } from "@/lib/MarkupCanvas";

/**
 * Returns the visible rectangle of the canvas in viewport space, as computed by
 * {@link MarkupCanvas.getBounds} (`bounds.visibleArea`).
 */
export function getVisibleArea(canvas: MarkupCanvas): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const bounds = canvas.getBounds();

  return bounds.visibleArea;
}
