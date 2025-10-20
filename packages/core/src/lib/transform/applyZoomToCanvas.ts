import type { MarkupCanvas } from "@/lib/MarkupCanvas.js";
import { getZoomToMouseTransform } from "@/lib/matrix";

export function applyZoomToCanvas(canvas: MarkupCanvas, rawZoomFactor: number, centerX: number, centerY: number): boolean {
  const newTransform = getZoomToMouseTransform(centerX, centerY, canvas.transform, rawZoomFactor, canvas.config);
  return canvas.updateTransform(newTransform);
}
