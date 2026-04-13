import type { RulerSystem } from "@/types/index";

/**
 * Returns whether the horizontal ruler element is visible (not `display: none`).
 *
 * @param rulers - Ruler system, or `null` when rulers are disabled.
 * @returns `false` when there is no horizontal ruler element; otherwise visibility from inline `display`.
 */
export function checkRulersVisibility(rulers: RulerSystem | null): boolean {
  if (rulers?.horizontalRuler) {
    return rulers.horizontalRuler.style.display !== "none";
  }

  return false;
}
