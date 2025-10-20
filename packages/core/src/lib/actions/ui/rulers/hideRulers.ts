import type { RulerSystem } from "@/types/index.js";

export function hideRulers(rulers: RulerSystem | null): boolean {
  if (rulers) {
    rulers.hide();
    return true;
  }
  return false;
}
