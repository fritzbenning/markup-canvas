import type { RulerSystem } from "@/types/index";

/**
 * Toggles grid visibility when a ruler system is available.
 *
 * @param rulers - Ruler/grid controller, or `null` when rulers are disabled.
 * @returns `true` when a toggle was performed; `false` when `rulers` is `null`.
 */
export function toggleGrid(rulers: RulerSystem | null): boolean {
  if (rulers) {
    rulers.toggleGrid();
    return true;
  }

  return false;
}
