import type { RulerOptions } from "@/types/index.js";
import { RULER_SIZE, RULER_Z_INDEX } from "./constants";

export function createCornerBox(config: Required<RulerOptions>): HTMLElement {
  const corner = document.createElement("div");
  corner.className = "canvas-ruler corner-box";
  corner.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		width: ${RULER_SIZE}px;
		height: ${RULER_SIZE}px;
		background: ${config.backgroundColor};
		border-right: 1px solid ${config.borderColor};
		border-bottom: 1px solid ${config.borderColor};
		z-index: ${RULER_Z_INDEX.CORNER};
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: ${config.fontFamily};
		font-size: ${config.fontSize - 2}px;
		color: ${config.textColor};
		pointer-events: none;
	`;
  corner.textContent = config.units;
  return corner;
}
