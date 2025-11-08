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
	background: var(--ruler-background-color);
	border-bottom: 1px solid var(--ruler-border-color);
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.rulerFontFamily};
	font-size: ${config.rulerFontSize}px;
	color: var(--ruler-text-color);
	overflow: hidden;
  `;
  return ruler;
}
