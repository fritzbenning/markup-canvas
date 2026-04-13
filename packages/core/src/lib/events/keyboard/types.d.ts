import type { MarkupCanvas } from "@/lib/MarkupCanvas";
import type { MarkupCanvasConfig } from "@/types/index";

/**
 * Global keyboard mode for the canvas instance.
 *
 * - `default`: full shortcut set (pan, zoom, reset, UI toggles).
 * - `restricted`: nested content may be handling typing — only non-conflicting shortcuts
 *   (reset, grid, rulers); pan and zoom are suppressed.
 */
export type KeyboardScope = "default" | "restricted";

/**
 * Which global keyboard modes a rule applies to.
 *
 * - `default`: only when {@link KeyboardScope} is `"default"` (e.g. pan/zoom).
 * - `all`: both `default` and `restricted` (omit the field for the same meaning).
 */
export type KeyboardRuleScope = "default" | "all";

export type KeyboardModifier = "ctrl" | "meta" | "shift" | "alt";

/**
 * Everything a keyboard rule needs to invoke canvas APIs and read config.
 *
 * @example
 * ```ts
 * const ctx: KeyboardContext = {
 *   canvas,
 *   config,
 *   keyboardScope: "default",
 * };
 * ```
 */
export type KeyboardContext = {
  canvas: MarkupCanvas;
  config: Required<MarkupCanvasConfig>;
  keyboardScope: KeyboardScope;
};

export type KeyboardRule = {
  id: string;
  /** If `"default"`, the rule is skipped while scope is `"restricted"`. */
  scope?: KeyboardRuleScope;
  /** `event.key` must be one of these (e.g. `["=", "+"]` or `"ArrowLeft"`). */
  keys: string | readonly string[];
  /** All listed modifiers must be held. Omitted or empty = no required modifiers. */
  withModifiers?: readonly KeyboardModifier[];
  /** None of these modifiers may be held. Omitted or empty = no exclusions. */
  withoutModifiers?: readonly KeyboardModifier[];
  /** Return true if the shortcut was handled (caller will preventDefault). */
  run: (event: KeyboardEvent, ctx: KeyboardContext) => boolean;
};

/**
 * Options passed into {@link setupKeyboardEvents} when wiring the keydown listener.
 *
 * @example
 * ```ts
 * setupKeyboardEvents(canvas, config, { keyboardScope: "restricted" });
 * ```
 */
export type SetupKeyboardEventsOptions = {
  keyboardScope?: KeyboardScope;
};
