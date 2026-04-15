import { clampZoom } from "@/lib/matrix/clampZoom";
import type { MarkupCanvasConfig } from "@/types/index";
import { ZOOM_SCALE_STEPS } from "./constants";

const REL_EPS = 1e-9;

function stepsInRange(config: Required<MarkupCanvasConfig>): number[] {
  const { minZoom, maxZoom } = config;
  return ZOOM_SCALE_STEPS.filter((s) => s >= minZoom && s <= maxZoom);
}

/** Next scale along `ZOOM_SCALE_STEPS` in the given direction, clamped to config limits. */
export function getNextDiscreteZoomScale(currentScale: number, direction: "in" | "out", config: Required<MarkupCanvasConfig>): number {
  const steps = stepsInRange(config);
  if (steps.length === 0) {
    return clampZoom(currentScale, config);
  }

  const tol = REL_EPS * Math.max(1, Math.abs(currentScale));

  if (direction === "in") {
    const next = steps.find((s) => s > currentScale + tol);
    return next ?? steps[steps.length - 1];
  }

  const prev = steps
    .slice()
    .reverse()
    .find((s) => s < currentScale - tol);
  return prev ?? steps[0];
}
