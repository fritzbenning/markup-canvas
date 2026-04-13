import { FALLBACK_TRANSITION_DURATION } from "@/lib/constants";
import { withDebounce } from "@/lib/helpers";
import type { MarkupCanvasConfig } from "@/types";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

/**
 * Schedules turning off the transform transition by setting `element.style.transition` to `"none"` after the configured delay.
 *
 * The delay matches the transition duration (`config.transitionDuration` or {@link FALLBACK_TRANSITION_DURATION}) so the browser can finish the in-flight transform animation before styles are reset. Uses debouncing ({@link withDebounce}) so overlapping calls collapse to a single scheduled update.
 *
 * @param element - Element whose `transition` style will be cleared when the timer fires.
 * @param config - Canvas configuration; must have `enableTransition` true for anything to be scheduled.
 * @returns `false` if transitions are disabled in config; `true` if a disable was scheduled or if an error was caught (errors are logged to the console).
 */
export function disableTransition(element: HTMLElement, config: MarkupCanvasConfig): boolean {
  try {
    if (config.enableTransition) {
      if (window.__markupCanvasTransitionTimeout) {
        clearTimeout(window.__markupCanvasTransitionTimeout);
        window.__markupCanvasTransitionTimeout = undefined;
      }

      const delay = (config.transitionDuration ?? FALLBACK_TRANSITION_DURATION) * 1000;
      withDebounce("disableTransition", delay, () => {
        element.style.transition = "none";
        window.__markupCanvasTransitionTimeout = undefined;
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to disable transitions:", error);
    return true;
  }
}
