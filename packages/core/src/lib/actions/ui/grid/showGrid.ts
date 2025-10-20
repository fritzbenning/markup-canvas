import type { RulerSystem } from "@/types/index.js";

export function showGrid(rulers: RulerSystem | null): boolean {
  if (rulers?.gridOverlay) {
    rulers.gridOverlay.style.display = "block";
    return true;
  }
  return false;
}
