import { GRID_SETTINGS } from "@/lib/rulers/constants.js";

export function updateGrid(gridOverlay: HTMLElement, scale: number, translateX: number, translateY: number): void {
  let gridSize = GRID_SETTINGS.BASE_SIZE * scale;

  while (gridSize < GRID_SETTINGS.MIN_SIZE) gridSize *= 2;
  while (gridSize > GRID_SETTINGS.MAX_SIZE) gridSize /= 2;

  gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
  gridOverlay.style.backgroundPosition = `${translateX % gridSize}px ${translateY % gridSize}px`;
}
