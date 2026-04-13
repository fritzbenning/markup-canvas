/**
 * Clears click-to-zoom tracking (press time and “has dragged” flag) after a mouse button release.
 *
 * @param setters - State updaters for `mouseDownTime` and `hasDragged`.
 *
 * @example
 * ```ts
 * resetClickState({
 *   setMouseDownTime: (t) => { mouseDownTime = t; },
 *   setHasDragged: (v) => { hasDragged = v; },
 * });
 * ```
 */
export function resetClickState(setters: {
  setMouseDownTime: (value: number) => void;
  setHasDragged: (value: boolean) => void;
}): void {
  setters.setMouseDownTime(0);
  setters.setHasDragged(false);
}
