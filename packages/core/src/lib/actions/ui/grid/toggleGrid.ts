import type { RulerSystem } from "@/types/index.js";

export function toggleGrid(rulers: RulerSystem | null): boolean {
  if (rulers?.toggleGrid) {
    rulers.toggleGrid();
    return true;
  }
  return false;
}
