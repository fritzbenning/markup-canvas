import { updateGrid } from "@/lib/rulers/update/updateGrid";
import type { RulerCanvas as Canvas, MarkupCanvasConfig } from "@/types/index";
import { updateHorizontalRuler } from "./updateHorizontalRuler";
import { updateVerticalRuler } from "./updateVerticalRuler";

export function updateRulers(
  canvas: Canvas,
  horizontalRuler: HTMLElement,
  verticalRuler: HTMLElement,
  gridOverlay: HTMLElement | undefined,
  config: Required<MarkupCanvasConfig>
): void {
  console.log("updateRulers");

  const bounds = canvas.getBounds();
  const scale = bounds.scale || 1;
  const translateX = bounds.translateX || 0;
  const translateY = bounds.translateY || 0;

  const canvasWidth = bounds.width - config.rulerSize;
  const canvasHeight = bounds.height - config.rulerSize;

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
