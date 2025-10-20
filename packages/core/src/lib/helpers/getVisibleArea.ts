import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";

export function getVisibleArea(canvas: MarkupCanvas): { x: number; y: number; width: number; height: number } {
  const bounds = canvas.getBounds();
  return bounds.visibleArea;
}
