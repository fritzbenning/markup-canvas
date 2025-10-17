import type { RulerOptions } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createVerticalRuler(config: Required<RulerOptions>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler vertical-ruler";
  ruler.style.cssText = `
	position: absolute;
	top: ${config.rulerSize}px;
	left: 0;
	bottom: 0;
	width: ${config.rulerSize}px;
	background: ${config.backgroundColor};
	border-right: 1px solid ${config.borderColor};
	border-bottom: 1px solid ${config.borderColor};
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.fontFamily};
	font-size: ${config.fontSize}px;
	color: ${config.textColor};
	overflow: hidden;
  `;
  return ruler;
}
