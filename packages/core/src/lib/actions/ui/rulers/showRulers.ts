import type { RulerSystem } from "@/types/index.js";

export function showRulers(rulers: RulerSystem | null): boolean {
  if (rulers) {
    rulers.show();
    return true;
  }
  return false;
}
