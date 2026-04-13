import type { RulerSystem } from "@/types/index";

/**
 * Toggles ruler visibility using `getRulersVisibility` to decide between {@link RulerSystem.hide} and {@link RulerSystem.show}.
 *
 * @param rulers - Ruler system, or `null` when rulers are disabled.
 * @param getRulersVisibility - Current visibility (e.g. from {@link checkRulersVisibility}).
 * @returns `true` when a toggle was performed; `false` when `rulers` is `null`.
 */
export function toggleRulers(rulers: RulerSystem | null, getRulersVisibility: () => boolean): boolean {
  if (rulers) {
    const isVisible = getRulersVisibility();

    if (isVisible) {
      rulers.hide();
    } else {
      rulers.show();
    }
    return true;
  }

  return false;
}
