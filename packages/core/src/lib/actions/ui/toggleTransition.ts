/**
 * Returns the opposite of `enableTransition` (used to flip the transition-enabled flag).
 *
 * @param enableTransition - Current transition-enabled state.
 * @returns Negated boolean flag.
 */
export function toggleTransition(enableTransition: boolean): boolean {
  return !enableTransition;
}
