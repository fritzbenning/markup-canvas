import { calculateTickSpacing, createVerticalTick } from "@/lib/rulers/ticks";
import type { RulerOptions } from "@/types/index.js";

export function updateVerticalRuler(
  ruler: HTMLElement,
  contentTop: number,
  contentBottom: number,
  canvasHeight: number,
  scale: number,
  config: Required<RulerOptions>
): void {
  const rulerHeight = canvasHeight;
  const contentHeight = contentBottom - contentTop;

  const tickSpacing = calculateTickSpacing(contentHeight, rulerHeight);
  const fragment = document.createDocumentFragment();

  const startTick = Math.floor(contentTop / tickSpacing) * tickSpacing;
  const endTick = Math.ceil(contentBottom / tickSpacing) * tickSpacing;

  for (let pos = startTick; pos <= endTick; pos += tickSpacing) {
    const pixelPos = (pos - contentTop) * scale;

    if (pixelPos >= -50 && pixelPos <= rulerHeight + 50) {
      createVerticalTick(fragment, pos, pixelPos, tickSpacing, config);
    }
  }

  ruler.innerHTML = "";
  ruler.appendChild(fragment);
}
