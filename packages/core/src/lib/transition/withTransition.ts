import { disableTransition } from "@/lib/transition/disableTransition.js";
import { enableTransition } from "@/lib/transition/enableTransition.js";
import type { MarkupCanvasConfig } from "@/types";

export function withTransition<T>(element: HTMLElement, config: MarkupCanvasConfig, operation: () => T): T {
  enableTransition(element, config);
  try {
    const result = operation();
    return result;
  } finally {
    disableTransition(element, config);
  }
}
