import { getThemeValue } from "@/lib/helpers/index.js";
import { TICK_SETTINGS } from "@/lib/rulers/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function createVerticalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  _tickSpacing: number,
  config: Required<MarkupCanvasConfig>
): void {
  const tick = document.createElement("div");
  const tickColor = getThemeValue(config, "rulerTickColor");

  tick.className = "tick";
  tick.style.cssText = `
		position: absolute;
		top: ${pixelPos}px;
		right: 0;
		width: ${TICK_SETTINGS.TICK_WIDTH}px;
		height: 1px;
		background: ${tickColor};
	`;

  container.appendChild(tick);

  const shouldShowLabel = position % TICK_SETTINGS.TICK_LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    const textColor = getThemeValue(config, "rulerTextColor");

    label.style.cssText = `
			position: absolute;
			top: ${pixelPos - 6}px;
			right: ${TICK_SETTINGS.TICK_WIDTH + 6}px;
			font-size: ${config.rulerFontSize}px;
			line-height: 1;
			color: ${textColor};
			white-space: nowrap;
			pointer-events: none;
			transform: rotate(-90deg);
			transform-origin: right center;
		`;
    label.textContent = Math.round(position).toString();
    container.appendChild(label);
  }
}
