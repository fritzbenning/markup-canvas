import type { RulerSystem } from "@/types/index";

/**
 * Returns whether the grid is currently visible according to the ruler system.
 *
 * @param rulers - Ruler/grid controller, or `null` when rulers are disabled.
 * @returns `false` when `rulers` is `null`; otherwise the result of {@link RulerSystem.isGridVisible}.
 */
export function checkGridVisibility(rulers: RulerSystem | null): boolean {
  if (!rulers) {
    return false;
  }

  return rulers.isGridVisible();
}
