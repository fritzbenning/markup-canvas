import type { RulerOptions } from "../../types/index.js";
import { RULER_Z_INDEX, RULER_SIZE } from "./constants.js";

export interface RulerElements {
  horizontalRuler: HTMLElement;
  verticalRuler: HTMLElement;
  cornerBox: HTMLElement;
  gridOverlay?: HTMLElement;
}

// Creates all ruler DOM elements
export function createRulerElements(container: HTMLElement, config: Required<RulerOptions>): RulerElements {
  const horizontalRuler = createHorizontalRuler(config);
  const verticalRuler = createVerticalRuler(config);
  const cornerBox = createCornerBox(config);
  const gridOverlay = config.showGrid ? createGridOverlay(config) : undefined;

  // Add elements to container
  container.appendChild(horizontalRuler);
  container.appendChild(verticalRuler);
  container.appendChild(cornerBox);
  if (gridOverlay) {
    container.appendChild(gridOverlay);
  }

  return {
    horizontalRuler,
    verticalRuler,
    cornerBox,
    gridOverlay,
  };
}

function createHorizontalRuler(config: Required<RulerOptions>): HTMLElement {
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

function createVerticalRuler(config: Required<RulerOptions>): HTMLElement {
  const ruler = document.createElement("div");
  ruler.className = "canvas-ruler vertical-ruler";
  ruler.style.cssText = `
		position: absolute;
		top: ${RULER_SIZE}px;
		left: 0;
		bottom: 0;
		width: ${RULER_SIZE}px;
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

function createCornerBox(config: Required<RulerOptions>): HTMLElement {
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

function createGridOverlay(config: Required<RulerOptions>): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "canvas-ruler grid-overlay";
  grid.style.cssText = `
		position: absolute;
		top: ${RULER_SIZE}px;
		left: ${RULER_SIZE}px;
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
