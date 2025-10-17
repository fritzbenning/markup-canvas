import type { MarkupCanvasConfig } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createHorizontalRuler(config: Required<MarkupCanvasConfig>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler horizontal-ruler";
  ruler.style.cssText = `
	position: absolute;
	top: 0;
	left: ${config.rulerSize}px;
	right: 0;
	height: ${config.rulerSize}px;
	background: ${config.rulerBackgroundColor};
	border-bottom: 1px solid ${config.rulerBorderColor};
	border-right: 1px solid ${config.rulerBorderColor};
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.rulerFontFamily};
	font-size: ${config.rulerFontSize}px;
	color: ${config.rulerTextColor};
	overflow: hidden;
  `;
  return ruler;
}
