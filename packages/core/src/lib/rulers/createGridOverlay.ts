import { getThemeValue } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createGridOverlay(config: Required<MarkupCanvasConfig>): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "canvas-ruler grid-overlay";
  const gridColor = getThemeValue(config, "gridColor");

  grid.style.cssText = `
		position: absolute;
		top: ${config.rulerSize}px;
		left: ${config.rulerSize}px;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: ${RULER_Z_INDEX.GRID};
		background-image: 
			linear-gradient(${gridColor} 1px, transparent 1px),
			linear-gradient(90deg, ${gridColor} 1px, transparent 1px);
		background-size: 100px 100px;
		opacity: 0.5;
	`;
  return grid;
}
