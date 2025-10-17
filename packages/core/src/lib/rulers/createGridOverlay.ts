import type { RulerOptions } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createGridOverlay(config: Required<RulerOptions>): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "canvas-ruler grid-overlay";
  grid.style.cssText = `
		position: absolute;
		top: ${config.rulerSize}px;
		left: ${config.rulerSize}px;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: ${RULER_Z_INDEX.GRID};
		background-image: 
			linear-gradient(${config.gridColor} 1px, transparent 1px),
			linear-gradient(90deg, ${config.gridColor} 1px, transparent 1px);
		background-size: 100px 100px;
		opacity: 0.5;
	`;
  return grid;
}
