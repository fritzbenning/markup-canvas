import type { RulerOptions } from "@/types/index.js";
import { RULER_SIZE, RULER_Z_INDEX } from "./constants";

export function createHorizontalRuler(config: Required<RulerOptions>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler horizontal-ruler";
  ruler.style.cssText = `
	position: absolute;
	top: 0;
	left: ${RULER_SIZE}px;
	right: 0;
	height: ${RULER_SIZE}px;
	background: ${config.backgroundColor};
	border-bottom: 1px solid ${config.borderColor};
	border-right: 1px solid ${config.borderColor};
	z-index: ${RULER_Z_INDEX.RULERS};
	pointer-events: none;
	font-family: ${config.fontFamily};
	font-size: ${config.fontSize}px;
	color: ${config.textColor};
	overflow: hidden;
  `;
  return ruler;
}
