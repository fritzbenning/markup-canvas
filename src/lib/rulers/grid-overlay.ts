import { GRID_SETTINGS } from "../constants";
import { rafScheduler } from "../utils/raf-scheduler.js";

// Update grid overlay based on current transform
export function updateGrid(
  gridOverlay: HTMLElement,
  scale: number,
  translateX: number,
  translateY: number,
): void {
  // Calculate grid size based on scale
  let gridSize = GRID_SETTINGS.BASE_SIZE * scale;

  // Adjust grid size for readability
  while (gridSize < GRID_SETTINGS.MIN_SIZE) gridSize *= 2;
  while (gridSize > GRID_SETTINGS.MAX_SIZE) gridSize /= 2;

  gridOverlay.style.backgroundSize = `${gridSize}px ${gridSize}px`;
  gridOverlay.style.backgroundPosition = `${translateX % gridSize}px ${translateY % gridSize}px`;
}

// RAF-optimized grid updates
export function updateGridRAF(
  gridOverlay: HTMLElement,
  scale: number,
  translateX: number,
  translateY: number,
): void {
  rafScheduler.schedule(() => {
    updateGrid(gridOverlay, scale, translateX, translateY);
  });
}
