import type { RulerSystem } from "@/types/index.js";

export function toggleRulers(rulers: RulerSystem | null, areRulersVisible: () => boolean): boolean {
  if (rulers) {
    const isVisible = areRulersVisible();
    if (isVisible) {
      rulers.hide();
    } else {
      rulers.show();
    }
    return true;
  }
  return false;
}
