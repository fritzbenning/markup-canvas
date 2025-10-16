import { TICK_SETTINGS } from "@/lib/rulers/constants.js";
import type { RulerOptions } from "@/types/index.js";

export function createHorizontalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  tickSpacing: number,
  config: Required<RulerOptions>
): void {
  const tick = document.createElement("div");
  const isMajor = position % (tickSpacing * TICK_SETTINGS.MAJOR_MULTIPLIER) === 0;
  const tickHeight = isMajor ? TICK_SETTINGS.MAJOR_HEIGHT : TICK_SETTINGS.MINOR_HEIGHT;

  tick.style.cssText = `
		position: absolute;
		left: ${pixelPos}px;
		bottom: 0;
		width: 1px;
		height: ${tickHeight}px;
		background: ${isMajor ? config.majorTickColor : config.minorTickColor};
	`;

  container.appendChild(tick);

  const shouldShowLabel = isMajor || position % TICK_SETTINGS.LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    label.style.cssText = `
			position: absolute;
			left: ${pixelPos}px;
			bottom: ${tickHeight}px;
			font-size: ${config.fontSize}px;
			color: ${config.textColor};
			white-space: nowrap;
			pointer-events: none;
		`;
    label.textContent = Math.round(position).toString();
    container.appendChild(label);
  }
}
