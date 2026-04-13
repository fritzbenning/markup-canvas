import type { RulerSystem } from "@/types/index";

/**
 * Shows the alignment grid when a ruler system is available.
 *
 * @param rulers - Ruler/grid controller, or `null` when rulers are disabled.
 * @returns `false` when `rulers` is `null`; otherwise whether {@link RulerSystem.showGrid} succeeded.
 */
export function showGrid(rulers: RulerSystem | null): boolean {
  if (!rulers) {
    return false;
  }

  return rulers.showGrid();
}
