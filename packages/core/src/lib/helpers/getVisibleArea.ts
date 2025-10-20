import type { Canvas } from "@/types/index.js";

export function getVisibleArea(canvas: Canvas): { x: number; y: number; width: number; height: number } {
  const bounds = canvas.getBounds();
  return bounds.visibleArea;
}
