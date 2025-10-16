import { updateGrid } from "@/lib/rulers/updateGrid.js";
import type { RulerCanvas as Canvas, RulerOptions } from "@/types/index.js";
import { RULER_SIZE } from "./constants";
import { updateHorizontalRuler } from "./updateHorizontalRuler.js";
import { updateVerticalRuler } from "./updateVerticalRuler.js";

export function updateRulers(
  canvas: Canvas,
  horizontalRuler: HTMLElement,
  verticalRuler: HTMLElement,
  gridOverlay: HTMLElement | undefined,
  config: Required<RulerOptions>
): void {
  const bounds = canvas.getBounds();
  const scale = bounds.scale || 1;
  const translateX = bounds.translateX || 0;
  const translateY = bounds.translateY || 0;

  const canvasWidth = bounds.width - RULER_SIZE;
  const canvasHeight = bounds.height - RULER_SIZE;

  const contentLeft = -translateX / scale;
  const contentTop = -translateY / scale;
  const contentRight = contentLeft + canvasWidth / scale;
  const contentBottom = contentTop + canvasHeight / scale;

  updateHorizontalRuler(horizontalRuler, contentLeft, contentRight, canvasWidth, scale, config);
  updateVerticalRuler(verticalRuler, contentTop, contentBottom, canvasHeight, scale, config);

  if (gridOverlay) {
    updateGrid(gridOverlay, scale, translateX, translateY);
  }
}
