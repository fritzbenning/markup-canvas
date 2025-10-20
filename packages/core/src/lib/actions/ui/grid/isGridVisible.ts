import type { RulerSystem } from "@/types/index.js";

export function isGridVisible(rulers: RulerSystem | null): boolean {
  if (rulers?.gridOverlay) {
    return rulers.gridOverlay.style.display !== "none";
  }
  return false;
}
