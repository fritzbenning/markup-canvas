import type { MarkupCanvasConfig } from "@/types";

declare global {
  interface Window {
    __markupCanvasTransitionTimeout?: number;
  }
}

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
