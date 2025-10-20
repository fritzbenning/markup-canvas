import type { RulerSystem } from "@/types/index.js";

export function hideGrid(rulers: RulerSystem | null): boolean {
  if (rulers?.gridOverlay) {
    rulers.gridOverlay.style.display = "none";
    return true;
  }
  return false;
}
