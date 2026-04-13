import type { RulerSystem } from "@/types/index";

/**
 * Shows both rulers when a ruler system is available.
 *
 * @param rulers - Ruler system, or `null` when rulers are disabled.
 * @returns `true` when rulers were shown; `false` when `rulers` is `null`.
 */
export function showRulers(rulers: RulerSystem | null): boolean {
  if (rulers) {
    rulers.show();
    return true;
  }

  return false;
}
