import type { RulerSystem } from "@/types/index";

/**
 * Hides both rulers when a ruler system is available.
 *
 * @param rulers - Ruler system, or `null` when rulers are disabled.
 * @returns `true` when rulers were hidden; `false` when `rulers` is `null`.
 */
export function hideRulers(rulers: RulerSystem | null): boolean {
  if (rulers) {
    rulers.hide();
    return true;
  }
  return false;
}
