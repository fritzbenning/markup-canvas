import type { MarkupCanvasConfig } from "@/types/index.js";
import { withTheme } from "@/lib/helpers/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createHorizontalRuler(config: Required<MarkupCanvasConfig>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler horizontal-ruler";
  const backgroundColor = withTheme(config, config.rulerBackgroundColor, config.rulerBackgroundColorDark);
  const borderColor = withTheme(config, config.rulerBorderColor, config.rulerBorderColorDark);
  const textColor = withTheme(config, config.rulerTextColor, config.rulerTextColorDark);
  
  ruler.style.cssText = `
	position: absolute;
	top: 0;
	left: ${config.rulerSize}px;
	right: 0;
	height: ${config.rulerSize}px;
	background: ${backgroundColor};
	border-bottom: 1px solid ${borderColor};
	border-right: 1px solid ${borderColor};
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.rulerFontFamily};
	font-size: ${config.rulerFontSize}px;
	color: ${textColor};
	overflow: hidden;
  `;
  return ruler;
}
