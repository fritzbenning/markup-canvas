import { keyboardRules } from "./keyboardRules";
import type { KeyboardContext } from "./types";
import { matchesKeyboardRule } from "./utils/matchesKeyboardRule";

/**
 * Walks the global {@link keyboardRules} list in order, matches the event against each rule,
 * and runs the first rule whose `run` returns a truthy value (meaning “handled”).
 * Rules with `scope: "default"` are skipped when {@link KeyboardContext.keyboardScope}
 * is `"restricted"`.
 *
 * @param event - The `keydown` event being dispatched.
 * @param ctx - Canvas instance, resolved config, and current keyboard scope.
 * @returns `true` if a rule handled the event (caller should typically `preventDefault`).
 *
 * @example
 * ```ts
 * const handled = dispatchKeyboardRules(event, {
 *   canvas,
 *   config,
 *   keyboardScope: "default",
 * });
 * if (handled) event.preventDefault();
 * ```
 */
export function dispatchKeyboardRules(event: KeyboardEvent, ctx: KeyboardContext): boolean {
  for (const rule of keyboardRules) {
    if (rule.scope === "default" && ctx.keyboardScope !== "default") {
      continue;
    }
    if (!matchesKeyboardRule(event, rule)) {
      continue;
    }
    if (rule.run(event, ctx)) {
      return true;
    }
  }
  return false;
}
