import type { RulerOptions } from "../../types/index.js";
import { TICK_SETTINGS } from "../constants.js";

// Calculate appropriate tick spacing based on zoom level
export function calculateTickSpacing(contentSize: number, canvasSize: number): number {
  const targetTicks = Math.max(5, Math.min(20, canvasSize / 50));
  const rawSpacing = contentSize / targetTicks;

  // Round to nice numbers
  const magnitude = 10 ** Math.floor(Math.log10(rawSpacing));
  const normalized = rawSpacing / magnitude;

  let niceSpacing: number;
  if (normalized <= 1) niceSpacing = 1;
  else if (normalized <= 2) niceSpacing = 2;
  else if (normalized <= 5) niceSpacing = 5;
  else niceSpacing = 10;

  return niceSpacing * magnitude;
}

// Create horizontal tick mark and label
export function createHorizontalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  tickSpacing: number,
  config: Required<RulerOptions>,
): void {
  const tick = document.createElement("div");
  const isMajor = position % (tickSpacing * TICK_SETTINGS.MAJOR_MULTIPLIER) === 0;
  const tickHeight = isMajor ? TICK_SETTINGS.MAJOR_HEIGHT : TICK_SETTINGS.MINOR_HEIGHT;

  tick.style.cssText = `
		position: absolute;
		left: ${pixelPos}px;
		bottom: 0;
		width: 1px;
		height: ${tickHeight}px;
		background: ${isMajor ? config.majorTickColor : config.minorTickColor};
	`;

  container.appendChild(tick);

  // Add label for major ticks or at regular intervals
  const shouldShowLabel = isMajor || position % TICK_SETTINGS.LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    label.style.cssText = `
			position: absolute;
			left: ${pixelPos}px;
			bottom: ${tickHeight}px;
			font-size: ${config.fontSize}px;
			color: ${config.textColor};
			white-space: nowrap;
			pointer-events: none;
		`;
    label.textContent = Math.round(position).toString();
    container.appendChild(label);
  }
}

// Create vertical tick mark and label
export function createVerticalTick(
  container: HTMLElement | DocumentFragment,
  position: number,
  pixelPos: number,
  tickSpacing: number,
  config: Required<RulerOptions>,
): void {
  const tick = document.createElement("div");
  const isMajor = position % (tickSpacing * TICK_SETTINGS.MAJOR_MULTIPLIER) === 0;
  const tickWidth = isMajor ? TICK_SETTINGS.MAJOR_WIDTH : TICK_SETTINGS.MINOR_WIDTH;

  tick.style.cssText = `
		position: absolute;
		top: ${pixelPos}px;
		right: 0;
		width: ${tickWidth}px;
		height: 1px;
		background: ${isMajor ? config.majorTickColor : config.minorTickColor};
	`;

  container.appendChild(tick);

  // Add label for major ticks or at regular intervals
  const shouldShowLabel = isMajor || position % TICK_SETTINGS.LABEL_INTERVAL === 0;
  if (shouldShowLabel) {
    const label = document.createElement("div");
    label.style.cssText = `
			position: absolute;
			top: ${pixelPos - 6}px;
			right: ${tickWidth + 6}px;
			font-size: ${config.fontSize}px;
			color: ${config.textColor};
			white-space: nowrap;
			pointer-events: none;
			transform: rotate(-90deg);
			transform-origin: right center;
		`;
    label.textContent = Math.round(position).toString();
    container.appendChild(label);
  }
}
