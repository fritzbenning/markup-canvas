import { withTheme } from "@/lib/helpers/index.js";
import { TICK_SETTINGS } from "@/lib/rulers/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function createHorizontalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  tickSpacing: number,
  config: Required<MarkupCanvasConfig>
): void {
  const tick = document.createElement("div");
  const isMajor = position % (tickSpacing * TICK_SETTINGS.MAJOR_MULTIPLIER) === 0;
  const tickHeight = isMajor ? TICK_SETTINGS.MAJOR_HEIGHT : TICK_SETTINGS.MINOR_HEIGHT;
  const tickColor = withTheme(
    config,
    isMajor ? config.rulerMajorTickColor : config.rulerMinorTickColor,
    isMajor ? config.rulerMajorTickColorDark : config.rulerMinorTickColorDark
  );

  tick.style.cssText = `
		position: absolute;
		left: ${pixelPos}px;
		bottom: 0;
		width: 1px;
		height: ${tickHeight}px;
		background: ${tickColor};
	`;

  container.appendChild(tick);

  const shouldShowLabel = isMajor || position % TICK_SETTINGS.LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    const textColor = withTheme(config, config.rulerTextColor, config.rulerTextColorDark);

    label.style.cssText = `
			position: absolute;
			left: ${pixelPos}px;
			bottom: ${tickHeight + 1}px;
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
