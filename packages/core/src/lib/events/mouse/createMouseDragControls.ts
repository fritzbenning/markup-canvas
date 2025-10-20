import type { MouseDragControls } from "@/types/index.js";

export interface MouseDragControlMethods {
  enableMouseDrag: () => boolean;
  disableMouseDrag: () => boolean;
  isMouseDragEnabled: () => boolean;
}

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
