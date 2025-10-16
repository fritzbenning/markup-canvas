import { FALLBACK_TRANSITION_DURATION } from "@/lib/constants";
import { withDebounce } from "@/lib/helpers/index.js";
import type { MarkupCanvasConfig } from "@/types";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

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
