import { getThemeValue } from "@/lib/helpers/index.js";
import { TICK_SETTINGS } from "@/lib/rulers/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function createHorizontalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  _tickSpacing: number,
  config: Required<MarkupCanvasConfig>
): void {
  const tick = document.createElement("div");
  const tickColor = getThemeValue(config, "rulerTickColor");

  tick.style.cssText = `
		position: absolute;
		left: ${pixelPos}px;
		bottom: 0;
		width: 1px;
		height: ${TICK_SETTINGS.TICK_HEIGHT}px;
		background: ${tickColor};
	`;

  container.appendChild(tick);

  const shouldShowLabel = position % TICK_SETTINGS.TICK_LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    const textColor = getThemeValue(config, "rulerTextColor");

    label.style.cssText = `
			position: absolute;
			left: ${pixelPos}px;
			bottom: ${TICK_SETTINGS.TICK_HEIGHT + 2}px;
			font-size: ${config.rulerFontSize}px;
			line-height: 1;
			color: ${textColor};
			white-space: nowrap;
			pointer-events: none;
		`;
    label.textContent = Math.round(position).toString();
    container.appendChild(label);
  }
}
