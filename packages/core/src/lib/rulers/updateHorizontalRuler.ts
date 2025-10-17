import type { MarkupCanvasConfig } from "@/types/index.js";
import { calculateTickSpacing } from "./ticks/calculateTickSpacing.js";
import { createHorizontalTick } from "./ticks/createHorizontalTick.js";

export function updateHorizontalRuler(
  ruler: HTMLElement,
  contentLeft: number,
  contentRight: number,
  canvasWidth: number,
  scale: number,
  config: Required<MarkupCanvasConfig>
): void {
  const rulerWidth = canvasWidth;
  const contentWidth = contentRight - contentLeft;

  const tickSpacing = calculateTickSpacing(contentWidth, rulerWidth);
  const fragment = document.createDocumentFragment();

  const startTick = Math.floor(contentLeft / tickSpacing) * tickSpacing;
  const endTick = Math.ceil(contentRight / tickSpacing) * tickSpacing;

  for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
    const pixelPos = (pos - contentLeft) * scale;

    if (pixelPos >= -50 && pixelPos <= rulerWidth + 50) {
      createHorizontalTick(fragment, pos, pixelPos, tickSpacing, config);
    }
  }

  ruler.innerHTML = "";
  ruler.appendChild(fragment);
}
