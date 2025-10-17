import type { MarkupCanvasConfig } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createVerticalRuler(config: Required<MarkupCanvasConfig>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler vertical-ruler";
  ruler.style.cssText = `
	position: absolute;
	top: ${config.rulerSize}px;
	left: 0;
	bottom: 0;
	width: ${config.rulerSize}px;
	background: ${config.rulerBackgroundColor};
	border-right: 1px solid ${config.rulerBorderColor};
	border-bottom: 1px solid ${config.rulerBorderColor};
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.rulerFontFamily};
	font-size: ${config.rulerFontSize}px;
	color: ${config.rulerTextColor};
	overflow: hidden;
  `;
  return ruler;
}
