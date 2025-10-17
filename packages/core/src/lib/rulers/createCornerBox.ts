import type { MarkupCanvasConfig } from "@/types/index.js";
import { RULER_Z_INDEX } from "./constants";

export function createCornerBox(config: Required<MarkupCanvasConfig>): HTMLElement {
  const corner = document.createElement("div");
  corner.className = "canvas-ruler corner-box";
  corner.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: ${config.rulerSize}px;
		height: ${config.rulerSize}px;
		background: ${config.rulerBackgroundColor};
		border-right: 1px solid ${config.rulerBorderColor};
		border-bottom: 1px solid ${config.rulerBorderColor};
		z-index: ${RULER_Z_INDEX.CORNER};
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: ${config.rulerFontFamily};
		font-size: ${config.rulerFontSize - 2}px;
		color: ${config.rulerTextColor};
		pointer-events: none;
	`;
  corner.textContent = config.rulerUnits;
  return corner;
}
