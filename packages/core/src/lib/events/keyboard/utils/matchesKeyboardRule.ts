import type { KeyboardModifier, KeyboardRule } from "../types";

/**
 * Returns whether a modifier key from the rule is currently held on the event.
 *
 * @internal
 */
function modifierActive(event: KeyboardEvent, modifier: KeyboardModifier): boolean {
  switch (modifier) {
    case "ctrl":
      return event.ctrlKey;
    case "meta":
      return event.metaKey;
    case "shift":
      return event.shiftKey;
    case "alt":
      return event.altKey;
  }
}

/**
 * Checks whether a keyboard event satisfies a rule’s key and modifier constraints.
 * Used to decide if a shortcut rule should run before invoking its `run` handler.
 *
 * @param event - DOM keyboard event (`key` and modifier flags are read).
 * @param rule - Subset of {@link KeyboardRule}: which keys and which modifiers must / must not be active.
 * @returns `true` if `event.key` is allowed and all `withModifiers` are held and none of `withoutModifiers` are held.
 *
 * @example
 * ```ts
 * const rule = { keys: "s", withModifiers: ["ctrl"] as const };
 * matchesKeyboardRule(
 *   new KeyboardEvent("keydown", { key: "s", ctrlKey: true }),
 *   rule,
 * ); // true
 *
 * matchesKeyboardRule(
 *   new KeyboardEvent("keydown", { key: "s", ctrlKey: false }),
 *   rule,
 * ); // false
 * ```
 */
export function matchesKeyboardRule(
  event: KeyboardEvent,
  rule: Pick<KeyboardRule, "keys" | "withModifiers" | "withoutModifiers">,
): boolean {
  const keys = typeof rule.keys === "string" ? [rule.keys] : rule.keys;
  if (!keys.includes(event.key)) {
    return false;
  }
  for (const m of rule.withModifiers ?? []) {
    if (!modifierActive(event, m)) {
      return false;
    }
  }
  for (const m of rule.withoutModifiers ?? []) {
    if (modifierActive(event, m)) {
      return false;
    }
  }
  return true;
}
