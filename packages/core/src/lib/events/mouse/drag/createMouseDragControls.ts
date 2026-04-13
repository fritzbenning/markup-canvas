import type { MouseDragControls } from "@/types/index";

export interface MouseDragControlMethods {
  enableMouseDrag: () => boolean;
  disableMouseDrag: () => boolean;
  isMouseDragEnabled: () => boolean;
}

/**
 * Wraps a {@link MouseDragControls} instance from {@link setupMouseEvents} so callers can
 * enable, disable, or query mouse drag without holding the full controls object.
 *
 * @param dragSetup - Result of `setupMouseEvents(..., true)`, or `null` if mouse was not set up.
 * @returns Facade whose methods no-op (`false` / `false`) when `dragSetup` is missing.
 *
 * @example
 * ```ts
 * const api = createMouseDragControls(dragSetup);
 * api.disableMouseDrag();
 * ```
 */
export function createMouseDragControls(dragSetup: MouseDragControls | null): MouseDragControlMethods {
  return {
    enableMouseDrag(): boolean {
      return dragSetup?.enable() ?? false;
    },
    disableMouseDrag(): boolean {
      return dragSetup?.disable() ?? false;
    },
    isMouseDragEnabled(): boolean {
      return dragSetup?.isEnabled() ?? false;
    },
  };
}
