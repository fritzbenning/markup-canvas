import type { MarkupCanvasConfig } from "@/types";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

/**
 * Turns on a linear CSS `transform` transition on `element` when `config.enableTransition` is true.
 *
 * Clears `window.__markupCanvasTransitionTimeout` if one is pending so stale timeouts do not fire after a new transition starts.
 *
 * @param element - Element whose inline `transition` style is set.
 * @param config - Canvas configuration; `enableTransition` and `transitionDuration` control whether and how long the transition runs (seconds).
 * @returns `true` if a transition was applied, `false` if transitions are disabled or an error occurred (errors are logged to the console).
 */
export function enableTransition(element: HTMLElement, config: MarkupCanvasConfig): boolean {
  try {
    if (config.enableTransition) {
      if (window.__markupCanvasTransitionTimeout) {
        clearTimeout(window.__markupCanvasTransitionTimeout);
        window.__markupCanvasTransitionTimeout = undefined;
      }

      element.style.transition = `transform ${config.transitionDuration}s linear`;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to enable transitions:", error);
    return false;
  }
}
