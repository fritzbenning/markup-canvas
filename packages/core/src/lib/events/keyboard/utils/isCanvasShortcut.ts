/**
 * Returns whether a key combination is treated as a “canvas” shortcut when forwarding
 * keys to a parent frame in restricted scope — i.e. zoom/reset style chords that should
 * still be delivered even when typing in nested content.
 *
 * @param event - Keyboard event to inspect.
 * @returns `true` for Ctrl/Meta + `0`, `+`, or `-` (browser zoom–style chords).
 *
 * @example
 * ```ts
 * isCanvasShortcut(
 *   new KeyboardEvent("keydown", { key: "0", ctrlKey: true }),
 * ); // true
 *
 * isCanvasShortcut(
 *   new KeyboardEvent("keydown", { key: "a", ctrlKey: true }),
 * ); // false
 * ```
 */
export function isCanvasShortcut(event: KeyboardEvent): boolean {
  if (event.key === "0" && (event.ctrlKey || event.metaKey)) {
    return true;
  }
  if (event.key === "+" && (event.ctrlKey || event.metaKey)) {
    return true;
  }
  if (event.key === "-" && (event.ctrlKey || event.metaKey)) {
    return true;
  }

  return false;
}
