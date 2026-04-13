import { disableTransition } from "@/lib/transition/disableTransition";
import { enableTransition } from "@/lib/transition/enableTransition";
import type { MarkupCanvasConfig } from "@/types";

/**
 * Runs `operation` while a transform transition is enabled, then always tears it down in a `finally` block (even when `operation` throws).
 *
 * @typeParam T - Return type of `operation`.
 * @param element - Target layer element.
 * @param config - Canvas configuration passed to {@link enableTransition} / {@link disableTransition}.
 * @param operation - Synchronous work to perform with transitions active.
 * @returns Whatever `operation` returns.
 */
export function withTransition<T>(element: HTMLElement, config: MarkupCanvasConfig, operation: () => T): T {
  enableTransition(element, config);
  try {
    const result = operation();
    return result;
  } finally {
    disableTransition(element, config);
  }
}
