import type { RulerCanvas as Canvas, RulerOptions } from "../../types/index.js";
import { RULER_SIZE } from "../constants.js";
import { rafScheduler } from "../utils/raf-scheduler.js";
import { updateGrid } from "./grid-overlay.js";
import { calculateTickSpacing, createHorizontalTick, createVerticalTick } from "./tick-creation.js";

// Update ruler markings based on current canvas state
export function updateRulers(
  canvas: Canvas,
  horizontalRuler: HTMLElement,
  verticalRuler: HTMLElement,
  gridOverlay: HTMLElement | undefined,
  config: Required<RulerOptions>,
): void {
  const bounds = canvas.getBounds();
  const scale = bounds.scale || 1;
  const translateX = bounds.translateX || 0;
  const translateY = bounds.translateY || 0;

  // Calculate visible content area
  const canvasWidth = bounds.width - RULER_SIZE;
  const canvasHeight = bounds.height - RULER_SIZE;

  // Calculate content coordinates of visible area
  const contentLeft = -translateX / scale;
  const contentTop = -translateY / scale;
  const contentRight = contentLeft + canvasWidth / scale;
  const contentBottom = contentTop + canvasHeight / scale;

  // Update horizontal ruler
  updateHorizontalRuler(horizontalRuler, contentLeft, contentRight, canvasWidth, scale, config);

  // Update vertical ruler
  updateVerticalRuler(verticalRuler, contentTop, contentBottom, canvasHeight, scale, config);

  // Update grid if enabled
  if (gridOverlay) {
    updateGrid(gridOverlay, scale, translateX, translateY);
  }
}

// RAF-optimized ruler updates for high-frequency updates
export function updateRulersRAF(
  canvas: Canvas,
  horizontalRuler: HTMLElement,
  verticalRuler: HTMLElement,
  gridOverlay: HTMLElement | undefined,
  config: Required<RulerOptions>,
): void {
  rafScheduler.schedule(() => {
    updateRulers(canvas, horizontalRuler, verticalRuler, gridOverlay, config);
  });
}

// Update horizontal ruler markings
function updateHorizontalRuler(
  ruler: HTMLElement,
  contentLeft: number,
  contentRight: number,
  canvasWidth: number,
  scale: number,
  config: Required<RulerOptions>,
): void {
  const rulerWidth = canvasWidth;
  const contentWidth = contentRight - contentLeft;

  // Calculate appropriate tick spacing
  const tickSpacing = calculateTickSpacing(contentWidth, rulerWidth);

  // Create document fragment for batched DOM updates
  const fragment = document.createDocumentFragment();

  // Create tick marks and labels
  const startTick = Math.floor(contentLeft / tickSpacing) * tickSpacing;
  const endTick = Math.ceil(contentRight / tickSpacing) * tickSpacing;

  for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
    const pixelPos = (pos - contentLeft) * scale;

    if (pixelPos >= -50 && pixelPos <= rulerWidth + 50) {
      createHorizontalTick(fragment, pos, pixelPos, tickSpacing, config);
    }
  }

  // Batch DOM update: clear and append all at once
  ruler.innerHTML = "";
  ruler.appendChild(fragment);
}

// Update vertical ruler markings
function updateVerticalRuler(
  ruler: HTMLElement,
  contentTop: number,
  contentBottom: number,
  canvasHeight: number,
  scale: number,
  config: Required<RulerOptions>,
): void {
  const rulerHeight = canvasHeight;
  const contentHeight = contentBottom - contentTop;

  // Calculate appropriate tick spacing
  const tickSpacing = calculateTickSpacing(contentHeight, rulerHeight);

  // Create document fragment for batched DOM updates
  const fragment = document.createDocumentFragment();

  // Create tick marks and labels
  const startTick = Math.floor(contentTop / tickSpacing) * tickSpacing;
  const endTick = Math.ceil(contentBottom / tickSpacing) * tickSpacing;

  for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
    const pixelPos = (pos - contentTop) * scale;

    if (pixelPos >= -50 && pixelPos <= rulerHeight + 50) {
      createVerticalTick(fragment, pos, pixelPos, tickSpacing, config);
    }
  }

  // Batch DOM update: clear and append all at once
  ruler.innerHTML = "";
  ruler.appendChild(fragment);
}
