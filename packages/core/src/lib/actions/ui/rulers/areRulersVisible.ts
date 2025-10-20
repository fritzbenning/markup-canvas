import type { RulerSystem } from "@/types/index.js";

export function areRulersVisible(rulers: RulerSystem | null): boolean {
  if (rulers?.horizontalRuler) {
    return rulers.horizontalRuler.style.display !== "none";
  }
  return false;
}
