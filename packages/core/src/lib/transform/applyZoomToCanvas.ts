import { getZoomToMouseTransform } from "@/lib/matrix";
import type { Canvas } from "@/types";

export function applyZoomToCanvas(canvas: Canvas, rawZoomFactor: number, centerX: number, centerY: number): boolean {
  const newTransform = getZoomToMouseTransform(centerX, centerY, canvas.transform, rawZoomFactor, canvas.config);
  return canvas.updateTransform(newTransform);
}
