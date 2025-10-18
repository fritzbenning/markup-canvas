import { withTheme } from "@/lib/helpers/index.js";
import { TICK_SETTINGS } from "@/lib/rulers/constants.js";
import type { MarkupCanvasConfig } from "@/types/index.js";

export function createVerticalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  tickSpacing: number,
  config: Required<MarkupCanvasConfig>
): void {
  const tick = document.createElement("div");
  const isMajor = position % (tickSpacing * TICK_SETTINGS.MAJOR_MULTIPLIER) === 0;
  const tickWidth = isMajor ? TICK_SETTINGS.MAJOR_WIDTH : TICK_SETTINGS.MINOR_WIDTH;
  const tickColor = withTheme(
    config,
    isMajor ? config.rulerMajorTickColor : config.rulerMinorTickColor,
    isMajor ? config.rulerMajorTickColorDark : config.rulerMinorTickColorDark
  );

  tick.style.cssText = `
		position: absolute;
		top: ${pixelPos}px;
		right: 0;
		width: ${tickWidth}px;
		height: 1px;
		background: ${tickColor};
	`;

  container.appendChild(tick);

  const shouldShowLabel = isMajor || position % TICK_SETTINGS.LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    const textColor = withTheme(config, config.rulerTextColor, config.rulerTextColorDark);

    label.style.cssText = `
			position: absolute;
			top: ${pixelPos - 6}px;
			right: ${tickWidth + 6}px;
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
