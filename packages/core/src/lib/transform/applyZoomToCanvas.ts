import type { MarkupCanvas } from "@/lib/MarkupCanvas";

/**
 * Applies a multiplicative zoom step while keeping the pivot fixed under {@link MarkupCanvas.zoomToPoint}.
 *
 * @param canvas - Target canvas.
 * @param rawZoomMultiplier - Factor applied to the current scale (e.g. `1.1` zooms in 10%).
 * @param pivotX - Pivot X in the same viewport/layer space as wheel and touch handlers (after ruler offset).
 * @param pivotY - Pivot Y in the same space.
 * @returns Whether the zoom was applied.
 */
export function applyZoomToCanvas(
  canvas: MarkupCanvas,
  rawZoomMultiplier: number,
  pivotX: number,
  pivotY: number,
): boolean {
  const scale = canvas.transform.scale;
  if (!Number.isFinite(rawZoomMultiplier) || rawZoomMultiplier <= 0 || !Number.isFinite(scale) || scale <= 0) {
    return false;
  }
  const targetScale = scale * rawZoomMultiplier;
  return canvas.zoomToPoint(pivotX, pivotY, targetScale);
}
